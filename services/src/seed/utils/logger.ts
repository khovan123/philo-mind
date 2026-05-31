/**
 * Seed Logger Utility
 * Consistent logging for seed operations
 *
 * Note: eslint-disable for console — seed scripts need stdout logging
 */

/* eslint-disable no-console */

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
} as const;

export function seedLog(entity: string, count: number): void {
  console.log(
    `  ${COLORS.green}✔${COLORS.reset} ${entity}: ${COLORS.cyan}${count}${COLORS.reset} records seeded`,
  );
}

export function seedSkip(entity: string, reason: string): void {
  console.log(
    `  ${COLORS.yellow}⊘${COLORS.reset} ${entity}: ${COLORS.dim}${reason}${COLORS.reset}`,
  );
}

export function seedError(entity: string, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  console.error(
    `  ${COLORS.red}✗${COLORS.reset} ${entity}: ${COLORS.red}${message}${COLORS.reset}`,
  );
}

export function seedHeader(phase: string): void {
  console.log(`\n${COLORS.cyan}━━━ ${phase} ━━━${COLORS.reset}`);
}
