# Project: PhiloMind Cleanup & Normalization

## Architecture
Monorepo structure:
- `libs/shared` / `packages/shared`: Shared types, DTOs, schema utilities
- `apps/backend` / `services`: Backend API server (Express/NestJS/Node) + Prisma ORM
- `apps/webapp` / `webapp`: React/Redux TypeScript frontend web application

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Exploration & Impact Analysis | Identify all references to AI Chat, Scenarios, Debates across DB, backend, webapp, tests, seeders, docs | none | IN_PROGRESS |
| 2 | M2: Prisma Schema & DB Cleanup | Remove Prisma models, enums, relations, updated migrations/seeders for removed features | M1 | PLANNED |
| 3 | M3: Shared & Backend Cleanup | Clean up shared DTOs/types and backend services, controllers, routes | M2 | PLANNED |
| 4 | M4: Webapp Frontend Cleanup | Clean up webapp screens, components, Redux slices, API hooks, routes | M3 | PLANNED |
| 5 | M5: Seeders & Test Suite Realignment | Update/remove seeders, unit & integration tests, ensure pass | M4 | PLANNED |
| 6 | M6: Documentation & Verification | Update README & API docs, verify `shared:build`, `backend:build`, `tsc --noEmit`, `seed`, `test` | M5 | PLANNED |

## Interface Contracts & Core Modules
1. **Trang chủ học tập**: Streak, points, daily hook, lesson progress, stats.
2. **Khám phá nội dung**: Search & filter topics/lessons/questions; study by chapter & topic.
3. **Học bài nhiều dạng**: Quiz & chapter/skill tree flow (Story Mode).
4. **Quiz & Luyện tập**: Question lists, filters, scoring/timed gameplay, explanations & results.
5. **Mini games**: Concept matching, guess the philosopher, argument sorting.
6. **Bookmark & Thông báo**: Bookmark lessons/topics/stories, notifications, badges & achievements.
7. **Tài khoản & Hồ sơ**: Auth, OTP/forgot password, profile settings, change/delete password, profile & progress.

## Code Layout
- `.agents/`: Agent metadata (plans, progress, handoffs)
- Project root: `package.json`, `PROJECT.md`, documentation
