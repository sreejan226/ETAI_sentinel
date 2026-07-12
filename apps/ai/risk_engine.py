"""Fraud risk scoring engine — 0-100 threat score."""

import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APPS_ROOT))

from shared.schemas import ClassificationResult, OSINTResult, ThreatLevel


THREAT_WEIGHTS = {
    ThreatLevel.LOW: 10,
    ThreatLevel.MEDIUM: 25,
    ThreatLevel.HIGH: 45,
    ThreatLevel.CRITICAL: 60,
}


def compute_threat_score(
    classification: ClassificationResult,
    osint_results: list[OSINTResult],
    complaint_count: int = 1,
    deepfake_score: float = 0.0,
    graph_centrality: float = 0.0,
) -> int:
    score = THREAT_WEIGHTS.get(classification.risk, 20)
    score += min(complaint_count * 5, 25)
    score += int(classification.confidence * 10)

    for osint in osint_results:
        if osint.is_phishing:
            score += 15
        if osint.leaked:
            score += 10
        if osint.social_mentions > 5:
            score += 5
        if osint.website_age_days is not None and osint.website_age_days < 30:
            score += 10

    score += int(deepfake_score * 20)
    score += int(graph_centrality * 15)

    if classification.amount and classification.amount > 50000:
        score += 10

    return min(max(score, 0), 100)
