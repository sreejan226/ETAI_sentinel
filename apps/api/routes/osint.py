import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APPS_ROOT))

from fastapi import APIRouter, Query
from osint.collector import collect_osint

router = APIRouter()


@router.get("/lookup")
async def osint_lookup(
    entity: str = Query(...),
    entity_type: str = Query("auto", description="phone | upi | domain | email | username | auto"),
):
    return await collect_osint(entity, entity_type)
