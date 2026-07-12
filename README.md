<!-- markdownlint-disable MD060 MD034 -->

# SentinelAI

AI-powered fraud intelligence and investigation platform for hackathons.

SentinelAI is built around a simple idea: every anonymous complaint should become structured intelligence. The system extracts entities, enriches them with OSINT, scores risk, links related cases in a graph, and shows the result in an investigator-friendly dashboard.

## What Each Service Does

### Backend flow

1. `FastAPI` receives anonymous complaints and investigation requests.
2. `AI classifier` extracts scam type, entities, risk level, and recommended action.
3. `OSINT collector` adds public signals like domain age, phishing hints, and social mentions.
4. `Risk engine` turns AI + OSINT + complaint volume into a 0-100 threat score.
5. `Graph service` stores linked entities in Neo4j, with an in-memory fallback if Neo4j is down.
6. `Geo engine` keeps demo hotspots and district risk data for heatmaps and patrol planning.
7. `Agentic investigation` composes the final investigation report with suggested actions and missing evidence.

### Frontend flow

1. The landing page explains the platform and routes users into the product.
2. The dashboard shows risk metrics, geospatial signals, and graph summaries.
3. The anonymous complaint page captures the intake fields needed for entity extraction.
4. The investigation page searches by phone, UPI, domain, email, or Telegram and shows the report view.
5. The report page formats the final case into a printable PDF-style output.

## Environment Variables

Copy [.env.example](.env.example) to `.env` at the repository root.

### Required / core

| Key                     | Purpose                                                      | Default / Example                                                  |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `DATABASE_URL`          | PostgreSQL connection used by SQLAlchemy                     | `postgresql+asyncpg://sentinel:sentinel@localhost:5432/sentinelai` |
| `REDIS_URL`             | Redis connection for queueing and health checks              | `redis://localhost:6379/0`                                         |
| `CELERY_BROKER_URL`     | Celery task broker                                           | `redis://localhost:6379/0`                                         |
| `CELERY_RESULT_BACKEND` | Celery result store                                          | `redis://localhost:6379/1`                                         |
| `USE_CELERY`            | Set `true` to use Celery instead of FastAPI background tasks | `false`                                                            |
| `NEO4J_URI`             | Neo4j Bolt endpoint                                          | `bolt://localhost:7687`                                            |
| `NEO4J_USER`            | Neo4j username                                               | `neo4j`                                                            |
| `NEO4J_PASSWORD`        | Neo4j password                                               | `sentinelai`                                                       |
| `API_HOST`              | Host for the FastAPI server                                  | `0.0.0.0`                                                          |
| `API_PORT`              | FastAPI port                                                 | `8000`                                                             |
| `CORS_ORIGINS`          | Allowed frontend origin(s)                                   | `http://localhost:3000`                                            |

### AI / optional

| Key               | Purpose                                            | Default / Example        |
| ----------------- | -------------------------------------------------- | ------------------------ |
| `OLLAMA_BASE_URL` | Local Ollama endpoint for the complaint classifier | `http://localhost:11434` |
| `OLLAMA_MODEL`    | Ollama model name                                  | `llama3.3`               |
| `GEMINI_API_KEY`  | Reserved for Gemini-backed classification          | empty                    |

### OSINT / optional

| Key                  | Purpose                                   | Default / Example |
| -------------------- | ----------------------------------------- | ----------------- |
| `SERPAPI_KEY`        | Reserved for web search enrichment        | empty             |
| `VIRUSTOTAL_API_KEY` | Reserved for domain/IP reputation lookups | empty             |
| `ABUSEIPDB_API_KEY`  | Reserved for IP abuse signals             | empty             |

### Frontend / optional

| Key                   | Purpose                                                           | Default / Example       |
| --------------------- | ----------------------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Base API URL for frontend fetches if you wire live requests later | `http://localhost:8000` |

## Run Locally Without Docker

This is the easiest route for a hackathon demo on Windows.

### 1) Create the environment file

```powershell
Copy-Item .env.example .env
```

If you need to edit values, do it in the root `.env` file after copying.

### 2) Install and start PostgreSQL

```powershell
winget install PostgreSQL.PostgreSQL.16
```

After installation, create the database and user objects:

```powershell
psql -U postgres -f scripts/init-postgres.sql
```

### 3) Install and start Redis

Redis is used for Celery and service health checks.

- On Windows, use [Memurai](https://www.memurai.com/) or Redis via WSL.
- Default address: `localhost:6379`

### 4) Install and start Neo4j

```text
Neo4j Desktop -> create local DB -> set password to sentinelai -> start
```

- Bolt URL: `bolt://localhost:7687`
- Browser UI: http://localhost:7474

### 5) Start the backend

```powershell
Set-Location apps/api
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Backend docs and health checks:

- http://localhost:8000/docs
- http://localhost:8000/health

The API auto-creates tables on startup and checks PostgreSQL, Redis, and Neo4j during `/health`.

### 6) Start the optional Celery worker

Use this only if you set `USE_CELERY=true` in `.env`.

```powershell
Set-Location apps/workers
celery -A celery_app worker --loglevel=info
```

If Celery is off, complaint processing still works through FastAPI background tasks.

### 7) Start the frontend

```powershell
Set-Location apps/web
npm install
npm run dev
```

Frontend routes:

- http://localhost:3000/ - landing page
- http://localhost:3000/dashboard - investigator dashboard
- http://localhost:3000/dashboard/complaints - anonymous intake
- http://localhost:3000/investigation - entity search and investigation
- http://localhost:3000/report - printable report

## Optional: Run With Docker

If you want the infrastructure containers pre-wired:

```bash
docker compose up -d
```

This starts PostgreSQL, Redis, and Neo4j. The app services still run from `apps/api` and `apps/web` locally.

## Backend Service Map

| Module                              | What it does                 | How it works                                                                  |
| ----------------------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| `apps/api/main.py`                  | Application entrypoint       | Registers routes, CORS, startup lifecycle, and `/health`                      |
| `apps/api/routes/complaints.py`     | Complaint intake             | Accepts anonymous form/media upload, stores complaint, triggers pipeline      |
| `apps/api/services/pipeline.py`     | Processing pipeline          | Runs classification, OSINT, risk scoring, graph ingestion, and geo update     |
| `apps/ai/classifier.py`             | AI complaint understanding   | Uses rule-based fallback and can call Ollama with JSON-only prompting         |
| `apps/osint/collector.py`           | OSINT enrichment             | Demo heuristics for domains, phones, and UPI IDs                              |
| `apps/ai/risk_engine.py`            | Threat scoring               | Combines AI confidence, complaint count, OSINT flags, and graph factors       |
| `apps/graph/service.py`             | Knowledge graph              | Writes to Neo4j when available, otherwise stores a memory fallback graph      |
| `apps/geo/engine.py`                | Geospatial intelligence      | Returns hotspot and district ranking data for the dashboard                   |
| `apps/ai/agentic.py`                | Investigation report builder | Produces the final report structure, aliases, timeline, evidence, and actions |
| `apps/api/routes/dashboard.py`      | Dashboard API                | Returns summary stats and AI-generated summary blocks                         |
| `apps/api/routes/investigations.py` | Investigation API            | Searches an entity and creates a full investigation report                    |
| `apps/api/routes/graph.py`          | Graph API                    | Returns graph data for entity/complaint exploration                           |
| `apps/api/routes/geo.py`            | Geo API                      | Returns heatmaps, hotspots, and district rankings                             |

## Frontend Service Map

| Page                                         | What the user sees                                                |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `apps/web/app/page.tsx`                      | Product landing page and architecture overview                    |
| `apps/web/app/dashboard/page.tsx`            | SOC-style dashboard with risk metrics, heatmap, and graph preview |
| `apps/web/app/dashboard/complaints/page.tsx` | Anonymous complaint intake form with AI preview                   |
| `apps/web/app/investigation/page.tsx`        | Search UI for UPI, phone, domain, email, and Telegram             |
| `apps/web/app/report/page.tsx`               | Printable investigation report with export button                 |

## Project Layout

```text
ETAI/
├── apps/
│   ├── ai/              # classifier, agentic report logic, risk scoring
│   ├── api/             # FastAPI app, routes, database, pipeline, health checks
│   ├── geo/             # hotspot and district risk logic
│   ├── graph/           # Neo4j client and graph ingestion/query layer
│   ├── osint/           # OSINT enrichment collector
│   ├── reports/         # report generation helpers
│   ├── shared/          # Pydantic schemas and utility helpers
│   ├── web/             # Next.js frontend
│   └── workers/         # Celery app and background workers
├── scripts/             # local setup and PostgreSQL bootstrap scripts
├── docker-compose.yml    # optional local infrastructure
└── README.md             # setup guide and hackathon notes
```

### Frontend sub-tree

```text
apps/web/
├── app/                 # pages and layouts
├── components/          # shared UI shell and dashboard widgets
├── lib/                 # static demo data used by the portal
└── public/              # static assets
```

## Hackathon Notes

- The backend is already structured for a real pipeline, but several enrichment sources are demo-first or optional.
- Neo4j is the main knowledge graph store; if it is offline, the graph service falls back to in-memory storage so the demo still works.
- Ollama and Gemini keys are optional for the current demo, but the classifier is ready for them.
- `NEXT_PUBLIC_API_URL` is included for future live fetch wiring, even though the current frontend is mostly presentational.

## License

MIT
