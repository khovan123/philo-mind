# PhiloMind - Project Context

> **Cap nhat lan cuoi:** 2026-06-01  
> **Muc dich:** Cung cap context hien tai cho developer/agent, gom product scope, repo structure, source-of-truth docs va full plan trace tu task plan sang GitHub issues/local docs.

---

## 1. Tong Quan Du An

**PhiloMind** la ung dung mobile giao duc triet hoc va tu duy phan bien cho nguoi tre Viet Nam. San pham dung interactive storytelling, AI character chat va scenario-based learning de bien cac khai niem triet hoc thanh flow hoc tap co tuong tac.

### Tai Lieu Tham Chieu

| Tai lieu | Duong dan | Noi dung |
| --- | --- | --- |
| Idea goc | `docs/idea.md` | 11 modules, personas, feature specs |
| Product Brief | `design-artifacts/A-Product-Brief/product-brief.md` | Vision, metrics, scope, risks |
| UX Scenarios | `design-artifacts/C-UX-Scenarios/` | Story Mode va Real-life Scenario flows |
| Architecture | `docs/architecture.md` | System architecture, API design, data flow |
| Canonical task plan | `docs/task-breakdown.md` | 111 tasks theo 11 tracks |
| Sprint status | `docs/sprint-status.md` va `issues/sprint-status.md` | Snapshot tu GitHub issues |
| Feature output contracts | `docs/feature-output-contracts.md` | Bang dau ra tinh nang cho 111 issues |
| Implementation readiness | `docs/implementation-readiness-check.md` | Plan-to-issue mapping, gaps, risks |
| Local issue logs | `issues/by-github-id/` | 111 issue logs theo GitHub issue id |
| Dev stories | `stories/` | 77 story files, hien dang cover open/remaining execution stories |
| DB Schema | `services/src/prisma/schema.prisma` | Prisma schema cho PostgreSQL |

---

## 2. Source Of Truth Va Plan Trace

### Source Hierarchy

1. **GitHub issues** la source of truth cho progress implementation.
2. `docs/task-breakdown.md` la source of truth cho plan scope, dependencies va acceptance summary.
3. `docs/sprint-status.md` va `issues/sprint-status.md` la snapshot local cua GitHub issue state.
4. `docs/feature-output-contracts.md` va body tung GitHub issue la source of truth cho dau ra tinh nang cu the.
5. `issues/by-github-id/` la local audit trail cho 111 issues.
6. `stories/` la developer execution story set, hien co 77 file, khong phai full 111-task trace.

### Trace Coverage Snapshot

| Metric | Gia tri |
| --- | ---: |
| Planned tasks trong `docs/task-breakdown.md` | 111 |
| GitHub issues mapped voi planned tasks | 111 |
| Missing GitHub issues | 0 |
| Extra task issues ngoai plan | 0 |
| Local issue logs trong `issues/by-github-id/` | 111 |
| GitHub issues missing `Status Log` | 0 |
| GitHub issues missing `Feature Output Contract` | 0 |
| Dev story files trong `stories/` | 77 |
| Done / closed | 49 |
| Open / remaining | 62 |
| Completion | 44% |

### Full Plan Trace By Track

| Track | Scope | Task IDs | GitHub Issues | Total | Done | Open | Local Trace |
| --- | --- | --- | --- | ---: | ---: | ---: | --- |
| A | Backend Core | `T-A01`-`T-A22` | #17-#38 | 22 | 15 | 7 | `issues/by-github-id/#017...#038`, `stories/1-*` for open backend stories |
| B | Frontend Shell | `T-B01`-`T-B16` | #39-#54 | 16 | 7 | 9 | `issues/by-github-id/#039...#054`, `stories/2-*` for open frontend stories |
| C | Shared Types & Seed | `T-C01`-`T-C12` | #55-#66 | 12 | 4 | 8 | `issues/by-github-id/#055...#066`, `stories/3-*` for open seed/type stories |
| D | Story Mode Engine | `T-D01`-`T-D16` | #67-#82 | 16 | 5 | 11 | `issues/by-github-id/#067...#082`, `stories/4-*` for open story-mode stories |
| E | AI & Chat System | `T-E01`-`T-E10` | #83-#92 | 10 | 0 | 10 | `issues/by-github-id/#083...#092`, `stories/5-*` |
| F | Scenario & Debate | `T-F01`-`T-F08` | #93-#100 | 8 | 0 | 8 | `issues/by-github-id/#093...#100`, `stories/6-*` |
| G | Polish & Gamification | `T-G01`-`T-G06` | #101-#106 | 6 | 3 | 3 | `issues/by-github-id/#101...#106`, `stories/7-*` |
| H | Missing Features | `T-H01`-`T-H05` | #107-#111 | 5 | 5 | 0 | `issues/by-github-id/#107...#111`, `stories/8-*` |
| I | DevOps & Deploy | `T-I01`-`T-I07` | #112-#118 | 7 | 7 | 0 | `issues/by-github-id/#112...#118` |
| J | Testing | `T-J01`-`T-J05` | #119-#123 | 5 | 0 | 5 | `issues/by-github-id/#119...#123`, `stories/10-*` |
| K | Admin & Settings | `T-K01`-`T-K04` | #124-#127 | 4 | 3 | 1 | `issues/by-github-id/#124...#127`, `stories/11-*` |

### Trace Rules For New Work

- Moi PR phai link GitHub issue va task ID, vi du `#22` va `T-A06`.
- Neu behavior thuc te khac `Feature Output Contract`, cap nhat GitHub issue va local docs trong cung PR.
- Khi issue done, cap nhat issue state tren GitHub truoc, sau do sync lai `docs/sprint-status.md`/`issues/sprint-status.md`.
- Neu them task moi, cap nhat dong bo: `docs/task-breakdown.md`, GitHub issue, `issues/by-github-id/`, `docs/feature-output-contracts.md`, va story file neu can dev execution story.

---

## 3. Monorepo Structure Hien Tai

```text
philo-mind/
├── services/                         # Backend Express 5 + Prisma 7
│   ├── src/
│   │   ├── __tests__/                # Auth, story, consequence, cache, reset-password tests
│   │   ├── config/                   # env + prisma config
│   │   ├── controllers/              # auth, story, topic, reflection, bookmark, notification, etc.
│   │   ├── middleware/               # auth, cache, error, rateLimit, validate
│   │   ├── prisma/schema.prisma      # PostgreSQL domain schema
│   │   ├── routes/                   # api, auth, story, health, reflection, notification, etc.
│   │   ├── services/                 # business services
│   │   ├── utils/                    # response/cache/password/token helpers
│   │   └── index.ts                  # Express app entry
│   └── package.json
│
├── webapp/                           # Expo 56 + React Native
│   ├── src/
│   │   ├── app/                      # Expo Router routes
│   │   │   ├── (auth)/               # register, forgot/reset password, OTP flow
│   │   │   ├── (lesson)/             # lesson/trial screens
│   │   │   ├── (tabs)/               # home, learn, explore, debate, profile
│   │   │   ├── delete-account.tsx
│   │   │   ├── onboarding.tsx
│   │   │   └── settings.tsx
│   │   ├── components/               # app header, tabs, themed primitives
│   │   ├── components/progress/      # ProgressRing, ProgressBadge, StatusBadge
│   │   ├── components/ui/            # Button, Card, Input, Badge, Avatar, TabIcon
│   │   ├── constants/                # theme
│   │   ├── hooks/                    # theme/color scheme hooks
│   │   ├── lib/                      # onboarding-state, utils
│   │   ├── screen/auth/              # RegisterScreen
│   │   └── services/                 # api + auth service
│   └── package.json
│
├── libs/shared/                      # @philo-mind/shared
│   └── src/
│       ├── types/                    # auth, interactive, learning, story
│       └── index.ts
│
├── docs/                             # tracked project docs
├── issues/                           # tracked GitHub issue docs and status
├── stories/                          # tracked BMAD dev stories for current execution set
├── design-artifacts/                 # product/UX/design workflow outputs
├── _bmad/                            # BMAD workflow config
├── _bmad-output/                     # local ignored BMAD output cache
└── package.json                      # root workspace config
```

---

## 4. Tech Stack

### Backend

| Component | Technology | Notes |
| --- | --- | --- |
| Runtime | Node.js 22+ | LTS target |
| Framework | Express 5 | REST API |
| ORM | Prisma 7 | PostgreSQL schema + migrations |
| Database | PostgreSQL 16+ | Primary datastore |
| Cache | Redis | Hot endpoints and stats cache where implemented |
| Language | TypeScript 5.x | Strict workspace |
| Auth | JWT | Access + refresh token flow |
| AI | Google Gemini API | Character chat and analysis scope |

### Frontend

| Component | Technology | Notes |
| --- | --- | --- |
| Framework | Expo 56 | Mobile app |
| UI | React Native 0.85 | New Architecture target |
| Routing | Expo Router 5.x | File-based routes |
| Styling | NativeWind 5 | Tailwind-style RN styling |
| Animation | Reanimated 4 | Micro-interactions |
| State | Zustand | Feature stores |
| HTTP | Axios | API client + interceptors |

### Shared

| Component | Technology | Notes |
| --- | --- | --- |
| Package | `@philo-mind/shared` | Workspace linked shared contracts |
| Contents | DTOs, enums, API response types | Shared between backend/frontend |

---

## 5. Product Domains

| Domain | Purpose | Representative Tasks |
| --- | --- | --- |
| Auth & Account | Register, login, refresh/logout, reset password, delete account | `T-A03`-`T-A05`, `T-B04`-`T-B08`, `T-K02`, `T-K04` |
| Learning Content | Topics, lessons, short lessons, quiz, progress | `T-A06`-`T-A10`, `T-B09`-`T-B13`, `T-C05`-`T-C06` |
| Story Mode | 7-step interactive philosophy scenario flow | `T-D01`-`T-D16`, `T-C07` |
| AI Chat | Philosopher characters, chat session, SSE streaming | `T-E01`-`T-E10`, `T-C08` |
| Scenario & Debate | Real-life dilemmas, perspectives, debate arguments | `T-F01`-`T-F08`, `T-C09`-`T-C10` |
| Reflection & Gamification | Journal, badges, notifications, bookmarks, mindmap | `T-A11`-`T-A18`, `T-G01`-`T-G06` |
| DevOps & Testing | Docker, env, CI, deploy, EAS, automated tests | `T-I01`-`T-I07`, `T-J01`-`T-J05` |
| Settings & Legal | Profile settings, legal screens, privacy/account controls | `T-K01`-`T-K04` |

---

## 6. Database Schema Overview

Schema duoc dat tai `services/src/prisma/schema.prisma`. Core domain gom auth/profile, learning content, story mode, AI chat, scenarios, debate, progress, reflection, bookmarks, notifications, moderation va gamification.

### Key Models / Areas

- User, profile, auth/session/token data
- Topic, Lesson, ShortLesson, Quiz, UserProgress
- StoryScenario, StorySession, StoryChoice, StoryConsequence, StoryLearnCard, AnalysisTab, PhilosophyTag
- AICharacter, AIChatSession, AIChatMessage
- RealLifeScenario, ScenarioPerspective, ScenarioFramework
- Debate, argument, vote, comment
- Reflection, CriticalQuestion, Mindmap nodes/edges
- Badge, ActivityLog, Notification, Bookmark, ModerationReport

### Key Enums

- `UserRole`: USER, ADMIN, MODERATOR
- `Difficulty`: EASY, MEDIUM, HARD
- `StorySessionStatus`: IN_PROGRESS, COMPLETED, ABANDONED
- `DebateStatus`: OPEN, CLOSED, ARCHIVED
- `ContentStatus`: DRAFT, PUBLISHED, ARCHIVED
- `QuestionType`: OPEN_TEXT, SINGLE_CHOICE, MULTIPLE_CHOICE, MORAL_DILEMMA, LOGIC

---

## 7. Trang Thai Hien Tai Theo Plan

### Done / Closed Highlights

- Backend foundation: response helpers, validation, JWT auth service, auth middleware, auth routes.
- Several backend advanced APIs: reflection, critical question, mindmap, bookmark, notification, indexes, Redis cache, compression, seed runner.
- Frontend foundation: design tokens, common UI components, tab layout, register screen, onboarding, progress components.
- Story backend foundation: story schema, story scenario/session/consequence APIs, story list screen.
- DevOps/deploy track complete by issue state.
- Admin/settings mostly complete except legal screens.

### Remaining Focus

1. `T-A06` Topic CRUD API is the next recommended work in `docs/sprint-status.md`.
2. Backend content APIs remain open: topics, lessons, short lessons, progress, quiz, badge/activity/moderation.
3. Frontend auth/client/main learning screens remain open.
4. AI chat, scenario/debate, polish/gamification, missing-feature and testing tracks are still open.
5. Track J testing has 0 closed issues, so implementation confidence still depends on adding automated tests.

---

## 8. Quy Uoc Phat Trien

### Coding Conventions

- Backend: Controller -> Service -> Repository/helper pattern when domain complexity requires it.
- Frontend: route-driven screens with reusable `components/ui`, feature services and Zustand stores.
- Naming: camelCase cho variables/functions, PascalCase cho types/components.
- API: RESTful, `/api/v1` prefix, response shape `{ success, data, meta? }` or `{ success: false, error }`.
- Errors: validation/auth/not-found/conflict errors must be explicit and testable.

### Git / Issue Workflow

- `main` is the current shared branch.
- Work should be done on feature branches and linked to GitHub issue IDs.
- PR description must include task ID, issue link, verification commands and evidence.
- Do not commit local secrets, real `.env` files or ignored `_bmad-output/` cache.

### Documentation Workflow

- Product/plan changes update `docs/task-breakdown.md` first.
- Status changes update GitHub issue state first, then local sprint status docs.
- Requirement/output changes update both GitHub issue body and `docs/feature-output-contracts.md`.
- New dev execution scope should add or update `stories/` when a developer story is needed.

---

## 9. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/philomind

# Auth
JWT_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AI
GEMINI_API_KEY=<key>

# App
PORT=3000
NODE_ENV=development
```

---

## 10. Known Documentation Gaps

- `_bmad-output/planning-artifacts` is ignored local cache and does not contain formal BMAD PRD/Architecture/Epics/UX artifacts. Use tracked docs as source of truth unless those artifacts are regenerated and committed elsewhere.
- `stories/` has 77 files for current execution stories, while the full plan has 111 tasks. Full trace is `docs/task-breakdown.md` -> GitHub issues -> `issues/by-github-id/`.
- GitHub open/closed state does not represent in-progress/review/blocked unless labels or project fields are maintained.
