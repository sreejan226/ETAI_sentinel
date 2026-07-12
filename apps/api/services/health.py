"""Check local service connectivity (PostgreSQL, Redis, Neo4j)."""

import asyncio
import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APPS_ROOT))

import redis.asyncio as aioredis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from config import get_settings
from graph import neo4j_client


async def check_postgres(database_url: str) -> dict:
    try:
        engine = create_async_engine(database_url)
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        await engine.dispose()
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


async def check_redis(redis_url: str) -> dict:
    try:
        client = aioredis.from_url(redis_url, decode_responses=True)
        await client.ping()
        await client.aclose()
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


async def check_all() -> dict:
    settings = get_settings()
    postgres, redis_status = await asyncio.gather(
        check_postgres(settings.database_url),
        check_redis(settings.redis_url),
    )
    return {
        "postgres": postgres,
        "redis": redis_status,
        "neo4j": {"status": "ok" if neo4j_client.is_connected() else "error", "detail": "Not connected"},
    }
