"""Knowledge graph — Neo4j when available, in-memory fallback."""

import sys
from pathlib import Path

APPS_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APPS_ROOT))

from shared.schemas import GraphData, GraphNode, GraphEdge, ClassificationResult
from graph import neo4j_client

_graph_store: dict[str, list] = {"nodes": [], "edges": []}


async def ingest_complaint_to_graph(complaint, classification: ClassificationResult):
    if neo4j_client.is_connected():
        await _ingest_neo4j(complaint, classification)
    else:
        _ingest_memory(complaint, classification)


async def _ingest_neo4j(complaint, classification: ClassificationResult):
    async with neo4j_client.get_session() as session:
        await session.run(
            """
            MERGE (c:Complaint {id: $id})
            SET c.label = $label, c.amount = $amount, c.location = $location,
                c.threat_score = $threat_score
            """,
            id=complaint.id,
            label=f"Complaint {complaint.id[:8]}",
            amount=complaint.amount,
            location=complaint.location,
            threat_score=complaint.threat_score,
        )
        for phone in classification.entities.phone_numbers:
            await session.run(
                """
                MERGE (p:Phone {id: $phone})
                SET p.label = $phone
                WITH p
                MATCH (c:Complaint {id: $cid})
                MERGE (c)-[:reported]->(p)
                """,
                phone=phone,
                cid=complaint.id,
            )
        for upi in classification.entities.upi_ids:
            await session.run(
                """
                MERGE (u:UPI {id: $upi})
                SET u.label = $upi
                WITH u
                MATCH (c:Complaint {id: $cid})
                MERGE (c)-[:paid_to]->(u)
                """,
                upi=upi,
                cid=complaint.id,
            )
        for url in classification.entities.urls:
            await session.run(
                """
                MERGE (w:Website {id: $url})
                SET w.label = $url
                WITH w
                MATCH (c:Complaint {id: $cid})
                MERGE (c)-[:connected]->(w)
                """,
                url=url,
                cid=complaint.id,
            )


def _ingest_memory(complaint, classification: ClassificationResult):
    complaint_node = GraphNode(
        id=complaint.id,
        label=f"Complaint {complaint.id[:8]}",
        type="Complaint",
        properties={"amount": complaint.amount, "location": complaint.location},
        threat_score=complaint.threat_score,
    )
    _graph_store["nodes"].append(complaint_node.model_dump())

    for phone in classification.entities.phone_numbers:
        node_id = f"phone:{phone}"
        _graph_store["nodes"].append(GraphNode(id=node_id, label=phone, type="Phone").model_dump())
        _graph_store["edges"].append(
            GraphEdge(id=f"{complaint.id}-{node_id}", source=complaint.id, target=node_id, label="reported").model_dump()
        )

    for upi in classification.entities.upi_ids:
        node_id = f"upi:{upi}"
        _graph_store["nodes"].append(GraphNode(id=node_id, label=upi, type="UPI").model_dump())
        _graph_store["edges"].append(
            GraphEdge(id=f"{complaint.id}-{node_id}", source=complaint.id, target=node_id, label="paid_to").model_dump()
        )


async def get_entity_graph(entity: str) -> GraphData:
    if neo4j_client.is_connected():
        return await _query_neo4j(entity)
    return _query_memory(entity)


async def _query_neo4j(entity: str) -> GraphData:
    async with neo4j_client.get_session() as session:
        result = await session.run(
            """
            MATCH (n)
            WHERE toLower(coalesce(n.label, '')) CONTAINS toLower($q)
               OR toLower(coalesce(n.id, '')) CONTAINS toLower($q)
            OPTIONAL MATCH (n)-[r]-(m)
            RETURN n, r, m
            LIMIT 100
            """,
            q=entity,
        )
        rows = await result.data()
        if not rows:
            return _demo_graph(entity)

        seen_nodes: dict[str, GraphNode] = {}
        edges: list[GraphEdge] = []
        edge_id = 0

        def add_node(raw):
            if raw is None:
                return None
            props = dict(raw)
            nid = props.get("id") or raw.element_id
            if nid not in seen_nodes:
                seen_nodes[nid] = GraphNode(
                    id=nid,
                    label=props.get("label", str(nid)),
                    type=list(raw.labels)[0] if raw.labels else "Unknown",
                    threat_score=props.get("threat_score"),
                )
            return nid

        for row in rows:
            src_id = add_node(row.get("n"))
            tgt_id = add_node(row.get("m"))
            rel = row.get("r")
            if rel and src_id and tgt_id:
                edge_id += 1
                edges.append(GraphEdge(id=f"e{edge_id}", source=src_id, target=tgt_id, label=rel.type))

        return GraphData(nodes=list(seen_nodes.values()), edges=edges)


def _query_memory(entity: str) -> GraphData:
    entity_lower = entity.lower()
    nodes, edges, seen = [], [], set()

    for n in _graph_store["nodes"]:
        if entity_lower in n.get("label", "").lower() or entity_lower in n.get("id", "").lower():
            if n["id"] not in seen:
                nodes.append(GraphNode(**n))
                seen.add(n["id"])

    node_ids = {n.id for n in nodes}
    for e in _graph_store["edges"]:
        if e["source"] in node_ids or e["target"] in node_ids:
            edges.append(GraphEdge(**e))
            for nid in [e["source"], e["target"]]:
                if nid not in seen:
                    match = next((n for n in _graph_store["nodes"] if n["id"] == nid), None)
                    if match:
                        nodes.append(GraphNode(**match))
                        seen.add(nid)

    if not nodes:
        return _demo_graph(entity)
    return GraphData(nodes=nodes, edges=edges)


def _demo_graph(entity: str) -> GraphData:
    return GraphData(
        nodes=[
            GraphNode(id=f"entity:{entity}", label=entity, type="Unknown", threat_score=45),
            GraphNode(id="complaint:demo", label="Demo Complaint", type="Complaint", threat_score=60),
        ],
        edges=[GraphEdge(id="e1", source="complaint:demo", target=f"entity:{entity}", label="reported")],
    )


async def get_complaint_graph(complaint_id: str) -> GraphData:
    if neo4j_client.is_connected():
        async with neo4j_client.get_session() as session:
            result = await session.run(
                """
                MATCH (c:Complaint {id: $id})
                OPTIONAL MATCH (c)-[r]-(n)
                RETURN c, collect(r) AS rels, collect(n) AS neighbors
                """,
                id=complaint_id,
            )
            record = await result.single()
            if not record:
                return await get_entity_graph(complaint_id)

            c_props = dict(record["c"])
            complaint_node_id = c_props.get("id", complaint_id)
            nodes = [GraphNode(
                id=complaint_node_id,
                label=c_props.get("label", complaint_id),
                type="Complaint",
                threat_score=c_props.get("threat_score"),
            )]
            edges = []
            for i, rel in enumerate(record["rels"] or []):
                if rel is None:
                    continue
                neighbor = record["neighbors"][i] if i < len(record["neighbors"]) else None
                if neighbor:
                    n_props = dict(neighbor)
                    neighbor_id = n_props.get("id", neighbor.element_id)
                    nodes.append(GraphNode(
                        id=neighbor_id,
                        label=n_props.get("label", str(neighbor_id)),
                        type=list(neighbor.labels)[0] if neighbor.labels else "Unknown",
                    ))
                    edges.append(GraphEdge(
                        id=f"e{i}",
                        source=complaint_node_id,
                        target=neighbor_id,
                        label=rel.type,
                    ))
            return GraphData(nodes=nodes, edges=edges)

    return _query_memory(complaint_id)
