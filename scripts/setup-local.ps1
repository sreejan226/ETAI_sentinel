# SentinelAI — local service setup (no Docker)
# Run from project root: .\scripts\setup-local.ps1

Write-Host "SentinelAI local setup (PostgreSQL + Redis + Neo4j)" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example" -ForegroundColor Green
}

Write-Host "`n1. PostgreSQL" -ForegroundColor Yellow
Write-Host "   Install: winget install PostgreSQL.PostgreSQL.16"
Write-Host "   Then run: psql -U postgres -f scripts/init-postgres.sql"
Write-Host "   Default URL: postgresql+asyncpg://sentinel:sentinel@localhost:5432/sentinelai"

Write-Host "`n2. Redis" -ForegroundColor Yellow
Write-Host "   Install Memurai (Redis for Windows): https://www.memurai.com/"
Write-Host "   Or WSL: sudo apt install redis-server && redis-server"
Write-Host "   Default URL: redis://localhost:6379/0"

Write-Host "`n3. Neo4j" -ForegroundColor Yellow
Write-Host "   Install Neo4j Desktop: https://neo4j.com/download/"
Write-Host "   Create local DB, set password to: sentinelai"
Write-Host "   Bolt URL: bolt://localhost:7687"

Write-Host "`n4. Start app" -ForegroundColor Yellow
Write-Host "   cd apps/api && .\.venv\Scripts\activate && uvicorn main:app --reload"
Write-Host "   cd apps/web && npm run dev"
Write-Host "   Optional worker: cd apps/workers && celery -A celery_app worker -l info"

Write-Host "`n5. Health check: http://localhost:8000/health" -ForegroundColor Green
