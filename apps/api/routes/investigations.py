import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APPS_ROOT))

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models import Investigation, Complaint
from shared.schemas import InvestigationReport
from services.investigation import run_investigation

router = APIRouter()


@router.get("/search")
async def search_entity(
    q: str = Query(..., description="Phone, UPI, domain, email, or Telegram"),
    db: AsyncSession = Depends(get_db),
):
    """Search and trigger full investigation for an entity."""
    report = await run_investigation(q, db)
    return report


@router.get("/{investigation_id}")
async def get_investigation(investigation_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Investigation).where(Investigation.id == investigation_id))
    inv = result.scalar_one_or_none()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigation not found")
    return {
        "id": inv.id,
        "entity": inv.entity,
        "entity_type": inv.entity_type,
        "threat_score": inv.threat_score,
        "status": inv.status,
        "report": InvestigationReport(**inv.report) if inv.report else None,
        "created_at": inv.created_at,
    }


@router.get("/")
async def list_investigations(limit: int = 20, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Investigation).order_by(Investigation.created_at.desc()).limit(limit)
    )
    return [
        {
            "id": i.id,
            "entity": i.entity,
            "entity_type": i.entity_type,
            "threat_score": i.threat_score,
            "status": i.status,
            "created_at": i.created_at,
        }
        for i in result.scalars().all()
    ]
