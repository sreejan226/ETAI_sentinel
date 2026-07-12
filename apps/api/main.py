import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APPS_ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import get_settings
from database import init_db
from graph import neo4j_client
from routes import complaints, investigations, dashboard, osint, graph, geo
from services.health import check_all


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    await init_db()
    neo4j_ok = await neo4j_client.init_neo4j(
        settings.neo4j_uri, settings.neo4j_user, settings.neo4j_password
    )
    app.state.neo4j_connected = neo4j_ok
    yield
    await neo4j_client.close_neo4j()


settings = get_settings()

app = FastAPI(
    title="SentinelAI API",
    description="AI-Powered Fraud Intelligence & Investigation Platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaints.router, prefix="/api/complaints", tags=["Complaints"])
app.include_router(investigations.router, prefix="/api/investigations", tags=["Investigations"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(osint.router, prefix="/api/osint", tags=["OSINT"])
app.include_router(graph.router, prefix="/api/graph", tags=["Knowledge Graph"])
app.include_router(geo.router, prefix="/api/geo", tags=["Geospatial"])


@app.get("/health")
async def health():
    services = await check_all()
    all_ok = all(s.get("status") == "ok" for s in services.values())
    return {
        "status": "ok" if all_ok else "degraded",
        "service": "sentinelai-api",
        "services": services,
    }
