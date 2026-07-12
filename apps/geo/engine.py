"""Geospatial intelligence engine."""

import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APPS_ROOT))

from shared.schemas import GeoHotspot, RiskColor

# Demo India hotspots
DEMO_HOTSPOTS = [
    GeoHotspot(lat=19.076, lng=72.877, intensity=0.9, complaint_count=142, district="Mumbai", risk_level=RiskColor.RED),
    GeoHotspot(lat=28.613, lng=77.209, intensity=0.75, complaint_count=98, district="Delhi", risk_level=RiskColor.ORANGE),
    GeoHotspot(lat=12.971, lng=77.594, intensity=0.6, complaint_count=67, district="Bengaluru", risk_level=RiskColor.ORANGE),
    GeoHotspot(lat=17.385, lng=78.486, intensity=0.45, complaint_count=41, district="Hyderabad", risk_level=RiskColor.YELLOW),
    GeoHotspot(lat=22.572, lng=88.363, intensity=0.55, complaint_count=53, district="Kolkata", risk_level=RiskColor.YELLOW),
    GeoHotspot(lat=18.520, lng=73.856, intensity=0.7, complaint_count=78, district="Pune", risk_level=RiskColor.ORANGE),
    GeoHotspot(lat=13.082, lng=80.270, intensity=0.4, complaint_count=35, district="Chennai", risk_level=RiskColor.YELLOW),
    GeoHotspot(lat=23.022, lng=72.571, intensity=0.35, complaint_count=28, district="Ahmedabad", risk_level=RiskColor.GREEN),
]

_geo_index: list[dict] = []


async def update_geo_index(complaint):
    if complaint.location:
        _geo_index.append({
            "complaint_id": complaint.id,
            "location": complaint.location,
            "threat_score": complaint.threat_score or 0,
        })


async def get_heatmap() -> list[dict]:
    return [
        {"lat": h.lat, "lng": h.lng, "weight": h.intensity}
        for h in DEMO_HOTSPOTS
    ]


async def get_hotspots() -> list[GeoHotspot]:
    return DEMO_HOTSPOTS


async def get_district_rankings() -> list[dict]:
    return sorted(
        [
            {"district": h.district, "complaints": h.complaint_count, "risk": h.risk_level.value}
            for h in DEMO_HOTSPOTS
        ],
        key=lambda x: x["complaints"],
        reverse=True,
    )
