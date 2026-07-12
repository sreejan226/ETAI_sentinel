-- Run once against your local PostgreSQL (psql -U postgres -f scripts/init-postgres.sql)
CREATE USER sentinel WITH PASSWORD 'sentinel';
CREATE DATABASE sentinelai OWNER sentinel;
GRANT ALL PRIVILEGES ON DATABASE sentinelai TO sentinel;
