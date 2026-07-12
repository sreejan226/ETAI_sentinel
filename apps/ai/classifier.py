"""AI complaint classifier — extracts entities and threat assessment."""

import json
import re
import httpx
import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APPS_ROOT))

from shared.schemas import (
    ClassificationResult,
    ExtractedEntities,
    ScamCategory,
    ThreatLevel,
)
from shared.utils import (
    extract_phones,
    extract_upi_ids,
    extract_emails,
    extract_urls,
    extract_telegram,
    extract_amount,
)

CLASSIFIER_PROMPT = """You are an Indian cyber crime analyst.
Analyze this complaint and respond with JSON only:
{
  "scam_type": "upi_fraud|phishing|loan_scam|job_scam|investment_scam|romance_scam|deepfake|impersonation|other",
  "risk": "low|medium|high|critical",
  "summary": "brief summary",
  "priority": 1-5,
  "confidence": 0.0-1.0,
  "victim_intent": "what victim was trying to do",
  "recommended_action": "next step for law enforcement"
}

Complaint:
"""


def _rule_based_classify(text: str) -> ClassificationResult:
    """Fallback classifier using regex + keyword heuristics."""
    lower = text.lower()
    entities = ExtractedEntities(
        phone_numbers=extract_phones(text),
        upi_ids=extract_upi_ids(text),
        emails=extract_emails(text),
        urls=extract_urls(text),
        telegram_handles=extract_telegram(text),
    )

    scam_type = ScamCategory.OTHER
    risk = ThreatLevel.MEDIUM

    if any(k in lower for k in ["upi", "paytm", "phonepe", "gpay", "bhim"]):
        scam_type = ScamCategory.UPI_FRAUD
        risk = ThreatLevel.HIGH
    elif any(k in lower for k in ["loan", "emi", "credit"]):
        scam_type = ScamCategory.LOAN_SCAM
    elif any(k in lower for k in ["job", "wfh", "work from home", "hiring"]):
        scam_type = ScamCategory.JOB_SCAM
    elif any(k in lower for k in ["invest", "trading", "crypto", "bitcoin"]):
        scam_type = ScamCategory.INVESTMENT_SCAM
    elif any(k in lower for k in ["phish", "otp", "login", "password", "bank"]):
        scam_type = ScamCategory.PHISHING
        risk = ThreatLevel.HIGH
    elif any(k in lower for k in ["deepfake", "face swap", "cloned voice"]):
        scam_type = ScamCategory.DEEPFAKE
        risk = ThreatLevel.CRITICAL
    elif any(k in lower for k in ["romance", "dating", "love"]):
        scam_type = ScamCategory.ROMANCE_SCAM

    amount = extract_amount(text)
    if amount and amount > 50000:
        risk = ThreatLevel.CRITICAL
    elif amount and amount > 10000:
        risk = ThreatLevel.HIGH

    return ClassificationResult(
        scam_type=scam_type,
        risk=risk,
        entities=entities,
        summary=f"Detected {scam_type.value.replace('_', ' ')} with {len(entities.phone_numbers)} phone(s) and {len(entities.upi_ids)} UPI ID(s).",
        priority=4 if risk in (ThreatLevel.HIGH, ThreatLevel.CRITICAL) else 2,
        confidence=0.75,
        victim_intent="Financial transaction or service interaction",
        recommended_action="Block UPI/phone, preserve evidence, trace transaction chain",
        amount=amount,
    )


async def _ollama_classify(text: str, base_url: str = "http://localhost:11434", model: str = "llama3.3") -> ClassificationResult | None:
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{base_url}/api/generate",
                json={"model": model, "prompt": CLASSIFIER_PROMPT + text, "stream": False},
            )
            if resp.status_code != 200:
                return None
            raw = resp.json().get("response", "")
            match = re.search(r"\{.*\}", raw, re.DOTALL)
            if not match:
                return None
            data = json.loads(match.group())
            base = _rule_based_classify(text)
            return ClassificationResult(
                scam_type=ScamCategory(data.get("scam_type", base.scam_type.value)),
                risk=ThreatLevel(data.get("risk", base.risk.value)),
                entities=base.entities,
                summary=data.get("summary", base.summary),
                priority=int(data.get("priority", base.priority)),
                confidence=float(data.get("confidence", 0.85)),
                victim_intent=data.get("victim_intent", base.victim_intent),
                recommended_action=data.get("recommended_action", base.recommended_action),
                amount=base.amount,
            )
    except Exception:
        return None


async def classify_complaint(text: str, use_ollama: bool = False) -> ClassificationResult:
    if use_ollama:
        result = await _ollama_classify(text)
        if result:
            return result
    return _rule_based_classify(text)
