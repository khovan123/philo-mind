# syntax=docker/dockerfile:1
# ─── PhiloMind API · Production Dockerfile ───────────────────
# Optimized for monorepo — deploys ONLY the backend service.
# Must be built from the monorepo root context:
#   docker build -t philo-mind-api -f services/Dockerfile .
# ──────────────────────────────────────────────────────────────

# ─── Stage 1: Build ───────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root configurations and workspace lockfile
COPY package.json package-lock.json ./
COPY tsconfig.base.json tsconfig.json ./

# Copy packages' package.json files (exclude webapp to prevent installing massive mobile/frontend dependencies)
COPY libs/shared/package.json ./libs/shared/package.json
COPY services/package.json ./services/package.json
COPY webapp/package.json ./webapp/package.json

# Install dependencies only for the backend and shared library workspaces
RUN npm ci --workspace=services --workspace=libs/shared --include-workspace-root --legacy-peer-deps --ignore-scripts

# Copy source files for backend and shared library
COPY libs/shared ./libs/shared
COPY services ./services

# Build the shared library (required by backend)
RUN npm run build --workspace=libs/shared

# Generate Prisma Client with schema path
RUN npm run prisma:generate --workspace=services

# Build the backend service
RUN npm run build --workspace=services

# ─── Stage 2: Runtime ─────────────────────────────────────────
FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app

# Copy package.json, package-lock.json, and minimal workspaces files
COPY package.json package-lock.json ./
COPY libs/shared/package.json ./libs/shared/package.json
COPY services/package.json ./services/package.json
COPY webapp/package.json ./webapp/package.json

# Install ONLY production dependencies for the backend and shared workspaces
RUN npm ci --omit=dev --workspace=services --workspace=libs/shared --include-workspace-root --legacy-peer-deps --ignore-scripts \
    && npm cache clean --force

# Copy compiled files and required assets from builder stage
COPY --from=builder /app/libs/shared/dist ./libs/shared/dist
COPY --from=builder /app/services/dist ./services/dist
COPY --from=builder /app/services/src/prisma ./services/src/prisma

EXPOSE 8080

USER node

CMD ["node", "services/dist/index.js"]
