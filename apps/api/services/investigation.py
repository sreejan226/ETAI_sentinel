import sys
from pathlib import Path
import uuid

APPS_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APPS_ROOT))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from models import Complaint, Investigation
from ai.classifier import classify_complaint
from ai.agentic import run_agentic_investigation
from ai.risk_engine import compute_threat_score
from osint.collector import collect_osint
from shared.schemas import InvestigationReport, RiskColor
from shared.utils import normalize_phone, normalize_upi


def detect_entity_type(entity: str) -> str:
    if "@" in entity and "." not in entity.split("@")[-1]:
        return "upi"
    if "@" in entity:
        return "email"
    if entity.startswith("http") or "." in entity:
        return "domain"
    if entity.startswith("t.me") or entity.startswith("@"):
        return "telegram"
    digits = "".join(c for c in entity if c.isdigit())
    if len(digits) >= 10:
        return "phone"
    return "username"


def score_to_color(score: int) -> RiskColor:
    if score >= 75:
        return RiskColor.RED
    if score >= 50:
        return RiskColor.ORANGE
    if score >= 25:
        return RiskColor.YELLOW
    return RiskColor.GREEN


async def run_investigation(entity: str, db: AsyncSession) -> InvestigationReport:
    entity_type = detect_entity_type(entity)
    normalized = entity
    if entity_type == "phone":
        normalized = normalize_phone(entity)
    elif entity_type == "upi":
        normalized = normalize_upi(entity)

    result = await db.execute(
        select(Complaint).where(
            or_(
                Complaint.phone.contains(normalized),
                Complaint.upi_id.contains(normalized),
                Complaint.website.contains(normalized),
                Complaint.description.contains(entity),
            )
        )
    )
    related = result.scalars().all()

    osint = await collect_osint(normalized, entity_type)
    classification = await classify_complaint(
        f"Investigate entity: {entity}. Related complaints: {len(related)}"
    )
    threat_score = compute_threat_score(classification, [osint], complaint_count=len(related))

    report = await run_agentic_investigation(
        entity=normalized,
        entity_type=entity_type,
        complaints=related,
        osint=osint,
        threat_score=threat_score,
    )

    inv = Investigation(
        id=str(uuid.uuid4()),
        entity=normalized,
        entity_type=entity_type,
        complaint_ids=[c.id for c in related],
        threat_score=threat_score,
        report=report.model_dump(),
        status="active",
    )
    db.add(inv)
    await db.commit()

    return report
