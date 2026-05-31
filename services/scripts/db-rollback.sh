#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────
# Prisma Migration Rollback Helper
# ─────────────────────────────────────────────────────────
# Usage:
#   ./scripts/db-rollback.sh                  # show status
#   ./scripts/db-rollback.sh <migration_name> # mark as rolled back
#   ./scripts/db-rollback.sh --reset          # reset entire DB (DANGER)
#
# This script provides a safe wrapper around Prisma migrate
# for rollback operations in development and staging.
# ─────────────────────────────────────────────────────────

set -euo pipefail

SCHEMA="src/prisma/schema.prisma"

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
CYAN="\033[0;36m"
NC="\033[0m" # No Color

echo -e "${CYAN}━━━ PhiloMind DB Rollback Helper ━━━${NC}"
echo ""

# Ensure we're in the services directory
if [[ ! -f "$SCHEMA" ]]; then
  if [[ -f "services/$SCHEMA" ]]; then
    cd services
  else
    echo -e "${RED}Error: Cannot find schema.prisma. Run from project root or services/.${NC}"
    exit 1
  fi
fi

# Check DIRECT_DATABASE_URL
if [[ -z "${DIRECT_DATABASE_URL:-}" ]]; then
  echo -e "${RED}Error: DIRECT_DATABASE_URL is not set.${NC}"
  echo "  Set it in your .env or export it."
  exit 1
fi

export DATABASE_URL="$DIRECT_DATABASE_URL"

case "${1:-status}" in
  status)
    echo -e "${GREEN}Migration Status:${NC}"
    npx prisma migrate status --schema="$SCHEMA"
    ;;

  --reset)
    echo -e "${RED}⚠️  WARNING: This will DROP ALL TABLES and re-apply migrations!${NC}"
    echo -e "${YELLOW}Environment: ${DIRECT_DATABASE_URL%%@*}@...${NC}"
    echo ""
    read -rp "Type 'RESET' to confirm: " confirm
    if [[ "$confirm" != "RESET" ]]; then
      echo "Aborted."
      exit 1
    fi
    echo -e "${YELLOW}Resetting database...${NC}"
    npx prisma migrate reset --schema="$SCHEMA" --force
    echo -e "${GREEN}✅ Database reset and migrations re-applied.${NC}"
    ;;

  --resolve)
    if [[ -z "${2:-}" ]]; then
      echo -e "${RED}Usage: $0 --resolve <migration_name>${NC}"
      echo "  Marks a failed migration as resolved (rolled back)."
      echo "  Use 'npx prisma migrate status' to find the migration name."
      exit 1
    fi
    echo -e "${YELLOW}Resolving migration: $2${NC}"
    npx prisma migrate resolve --schema="$SCHEMA" --rolled-back "$2"
    echo -e "${GREEN}✅ Migration '$2' marked as rolled back.${NC}"
    ;;

  --apply)
    if [[ -z "${2:-}" ]]; then
      echo -e "${RED}Usage: $0 --apply <migration_name>${NC}"
      echo "  Marks a migration as applied (without running it)."
      exit 1
    fi
    echo -e "${YELLOW}Marking migration as applied: $2${NC}"
    npx prisma migrate resolve --schema="$SCHEMA" --applied "$2"
    echo -e "${GREEN}✅ Migration '$2' marked as applied.${NC}"
    ;;

  --help|-h)
    echo "Usage: $0 [command] [args]"
    echo ""
    echo "Commands:"
    echo "  status           Show current migration status (default)"
    echo "  --reset          Drop all tables and re-apply (DESTRUCTIVE)"
    echo "  --resolve <name> Mark a failed migration as rolled back"
    echo "  --apply <name>   Mark a migration as applied (without running)"
    echo "  --help           Show this help"
    ;;

  *)
    echo -e "${RED}Unknown command: $1${NC}"
    echo "Run '$0 --help' for usage."
    exit 1
    ;;
esac
