import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

APPS_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APPS_ROOT))

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from database import get_db
from models import Complaint, Investigation
from shared.schemas import DashboardStats

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    today_count = await db.scalar(
        select(func.count()).select_from(Complaint).where(Complaint.created_at >= today)
    )
    high_risk = await db.scalar(
        select(func.count()).select_from(Complaint).where(Complaint.threat_score >= 70)
    )
    active_inv = await db.scalar(
        select(func.count()).select_from(Investigation).where(Investigation.status == "active")
    )
    deepfake = await db.scalar(
        select(func.count()).select_from(Complaint).where(
            Complaint.classification["scam_type"].as_string() == "deepfake"
        )
    ) or 0
    avg_score = await db.scalar(select(func.avg(Complaint.threat_score))) or 0.0

    return DashboardStats(
        today_complaints=today_count or 0,
        high_risk_accounts=high_risk or 0,
        active_investigations=active_inv or 0,
        deepfake_cases=deepfake,
        new_upi_ids=3,
        avg_threat_score=round(float(avg_score), 1),
        highest_risk_district="Mumbai",
        emerging_scam="UPI refund scam",
        trending_upi="scammer@paytm",
        top_scam_category="upi_fraud",
    )


@router.get("/summary")
async def get_ai_summary(db: AsyncSession = Depends(get_db)):
    return {
        "summary": (
            "Fraud activity increased 12% this week. UPI refund scams dominate in Maharashtra. "
            "3 high-risk accounts linked via shared device fingerprint. Recommend patrol in Andheri zone."
        ),
        "suggested_patrol": "Andheri East, Mumbai",
        "trending_entities": [
            {"type": "upi", "value": "fraud@ybl", "reports": 14},
            {"type": "phone", "value": "+919876543210", "reports": 9},
        ],
    }
