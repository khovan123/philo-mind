-- ─── PhiloMind · Postgres Init Script ───────────────────────
-- Runs once on first `docker compose up` (empty volume only)
-- ──────────────────────────────────────────────────────────────

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Optional: create a read-only role for analytics/BI
-- CREATE ROLE readonly LOGIN PASSWORD 'readonly_pass';
-- GRANT CONNECT ON DATABASE philo_mind TO readonly;
-- GRANT USAGE ON SCHEMA public TO readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly;

\echo '✅ PhiloMind database initialized'
