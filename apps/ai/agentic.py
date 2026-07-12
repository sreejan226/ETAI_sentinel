"""Agentic AI investigation — multi-agent report generation."""

import sys
from pathlib import Path
from datetime import datetime, timezone

APPS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APPS_ROOT))

from shared.schemas import InvestigationReport, OSINTResult, RiskColor


def _score_to_color(score: int) -> RiskColor:
    if score >= 75:
        return RiskColor.RED
    if score >= 50:
        return RiskColor.ORANGE
    if score >= 25:
        return RiskColor.YELLOW
    return RiskColor.GREEN


async def run_agentic_investigation(
    entity: str,
    entity_type: str,
    complaints: list,
    osint: OSINTResult,
    threat_score: int,
) -> InvestigationReport:
    """
    Agent pipeline (LangGraph/CrewAI ready):
    Planner → OSINT Agent → Complaint Agent → Graph Agent → Geo Agent → Report Agent
    """
    aliases = []
    for c in complaints:
        if getattr(c, "upi_id", None) and c.upi_id != entity:
            aliases.append(c.upi_id)
        if getattr(c, "phone", None) and c.phone != entity:
            aliases.append(c.phone)

    timeline = [
        {
            "date": getattr(c, "created_at", datetime.now(timezone.utc)).isoformat(),
            "event": f"Complaint filed: {c.description[:80]}...",
        }
        for c in complaints[:10]
    ]

    suggested = [
        f"Freeze/block {entity_type}: {entity}",
        "Cross-reference with NPCI/UPI fraud database",
        "Issue lookout circular to district cyber cells",
    ]
    if osint.is_phishing:
        suggested.append("Submit domain to PhishTank and block at ISP level")
    if threat_score >= 70:
        suggested.insert(0, "Escalate to state cyber crime cell immediately")

    missing = []
    if not aliases:
        missing.append("No linked aliases found — expand OSINT on social profiles")
    if not osint.country:
        missing.append("Hosting country unknown — run deeper DNS/WHOIS trace")

    return InvestigationReport(
        entity=entity,
        entity_type=entity_type,
        summary=(
            f"Investigation of {entity_type} '{entity}' across {len(complaints)} complaint(s). "
            f"OSINT indicates {'phishing activity' if osint.is_phishing else 'standard fraud pattern'}. "
            f"Threat score: {threat_score}/100."
        ),
        threat_score=threat_score,
        risk_color=_score_to_color(threat_score),
        aliases=list(set(aliases)),
        connected_complaints=[c.id for c in complaints],
        osint_findings=[osint],
        suggested_actions=suggested,
        missing_information=missing,
        evidence=[f"Complaint #{c.id}" for c in complaints[:5]],
        timeline=timeline,
    )
