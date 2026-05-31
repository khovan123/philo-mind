# Prisma Production Database

PhiloMind uses Prisma Postgres as its only production database path. Do not add
a Neon, Supabase, or alternate database fallback.

## Connection Model

Use two Prisma Postgres connection strings with separate responsibilities:

| Variable              | Host                  | Purpose                                 |
| --------------------- | --------------------- | --------------------------------------- |
| `DATABASE_URL`        | `pooled.db.prisma.io` | API runtime traffic through PgBouncer.  |
| `DIRECT_DATABASE_URL` | `db.prisma.io`        | Migrations, admin tools, and `pg_dump`. |

Both production URLs must use port `5432` and `sslmode=verify-full`. Store them
as deployment secrets. Never commit real credentials or `.env` files.

Prisma Postgres routes the pooled hostname through a tenant-isolated PgBouncer
instance in transaction mode. Session state, temporary tables, and advisory
locks must not be shared across transaction boundaries.

## Fly.io Secrets

Inject the runtime URL into Fly:

```bash
flyctl secrets set \
  DATABASE_URL="postgresql://...@pooled.db.prisma.io:5432/postgres?sslmode=verify-full"
```

Store `DIRECT_DATABASE_URL` as a GitHub environment secret for the
`Database Migrations` workflow. Do not inject the direct URL into the Fly API
runtime.

## Migrations

Use the direct URL for Prisma CLI commands:

```bash
DIRECT_DATABASE_URL="postgresql://...@db.prisma.io:5432/postgres?sslmode=verify-full" \
  npm run db:migrate:deploy --workspace=services

DIRECT_DATABASE_URL="postgresql://...@db.prisma.io:5432/postgres?sslmode=verify-full" \
  npm run db:migrate:status --workspace=services
```

## Health Checks

The Fly health check calls:

```text
GET /health/ready
```

This endpoint executes `SELECT 1` through Prisma and returns HTTP `503` when the
database is unavailable. `GET /health` remains a process liveness endpoint.

## Backup Schedule

Use Prisma Postgres managed snapshots on a Pro or Business plan. Prisma creates
snapshots daily on days with database activity. Verify the latest snapshot in
the Prisma Console Backups tab after deployment and record a restore drill at
least once per release cycle.

For an additional manual export before a high-risk migration, use `pg_dump`
with `DIRECT_DATABASE_URL`. Never run backup tools through the pooled hostname.
