import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APPS_ROOT))

from fastapi import APIRouter
from geo.engine import get_heatmap, get_district_rankings, get_hotspots

router = APIRouter()


@router.get("/heatmap")
async def heatmap():
    return await get_heatmap()


@router.get("/districts")
async def district_rankings():
    return await get_district_rankings()


@router.get("/hotspots")
async def hotspots():
    return await get_hotspots()
