# Fly.io API Deployment

The PhiloMind API is deployed from the monorepo root with the production
`Dockerfile` and `fly.toml`.

## Prerequisites

- Install `flyctl` and log in with `flyctl auth login`.
- Provision a Prisma Postgres database separately.
- Provision Redis separately if hot-endpoint caching is required.

## Runtime Configuration

The image sets non-secret runtime defaults:

| Variable   | Default      | Purpose                         |
| ---------- | ------------ | ------------------------------- |
| `NODE_ENV` | `production` | Enable production runtime mode. |
| `PORT`     | `8080`       | Match Fly internal port.        |

Inject secrets with Fly instead of committing `.env` files:

```bash
flyctl secrets set \
  DATABASE_URL="postgresql://...@pooled.db.prisma.io:5432/postgres?sslmode=verify-full" \
  JWT_SECRET="replace-with-at-least-32-characters"
```

Optional secrets:

```bash
flyctl secrets set \
  REDIS_URL="redis://..." \
  GEMINI_API_KEY="..."
```

## Deploy

Run from the repository root:

```bash
flyctl deploy
```

The Fly health check calls:

```text
GET /health
```

Verify the deployment:

```bash
flyctl status
curl --fail --silent --show-error https://philo-mind-api.fly.dev/health
```

## Database Migrations

Apply migrations before routing production traffic:

```bash
DIRECT_DATABASE_URL="postgresql://...@db.prisma.io:5432/postgres?sslmode=verify-full" \
  npm run db:migrate:deploy --workspace=services
```

The application fails fast on missing or invalid required environment variables.
Redis remains optional and caching fails open when `REDIS_URL` is not configured.

See [Prisma Production Database](prisma-production-database.md) for the pooled
runtime connection, direct admin connection, readiness probe, and backup
requirements.
