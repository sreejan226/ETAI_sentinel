import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(APPS_ROOT))

from fastapi import APIRouter, Query
from graph.service import get_entity_graph, get_complaint_graph

router = APIRouter()


@router.get("/entity")
async def entity_graph(entity: str = Query(...)):
    return await get_entity_graph(entity)


@router.get("/complaint/{complaint_id}")
async def complaint_graph(complaint_id: str):
    return await get_complaint_graph(complaint_id)
