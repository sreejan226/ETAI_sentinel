"""End-to-end complaint processing pipeline."""

import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APPS_ROOT))

from sqlalchemy import select
from database import async_session
from models import Complaint, Investigation
from ai.classifier import classify_complaint
from ai.risk_engine import compute_threat_score
from osint.collector import collect_osint
from graph.service import ingest_complaint_to_graph
from geo.engine import update_geo_index
from shared.schemas import RiskColor


def score_to_color(score: int) -> str:
    if score >= 75:
        return RiskColor.RED.value
    if score >= 50:
        return RiskColor.ORANGE.value
    if score >= 25:
        return RiskColor.YELLOW.value
    return RiskColor.GREEN.value


async def process_complaint(complaint_id: str):
    async with async_session() as db:
        result = await db.execute(select(Complaint).where(Complaint.id == complaint_id))
        complaint = result.scalar_one_or_none()
        if not complaint:
            return

        text = complaint.description
        if complaint.phone:
            text += f" Phone: {complaint.phone}"
        if complaint.upi_id:
            text += f" UPI: {complaint.upi_id}"
        if complaint.website:
            text += f" Website: {complaint.website}"

        classification = await classify_complaint(text)
        complaint.classification = classification.model_dump()

        osint_results = []
        for upi in classification.entities.upi_ids[:3]:
            osint_results.append(await collect_osint(upi, "upi"))
        for phone in classification.entities.phone_numbers[:3]:
            osint_results.append(await collect_osint(phone, "phone"))
        for url in classification.entities.urls[:2]:
            osint_results.append(await collect_osint(url, "domain"))

        threat_score = compute_threat_score(classification, osint_results, complaint_count=1)
        complaint.threat_score = threat_score
        complaint.risk_color = score_to_color(threat_score)
        complaint.status = "investigated"

        await ingest_complaint_to_graph(complaint, classification)
        await update_geo_index(complaint)

        primary_entity = (
            complaint.upi_id
            or (classification.entities.upi_ids[0] if classification.entities.upi_ids else None)
            or complaint.phone
            or (classification.entities.phone_numbers[0] if classification.entities.phone_numbers else None)
        )
        if primary_entity:
            inv = Investigation(
                entity=primary_entity,
                entity_type="upi" if "@" in primary_entity else "phone",
                complaint_ids=[complaint.id],
                threat_score=threat_score,
                report={
                    "entity": primary_entity,
                    "entity_type": "upi" if "@" in primary_entity else "phone",
                    "summary": classification.summary,
                    "threat_score": threat_score,
                    "risk_color": score_to_color(threat_score),
                    "suggested_actions": [classification.recommended_action or "File FIR and block entity"],
                    "osint_findings": [r.model_dump() for r in osint_results],
                },
            )
            db.add(inv)

        await db.commit()
