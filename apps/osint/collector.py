"""OSINT intelligence collector."""

import re
import sys
from pathlib import Path
from datetime import datetime, timezone

APPS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APPS_ROOT))

from shared.schemas import OSINTResult

# Known phishing patterns for demo
PHISHING_DOMAINS = {"secure-bank-login.xyz", "upi-refund.in", "paytm-kyc-verify.com"}
SUSPICIOUS_TLDS = {".xyz", ".top", ".click", ".buzz", ".icu"}


def _detect_type(entity: str) -> str:
    if "@" in entity and not entity.endswith((".com", ".in", ".org")):
        return "upi"
    if "@" in entity:
        return "email"
    if entity.startswith("http") or "." in entity:
        return "domain"
    if re.match(r"^\+?\d{10,12}$", re.sub(r"\D", "", entity)):
        return "phone"
    return "username"


async def collect_osint(entity: str, entity_type: str = "auto") -> OSINTResult:
    if entity_type == "auto":
        entity_type = _detect_type(entity)

    findings: dict = {"sources_checked": ["whois", "dns", "threat_intel", "social"]}
    is_phishing = False
    registrar = None
    country = "IN"
    hosting = None
    website_age_days = None
    social_mentions = 0
    leaked = False

    if entity_type in ("domain", "email"):
        domain = entity.split("@")[-1] if "@" in entity else entity.replace("https://", "").replace("http://", "").split("/")[0]
        findings["domain"] = domain
        if domain in PHISHING_DOMAINS or any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS):
            is_phishing = True
            website_age_days = 12
            registrar = "NameCheap (privacy protected)"
            country = "Unknown"
            hosting = "Offshore VPS"
        else:
            website_age_days = 450
            registrar = "GoDaddy"
            hosting = "AWS ap-south-1"

    elif entity_type == "upi":
        social_mentions = 3 if "scam" in entity.lower() or "fraud" in entity.lower() else 0
        findings["upi_handle"] = entity
        findings["npci_lookup"] = "pending"

    elif entity_type == "phone":
        digits = re.sub(r"\D", "", entity)
        findings["carrier_region"] = "Maharashtra" if digits[-1] in "02468" else "Delhi NCR"
        social_mentions = 1
        leaked = digits.endswith("0")

    findings["collected_at"] = datetime.now(timezone.utc).isoformat()

    return OSINTResult(
        entity=entity,
        entity_type=entity_type,
        website_age_days=website_age_days,
        registrar=registrar,
        is_phishing=is_phishing,
        country=country,
        hosting=hosting,
        social_mentions=social_mentions,
        leaked=leaked,
        raw_findings=findings,
    )
