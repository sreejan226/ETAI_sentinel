"""Neo4j async driver — connect to locally installed Neo4j (no Docker)."""

from neo4j import AsyncGraphDatabase

_driver = None
_connected = False


async def init_neo4j(uri: str, user: str, password: str) -> bool:
    global _driver, _connected
    try:
        _driver = AsyncGraphDatabase.driver(uri, auth=(user, password))
        async with _driver.session() as session:
            await session.run("RETURN 1")
            for label in ("Complaint", "Phone", "UPI", "Website", "Person", "Location", "Telegram", "Wallet"):
                await session.run(
                    f"CREATE CONSTRAINT IF NOT EXISTS FOR (n:{label}) REQUIRE n.id IS UNIQUE"
                )
        _connected = True
        return True
    except Exception:
        _connected = False
        if _driver:
            await _driver.close()
            _driver = None
        return False


async def close_neo4j():
    global _driver, _connected
    if _driver:
        await _driver.close()
        _driver = None
    _connected = False


def is_connected() -> bool:
    return _connected and _driver is not None


def get_session():
    if not _driver:
        raise RuntimeError("Neo4j not connected")
    return _driver.session()
