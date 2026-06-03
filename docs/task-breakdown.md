# PhiloMind — Task Breakdown (Non-Blocking Parallel Tracks)

> **Cập nhật:** 2026-05-29 | **Tổng tasks:** 111 | **Parallel Tracks:** 10

---

## Nguyên tắc phân chia

1. **Không block lẫn nhau** — Mỗi track có thể chạy độc lập
2. **Atomic tasks** — Mỗi task có deliverable rõ ràng, test được
3. **Track = 1 developer** — Mỗi track giao cho 1 người hoặc 1 agent
4. **Cross-track sync points** — Chỉ sync khi cần integrate

---

## Track Overview

```
Track A: Backend Core         ████████████████████  (T-A01 → T-A22)  22 tasks
Track B: Frontend Shell       ████████████████      (T-B01 → T-B16)  16 tasks
Track C: Shared Types/Seed    ████████████          (T-C01 → T-C12)  12 tasks
Track D: Story Mode Engine    ████████████████      (T-D01 → T-D16)  16 tasks
Track E: AI & Chat System     ██████████            (T-E01 → T-E10)  10 tasks
Track F: Scenario & Debate    ████████████          (T-F01 → T-F08)   8 tasks
Track G: Polish & Gamify      ██████                (T-G01 → T-G06)   6 tasks
Track H: Missing Features     ██████                (T-H01 → T-H05)   5 tasks
Track I: DevOps & Deploy      ██████████            (T-I01 → T-I07)   7 tasks
Track J: Testing              ██████████            (T-J01 → T-J05)   5 tasks
Track K: Admin & Settings     ██████                (T-K01 → T-K04)   4 tasks
```

---

## 🔴 SYNC POINTS (Cross-track dependencies)

| Sync | Produces | Consumed By | Description |
|------|----------|-------------|-------------|
| SP-1 | Track C (T-C01) | Track A, B | Shared types package published |
| SP-2 | Track A (T-A03) | Track B (T-B05) | Auth API ready → Frontend can integrate |
| SP-3 | Track A (T-A06) | Track B (T-B08) | Topic API ready → Explore screen integrates |
| SP-4 | Track A (T-A10) | Track D (T-D05) | Lesson API ready → Story can reference |
| SP-5 | Track C (T-C05) | Track D (T-D01) | Story seed data ready → Story API can test |
| SP-6 | Track A (T-A03) | Track E (T-E01) | Auth middleware → AI endpoints protected |
| SP-7 | Track C (T-C07) | Track F (T-F01) | Scenario seed → Scenario API can test |
| SP-8 | Track I (T-I01) | Track A, E | Docker Compose → All backend devs use same env |
| SP-9 | Track A (all) | Track J (T-J01) | APIs complete → Backend tests can run |
| SP-10 | Track B (T-B16) | Track K (T-K01) | Profile screen → Settings accessible |

---

## Track A: Backend Core (22 tasks)

> **Owner:** Backend Dev | **No deps on other tracks except SP-1**

### A-Foundation (Week 1)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-A01 | Response format util (`sendSuccess`, `sendError`, `sendPaginated`) | 1h | — | 3 response helpers + global error handler |
| T-A02 | Validation middleware (Zod `validate(schema)` for body/params/query) | 2h | — | Generic validate middleware, strips unknowns |
| T-A03 | JWT Auth service (register/login/refresh/logout) | 4h | — | bcrypt 12, JWT 15min/7d, token rotation |
| T-A04 | Auth middleware (authGuard + roleGuard) | 2h | T-A03 | 401/403 responses, `req.user` attachment |
| T-A05 | Auth routes + controller (`/api/v1/auth/*`) | 2h | T-A03, T-A04 | 4 endpoints: register, login, refresh, logout |

**Files:** `services/src/utils/response.ts`, `services/src/middleware/validate.middleware.ts`, `services/src/services/auth.service.ts`, `services/src/middleware/auth.middleware.ts`, `services/src/controllers/auth.controller.ts`, `services/src/routes/auth.routes.ts`

### A-Content APIs (Week 2-3)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-A06 ✅ | Topic CRUD API (list/get/create/update + search/filter) | 3h | T-A04 | Paginated, category/difficulty filter, admin-only create |
| T-A07 ✅ | Lesson CRUD API (list by topic, detail with questions) | 4h | T-A04 | Published-only for users, markdown content |
| T-A08 ✅ | Short Lesson API (list/get/respond/comment) | 4h | T-A04 | Stance response, community stats, unique constraint |
| T-A09 ✅ | User Progress API (upsert/stats/by-topic) | 3h | T-A04 | Auto-complete at 100%, status transitions |
| T-A10 ✅ | Quiz API (attempt/answer/complete/score) | 4h | T-A04 | Score calculation, time tracking |

### A-Advanced APIs (Week 4-5)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-A11 | Reflection CRUD API | 3h | T-A04 | Owner-only edit/delete, topic filter |
| T-A12 | Critical Question API (list/random/admin CRUD) | 2h | T-A04 | Daily random, 3 question types |
| T-A13 | Mindmap Node/Edge API | 4h | T-A04 | Graph data by topic, cascade delete |
| T-A14 | Bookmark toggle API (multi-type) | 2h | T-A04 | 5 target types, toggle behavior |
| T-A15 | Notification CRUD API | 3h | T-A04 | Unread count, mark read, deep-link metadata |

### A-Platform APIs (Week 6)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-A16 | Badge definition + auto-award engine | 5h | T-A09 | 10 badge conditions, triggered on activity |
| T-A17 | Activity logging service + streak tracking | 3h | T-A04 | 8 activity types, daily streak calc |
| T-A18 | Content moderation (report/action/auto-flag) | 3h | T-A04 | User reports, admin actions, word filter |
| T-A19 | Database indexes + query optimization | 2h | T-A06..T-A18 | Missing indexes, eager loading |
| T-A20 | Redis caching for hot endpoints | 2h | T-A19 | Topics, story list, stats (TTL 5min) |
| T-A21 | API response compression (gzip) | 1h | — | Express compression middleware |
| T-A22 | Seed runner script (`npm run seed`) | 2h | T-A06 | Execute all seed files in order |

---

## Track B: Frontend Shell (16 tasks)

> **Owner:** Frontend Dev | **Uses mock data until SP-2/SP-3 sync**

### B-Foundation (Week 1-2)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-B01 | Design tokens + global styles (NativeWind theme) | 3h | — | Colors, typography, spacing from DESIGN.md |
| T-B02 | Common UI components (Button, Card, Input, Badge, Avatar) | 4h | T-B01 | Reusable primitives, dark theme |
| T-B03 | Tab navigation layout (5 tabs + icons + active state) | 2h | T-B01 | Bottom bar, auth guard, tab hiding |
| T-B04 | Login screen UI (email/pass + validation + loading) | 3h | T-B02 | Glassmorphism, keyboard-aware |
| T-B05 | Register screen UI (fullname/email/pass/confirm + strength) | 3h | T-B02 | Password strength indicator |
| T-B06 | Secure token storage (expo-secure-store + web fallback) | 2h | — | set/get/clear tokens |
| T-B07 | RTK Query API layer (baseQuery + reauth + token persistence) | 3h | T-B06 | 401 retry queue, type-safe methods |
| T-B08 | Auth Redux Toolkit slice + Redux Persist (login/register/logout/checkAuth) | 2h | T-B07 | Auto-redirect, error clearing |

### B-Main Screens (Week 3-4)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-B09 | Home screen (daily hook + continue learning + stats) | 5h | T-B02 | Greeting, pull-refresh, animated entry |
| T-B10 | Explore screen (topic grid + search + category filter) | 4h | T-B02 | Debounced search, skeleton loading |
| T-B11 | Full Lesson screen (markdown render + concept highlight) | 5h | T-B02 | Scroll progress, auto-save, bookmark |
| T-B12 | Short Lesson swipe cards (hook→insight→conflict→vote) | 6h | T-B02 | TikTok-style vertical, community stats |
| T-B13 | Quiz gameplay screen (questions + timer + result) | 5h | T-B02 | Color feedback, celebration animation |
| T-B14 | Onboarding flow (welcome + how-it-works + interest picker) | 4h | T-B08 | 3 steps, skip option, first-launch flag |
| T-B15 | Progress components (ProgressRing, ProgressBadge, StatusBadge) | 2h | T-B02 | Animated fill, color transitions |
| T-B16 | Profile screen (stats grid + badge gallery + activity graph) | 5h | T-B02 | GitHub-style heatmap, settings |

---

## Track C: Shared Types & Seed Data (12 tasks)

> **Owner:** Any Dev | **Zero deps, starts immediately**

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-C01 | Shared types: Auth, API response, enums | 2h | — | `RegisterDTO`, `LoginDTO`, `ApiResponse<T>`, `UserRole` |
| T-C02 | Shared types: Topic, Lesson, Quiz | 2h | — | `TopicDTO`, `LessonDTO`, `QuizAttemptDTO` |
| T-C03 | Shared types: Story, Session, Consequence | 2h | — | `StoryScenarioDTO`, `StorySessionDTO`, `AnalysisTabDTO` |
| T-C04 | Shared types: AI Chat, Scenario, Debate | 2h | — | `AiCharacterDTO`, `ScenarioDTO`, `DebateDTO` |
| T-C05 | Seed: 10 Topics + 30 Short Lessons | 3h | — | Vietnamese content, hooks/insights/conflicts |
| T-C06 | Seed: 20 Full Lessons + 40 Quiz Questions | 4h | — | Markdown content, concept highlights |
| T-C07 | Seed: 5 Story Scenarios (7-step complete) | 5h | — | Learn cards, choices, consequences, analysis tabs |
| T-C08 | Seed: 5 AI Characters (prompts + bios) | 3h | — | Socrates, Nietzsche, Kant, Confucius, Marx |
| T-C09 | Seed: 10 Real-life Scenarios (4 perspectives each) | 4h | — | Modern dilemmas, frameworks |
| T-C10 | Seed: 10 Debates + 20 Critical Questions + 10 Badges | 3h | — | Debate topics, question types, badge conditions |
| T-C11 | Seed: 5 MiniGames (matching, guess-who, logic) | 2h | — | JSON config for each game type |
| T-C12 | Seed: TopicPerspective data (5 perspectives × 10 topics) | 2h | — | Tech, ethical, economic, social, philosophical |

---

## Track D: Story Mode Engine (16 tasks)

> **Owner:** Fullstack Dev | **Starts after SP-1. Backend first, then frontend.**

### D-Backend (Week 3-4)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-D01 | Schema migration: StoryLearnCard, AnalysisTab, PhilosophyTag | 2h | — | New models + enum, clean migration |
| T-D02 | Story Scenario API (list with filters + detail with learn cards) | 5h | T-D01, T-A04 | Paginated, include topic/choices/stats |
| T-D03 | Story Session API (start/decide/complete) | 5h | T-D02 | Session management, decision recording |
| T-D04 | Consequence + Analysis API (get by choice, 4 categories) | 4h | T-D01 | Markdown content, concept terms, related figures |
| T-D05 | Community stats aggregation (% per choice, cache) | 2h | T-D03 | TTL 5min cache, handle 0 decisions |

### D-Frontend (Week 5-7)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-D06 | Story list screen (cards + filters + replay indicator) | 4h | T-D02 | Difficulty/topic filter, completion badge |
| T-D07 | Story RTK Query service + Redux slice | 2h | T-D02 | RTK Query integration, Redux slice session state management |
| T-D08 | Step 1: INTRO screen (cinematic + character briefing) | 4h | T-D07 | Dark bg, fade-in, era context |
| T-D09 | Step 2: LEARN screen (swipeable cards + concept chips) | 5h | T-D07 | Horizontal swipe, progress dots, concept highlight |
| T-D10 | Step 3: DILEMMA screen (dramatic presentation) | 3h | T-D07 | Stakes description, atmospheric bg |
| T-D11 | Step 4: CHOOSE screen (choice cards + philosophy tags + reasoning) | 5h | T-D07 | Tag badges, glow selection, min 20 chars |
| T-D12 | Step 5: CONSEQUENCE screen (narrative + 4 analysis tabs) | 6h | T-D07 | Typewriter animation, swipeable tabs, concept modals |
| T-D13 | Step 6: KNOWLEDGE screen (history + community stats + concepts) | 4h | T-D07 | Animated bar chart, replay comparison |
| T-D14 | Step 7: REFLECT screen (journal + completion) | 3h | T-D07 | Guided prompt, confetti animation |
| T-D15 | StepProgress component (shared across all 7 steps) | 2h | T-B02 | Step indicator bar, active/completed states |
| T-D16 | Story flow integration test (end-to-end 7 steps) | 2h | T-D08..T-D14 | Navigate all 7 steps, verify data persistence |

---

## Track E: AI & Chat System (10 tasks)

> **Owner:** Backend+AI Dev | **Independent until SP-6 sync for auth**

### E-Backend (Week 4-5)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-E01 | Gemini API service (generate + stream + rate limit) | 4h | — | 10 req/min/user, 30s timeout, safety filter |
| T-E02 | AI Character CRUD + prompt template system | 4h | T-E01, T-A04 | System prompt builder, admin CRUD |
| T-E03 | AI Chat session + message API | 5h | T-E02 | Start/list/get sessions, send message, 20-msg context |
| T-E04 | SSE streaming endpoint | 4h | T-E03 | `text/event-stream`, chunked, abort handling |

### E-Frontend (Week 6-7)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-E05 | AI Chat RTK Query service + Redux slice | 2h | T-E03 | RTK Query endpoints, Redux slices for session/message UI state |
| T-E06 | Character gallery screen (cards + session list) | 4h | T-E05 | Portrait cards, era-themed borders |
| T-E07 | Chat conversation screen (bubbles + streaming text) | 6h | T-E05 | Left/right bubbles, progressive text, auto-scroll |
| T-E08 | ChatInput component (text + send + suggested prompts) | 2h | T-E07 | First-message suggestions, loading indicator |
| T-E09 | StreamingText component (character-by-character render) | 2h | T-E07 | Cursor animation, completion callback |
| T-E10 | AI Chat integration test (full conversation flow) | 2h | T-E07 | Start session → send 3 messages → verify streaming |

---

## Track F: Scenario & Debate (8 tasks)

> **Owner:** Fullstack Dev | **Independent. Backend needs T-A04 for auth.**

### F-Scenario (Week 5-6)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-F01 | Schema migration: ScenarioPerspective, ScenarioFramework | 2h | — | New models, stance fields |
| T-F02 | Real-life Scenario API (CRUD + perspectives + respond + stats) | 5h | T-F01, T-A04 | 4 perspectives, stance tracking |
| T-F03 | Scenario SITUATION + PERSPECTIVES screens | 5h | T-F02 | Stance selector, swipeable perspective cards |
| T-F04 | Scenario FRAMEWORK + RETHINK screens | 4h | T-F02 | Stepper timeline, before/after comparison |

### F-Debate (Week 7)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-F05 | Debate CRUD + argument + vote + comment API | 5h | T-A04 | FOR/AGAINST/NEUTRAL, unique vote |
| T-F06 | Debate list + detail screens (split FOR/AGAINST view) | 5h | T-F05 | Argument cards, vote animation |
| T-F07 | Debate argue screen (stance + editor + preview) | 4h | T-F05 | Min 50 chars, preview mode |
| T-F08 | Scenario + Debate integration tests | 2h | T-F04, T-F07 | Full flow verification |

---

## Track G: Polish & Gamification (6 tasks)

> **Owner:** Any Dev | **Starts after core tracks complete**

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-G01 | Badge gallery + earn notifications (frontend) | 3h | T-A16, T-B16 | Glow earned, locked grayed, toast notification |
| T-G02 | Notification bell + list screen | 3h | T-A15, T-B16 | Unread count badge, mark-read, deep-link |
| T-G03 | Reflection journal screens (list + new + detail) | 4h | T-A11, T-A12 | Guided by critical questions, markdown editor |
| T-G04 | Mindmap visualization (SVG + zoom + pan) | 8h | T-A13 | Force-directed, color-coded nodes, tap-to-detail |
| T-G05 | Bookmark system (button + list screen) | 3h | T-A14 | Heart animation, grouped by type |
| T-G06 | Performance optimization (caching + lazy load + bundle audit) | 4h | All | Redis, React.memo, Lighthouse > 80 |

---

## Track H: Missing Features (5 tasks) 🆕

> **Owner:** Fullstack Dev | **Multi-perspective + MiniGame modules**

### H-MultiPerspective (Week 5-6)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-H01 | TopicPerspective API (CRUD 5 perspectives per topic) | 3h | T-A04, T-A06 | tech, ethical, economic, social, philosophical views |
| T-H02 | Multi-perspective viewer screen (tabs/swipe per perspective) | 4h | T-H01 | 5-tab perspective viewer, concept highlight, share |

### H-MiniGame (Week 6-7)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-H03 | MiniGame CRUD API (admin create, user play, score tracking) | 4h | T-A04 | 3 game types: matching, guess-who, logic puzzle |
| T-H04 | MiniGame play screen (3 game types + score + animation) | 6h | T-H03 | Matching cards, portrait quiz, argument sorting |
| T-H05 | MiniGame result + leaderboard component | 2h | T-H03 | Score animation, top 10 leaderboard, replay |

---

## Track I: DevOps & Deployment (7 tasks) 🆕

> **Owner:** DevOps / Lead Dev | **T-I01, T-I02 should start Week 1!**

### I-Local Setup (Week 1 — START FIRST)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-I01 | Docker Compose (Postgres 16 + Redis 7 + API dev) | 3h | — | `docker-compose.yml`, volumes, healthcheck |
| T-I02 | Environment config (.env.example + Zod validation) | 2h | — | All env vars documented, fail-fast on missing |

### I-CI/CD (Week 7)

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-I03 | Database migration CI (Prisma migrate + seed in pipeline) | 2h | T-A22 | Auto-migrate on deploy, rollback script |
| T-I04 | GitHub Actions CI (lint + typecheck + test on PR) | 3h | — | Branch protection, PR status checks |
| T-I05 | EAS Build config (iOS + Android preview + production) | 3h | — | `eas.json`, signing, OTA updates |
| T-I06 | API deployment (Dockerfile + Railway/Render/Fly.io) | 3h | T-I01 | Multi-stage build, health endpoint, env injection |
| T-I07 | Production database (Neon/Supabase Postgres + connection pool) | 2h | — | SSL, pgbouncer, backup schedule |

---

## Track J: Testing (5 tasks) 🆕

> **Owner:** Any Dev | **Starts Week 6 after core APIs stable**

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-J01 | Backend unit tests: Auth service (register/login/refresh/revoke) | 3h | T-A05 | Jest + mocked Prisma, 15+ test cases |
| T-J02 | Backend unit tests: Story + Quiz services (session, score) | 3h | T-D03, T-A10 | Session lifecycle, score calculation edge cases |
| T-J03 | API integration tests (Supertest: auth + CRUD + errors) | 4h | T-A05 | In-memory DB, 30+ endpoint tests |
| T-J04 | Frontend component tests (RTL: Card, Quiz, Chat components) | 4h | T-B02 | Render, interaction, snapshot tests |
| T-J05 | E2E smoke test (Maestro: login → home → story → complete) | 4h | T-D16 | Critical path automation, CI integration |

---

## Track K: Admin & Settings (4 tasks) 🆕

> **Owner:** Frontend Dev | **After profile screen (T-B16) done**

| ID | Task | Est | Deps | AC Summary |
|----|------|-----|------|------------|
| T-K01 | Settings screen (profile edit, password change, notification prefs) | 4h | T-B16, T-A05 | Form validation, avatar upload, password rules |
| T-K02 | Forgot/Reset password API + screen (email OTP flow) | 3h | T-A03 | Send OTP → verify → new password, rate limit |
| T-K03 | Terms of Service + Privacy Policy screens (markdown render) | 1h | T-B02 | Static content, required for App Store |
| T-K04 | Delete account API + confirmation flow | 2h | T-A04 | Soft delete, 30-day grace, confirmation modal |

---

## Execution Timeline (Parallel — 8 weeks)

```
Week 1   Track I: ████ T-I01,I02     Track A: ████ T-A01..A05    Track B: ████ T-B01..B08    Track C: ████ T-C01..C04
Week 2   Track A: ████ T-A06..A10    Track B: ████ T-B09..B12    Track C: ████ T-C05..C07
Week 3   Track A: ████ T-A11..A15    Track D: ████ T-D01..D05    Track C: ████ T-C08..C12
Week 4   Track A: ████ T-A16..A18    Track D: ████ T-D06..D10    Track E: ████ T-E01..E04
Week 5   Track A: ████ T-A19..A22    Track D: ████ T-D11..D16    Track F: ████ T-F01..F04     Track H: ████ T-H01..H02
Week 6   Track G: ████ T-G01..G03    Track E: ████ T-E05..E10    Track F: ████ T-F05..F08     Track H: ████ T-H03..H05    Track J: ████ T-J01..J02
Week 7   Track G: ████ T-G04..G06    Track B: ████ T-B13..B16    Track J: ████ T-J03..J05     Track K: ████ T-K01..K04    Track I: ████ T-I03..I04
Week 8   Track I: ████ T-I05..I07    Final integration testing + bug fixes + store submission prep
```

**Total parallel time: ~8 weeks** (vs 18+ weeks sequential)

---

## Task Status Template

```yaml
# Copy per task
task_id: T-X00
status: NOT_STARTED  # NOT_STARTED | IN_PROGRESS | REVIEW | DONE | BLOCKED
assignee: ""
started_at: null
completed_at: null
blocked_by: null
pr_url: null
notes: ""
```

---

## Quick Reference: Task Counts

| Track | Backend | Frontend | Shared | DevOps | Total |
|-------|---------|----------|--------|--------|-------|
| A: Backend Core | 22 | 0 | 0 | 0 | 22 |
| B: Frontend Shell | 0 | 16 | 0 | 0 | 16 |
| C: Shared/Seed | 0 | 0 | 12 | 0 | 12 |
| D: Story Mode | 5 | 11 | 0 | 0 | 16 |
| E: AI & Chat | 4 | 6 | 0 | 0 | 10 |
| F: Scenario/Debate | 3 | 5 | 0 | 0 | 8 |
| G: Polish | 1 | 5 | 0 | 0 | 6 |
| H: Missing Features | 2 | 3 | 0 | 0 | 5 |
| I: DevOps & Deploy | 0 | 0 | 0 | 7 | 7 |
| J: Testing | 3 | 2 | 0 | 0 | 5 |
| K: Admin & Settings | 1 | 3 | 0 | 0 | 4 |
| **Total** | **41** | **51** | **12** | **7** | **111** |

---

## Production Checklist

- [ ] All 111 tasks DONE
- [ ] CI pipeline green (T-I04)
- [ ] 90%+ backend test coverage (T-J01..J03)
- [ ] E2E smoke test passing (T-J05)
- [ ] API deployed + healthy (T-I06)
- [ ] Production DB provisioned (T-I07)
- [ ] EAS build signed (T-I05)
- [ ] ToS + Privacy Policy live (T-K03)
- [ ] 10 topics + seed content loaded (T-C05..C12)
- [ ] App Store submission (screenshots, description, review)
