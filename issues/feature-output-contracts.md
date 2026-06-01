# Feature Output Contracts

> Last updated: 2026-05-31
> Source: GitHub issues in `khovan123/philo-mind`

## Summary

- Total issues with feature output contract: 111
- Open: 73
- Closed: 38
- Purpose: make every issue state the concrete feature output, not only code process, lint, or design-pattern steps.

## How To Use

- Developers implement against the `Feature Output Contract` section in the GitHub issue first.
- PRs must include evidence for the contract: screenshot, API sample, test output, seed log, or deploy/CI log.
- If behavior changes, update both the GitHub issue and local docs in the same PR.

## Issue Index

| GitHub | Task    | Track                 | State  | Type      | Feature                                                             |
| ------ | ------- | --------------------- | ------ | --------- | ------------------------------------------------------------------- |
| #17    | `T-A01` | Backend Core          | closed | backend   | Response format util (sendSuccess, sendError, sendPaginated)        |
| #18    | `T-A02` | Backend Core          | closed | backend   | Validation middleware (Zod validate for body/params/query)          |
| #19    | `T-A03` | Backend Core          | closed | backend   | JWT Auth service (register/login/refresh/logout)                    |
| #20    | `T-A04` | Backend Core          | closed | backend   | Auth middleware (authGuard + roleGuard)                             |
| #21    | `T-A05` | Backend Core          | closed | backend   | Auth routes + controller (/api/v1/auth/\*)                          |
| #22    | `T-A06` | Backend Core          | open   | backend   | Topic CRUD API (list/get/create/update + search/filter)             |
| #23    | `T-A07` | Backend Core          | open   | backend   | Lesson CRUD API (list by topic, detail with questions)              |
| #24    | `T-A08` | Backend Core          | open   | backend   | Short Lesson API (list/get/respond/comment)                         |
| #25    | `T-A09` | Backend Core          | open   | backend   | User Progress API (upsert/stats/by-topic)                           |
| #26    | `T-A10` | Backend Core          | open   | backend   | Quiz API (attempt/answer/complete/score)                            |
| #27    | `T-A11` | Backend Core          | closed | backend   | Reflection CRUD API                                                 |
| #28    | `T-A12` | Backend Core          | closed | backend   | Critical Question API (list/random/admin CRUD)                      |
| #29    | `T-A13` | Backend Core          | closed | backend   | Mindmap Node/Edge API                                               |
| #30    | `T-A14` | Backend Core          | closed | backend   | Bookmark toggle API (multi-type)                                    |
| #31    | `T-A15` | Backend Core          | closed | backend   | Notification CRUD API                                               |
| #32    | `T-A16` | Backend Core          | open   | backend   | Badge definition + auto-award engine                                |
| #33    | `T-A17` | Backend Core          | open   | backend   | Activity logging service + streak tracking                          |
| #34    | `T-A18` | Backend Core          | open   | backend   | Content moderation (report/action/auto-flag)                        |
| #35    | `T-A19` | Backend Core          | closed | backend   | Database indexes + query optimization                               |
| #36    | `T-A20` | Backend Core          | closed | backend   | Redis caching for hot endpoints                                     |
| #37    | `T-A21` | Backend Core          | closed | backend   | API response compression (gzip)                                     |
| #38    | `T-A22` | Backend Core          | closed | backend   | Seed runner script (npm run seed)                                   |
| #39    | `T-B01` | Frontend Shell        | closed | frontend  | Design tokens + global styles (NativeWind theme)                    |
| #40    | `T-B02` | Frontend Shell        | closed | frontend  | Common UI components (Button, Card, Input, Badge, Avatar)           |
| #41    | `T-B03` | Frontend Shell        | closed | frontend  | Tab navigation layout (5 tabs + icons + active state)               |
| #42    | `T-B04` | Frontend Shell        | open   | frontend  | Login screen UI (email/pass + validation + loading)                 |
| #43    | `T-B05` | Frontend Shell        | closed | frontend  | Register screen UI (fullname/email/pass/confirm + strength)         |
| #44    | `T-B06` | Frontend Shell        | open   | frontend  | Secure token storage (expo-secure-store + web fallback)             |
| #45    | `T-B07` | Frontend Shell        | open   | frontend  | API client (Axios instance + interceptors + auto-refresh)           |
| #46    | `T-B08` | Frontend Shell        | open   | frontend  | Auth Zustand store (login/register/logout/checkAuth)                |
| #47    | `T-B09` | Frontend Shell        | open   | frontend  | Home screen (daily hook + continue learning + stats)                |
| #48    | `T-B10` | Frontend Shell        | open   | frontend  | Explore screen (topic grid + search + category filter)              |
| #49    | `T-B11` | Frontend Shell        | open   | frontend  | Full Lesson screen (markdown render + concept highlight)            |
| #50    | `T-B12` | Frontend Shell        | open   | frontend  | Short Lesson swipe cards (hook-insight-conflict-vote)               |
| #51    | `T-B13` | Frontend Shell        | open   | frontend  | Quiz gameplay screen (questions + timer + result)                   |
| #52    | `T-B14` | Frontend Shell        | closed | frontend  | Onboarding flow (welcome + how-it-works + interest picker)          |
| #53    | `T-B15` | Frontend Shell        | closed | frontend  | Progress components (ProgressRing, ProgressBadge, StatusBadge)      |
| #54    | `T-B16` | Frontend Shell        | open   | frontend  | Profile screen (stats grid + badge gallery + activity graph)        |
| #55    | `T-C01` | Shared Types & Seed   | closed | seed-data | Shared types: Auth, API response, enums                             |
| #56    | `T-C02` | Shared Types & Seed   | closed | seed-data | Shared types: Topic, Lesson, Quiz                                   |
| #57    | `T-C03` | Shared Types & Seed   | closed | seed-data | Shared types: Story, Session, Consequence                           |
| #58    | `T-C04` | Shared Types & Seed   | open   | seed-data | Shared types: AI Chat, Scenario, Debate                             |
| #59    | `T-C05` | Shared Types & Seed   | open   | seed-data | Seed: 10 Topics + 30 Short Lessons                                  |
| #60    | `T-C06` | Shared Types & Seed   | open   | seed-data | Seed: 20 Full Lessons + 40 Quiz Questions                           |
| #61    | `T-C07` | Shared Types & Seed   | open   | seed-data | Seed: 5 Story Scenarios (7-step complete)                           |
| #62    | `T-C08` | Shared Types & Seed   | open   | seed-data | Seed: 5 AI Characters (prompts + bios)                              |
| #63    | `T-C09` | Shared Types & Seed   | open   | seed-data | Seed: 10 Real-life Scenarios (4 perspectives each)                  |
| #64    | `T-C10` | Shared Types & Seed   | open   | seed-data | Seed: 10 Debates + 20 Critical Questions + 10 Badges                |
| #65    | `T-C11` | Shared Types & Seed   | open   | seed-data | Seed: 5 MiniGames (matching, guess-who, logic)                      |
| #66    | `T-C12` | Shared Types & Seed   | open   | seed-data | Seed: TopicPerspective data (5 perspectives x 10 topics)            |
| #67    | `T-D01` | Story Mode Engine     | closed | fullstack | Schema migration: StoryLearnCard, AnalysisTab, PhilosophyTag        |
| #68    | `T-D02` | Story Mode Engine     | closed | backend   | Story Scenario API (list with filters + detail with learn cards)    |
| #69    | `T-D03` | Story Mode Engine     | closed | backend   | Story Session API (start/decide/complete)                           |
| #70    | `T-D04` | Story Mode Engine     | closed | backend   | Consequence + Analysis API (get by choice, 4 categories)            |
| #71    | `T-D05` | Story Mode Engine     | open   | backend   | Community stats aggregation (% per choice, cache)                   |
| #72    | `T-D06` | Story Mode Engine     | closed | frontend  | Story list screen (cards + filters + replay indicator)              |
| #73    | `T-D07` | Story Mode Engine     | open   | frontend  | Story service + Zustand store                                       |
| #74    | `T-D08` | Story Mode Engine     | open   | frontend  | Step 1: INTRO screen (cinematic + character briefing)               |
| #75    | `T-D09` | Story Mode Engine     | open   | frontend  | Step 2: LEARN screen (swipeable cards + concept chips)              |
| #76    | `T-D10` | Story Mode Engine     | open   | frontend  | Step 3: DILEMMA screen (dramatic presentation)                      |
| #77    | `T-D11` | Story Mode Engine     | open   | frontend  | Step 4: CHOOSE screen (choice cards + philosophy tags + reasoning)  |
| #78    | `T-D12` | Story Mode Engine     | open   | frontend  | Step 5: CONSEQUENCE screen (narrative + 4 analysis tabs)            |
| #79    | `T-D13` | Story Mode Engine     | open   | frontend  | Step 6: KNOWLEDGE screen (history + community stats + concepts)     |
| #80    | `T-D14` | Story Mode Engine     | open   | frontend  | Step 7: REFLECT screen (journal + completion)                       |
| #81    | `T-D15` | Story Mode Engine     | open   | frontend  | StepProgress component (shared across all 7 steps)                  |
| #82    | `T-D16` | Story Mode Engine     | open   | testing   | Story flow integration test (end-to-end 7 steps)                    |
| #83    | `T-E01` | AI & Chat System      | open   | backend   | Gemini API service (generate + stream + rate limit)                 |
| #84    | `T-E02` | AI & Chat System      | open   | backend   | AI Character CRUD + prompt template system                          |
| #85    | `T-E03` | AI & Chat System      | open   | backend   | AI Chat session + message API                                       |
| #86    | `T-E04` | AI & Chat System      | open   | backend   | SSE streaming endpoint                                              |
| #87    | `T-E05` | AI & Chat System      | open   | frontend  | AI Chat service + Zustand store                                     |
| #88    | `T-E06` | AI & Chat System      | open   | frontend  | Character gallery screen (cards + session list)                     |
| #89    | `T-E07` | AI & Chat System      | open   | frontend  | Chat conversation screen (bubbles + streaming text)                 |
| #90    | `T-E08` | AI & Chat System      | open   | frontend  | ChatInput component (text + send + suggested prompts)               |
| #91    | `T-E09` | AI & Chat System      | open   | frontend  | StreamingText component (character-by-character render)             |
| #92    | `T-E10` | AI & Chat System      | open   | testing   | AI Chat integration test (full conversation flow)                   |
| #93    | `T-F01` | Scenario & Debate     | open   | fullstack | Schema migration: ScenarioPerspective, ScenarioFramework            |
| #94    | `T-F02` | Scenario & Debate     | open   | backend   | Real-life Scenario API (CRUD + perspectives + respond + stats)      |
| #95    | `T-F03` | Scenario & Debate     | open   | frontend  | Scenario SITUATION + PERSPECTIVES screens                           |
| #96    | `T-F04` | Scenario & Debate     | open   | frontend  | Scenario FRAMEWORK + RETHINK screens                                |
| #97    | `T-F05` | Scenario & Debate     | open   | backend   | Debate CRUD + argument + vote + comment API                         |
| #98    | `T-F06` | Scenario & Debate     | open   | frontend  | Debate list + detail screens (split FOR/AGAINST view)               |
| #99    | `T-F07` | Scenario & Debate     | open   | frontend  | Debate argue screen (stance + editor + preview)                     |
| #100   | `T-F08` | Scenario & Debate     | open   | testing   | Scenario + Debate integration tests                                 |
| #101   | `T-G01` | Polish & Gamification | open   | frontend  | Badge gallery + earn notifications (frontend)                       |
| #102   | `T-G02` | Polish & Gamification | open   | frontend  | Notification bell + list screen                                     |
| #103   | `T-G03` | Polish & Gamification | open   | frontend  | Reflection journal screens (list + new + detail)                    |
| #104   | `T-G04` | Polish & Gamification | open   | frontend  | Mindmap visualization (SVG + zoom + pan)                            |
| #105   | `T-G05` | Polish & Gamification | open   | frontend  | Bookmark system (button + list screen)                              |
| #106   | `T-G06` | Polish & Gamification | open   | fullstack | Performance optimization (caching + lazy load + bundle audit)       |
| #107   | `T-H01` | Missing Features      | open   | backend   | TopicPerspective API (CRUD 5 perspectives per topic)                |
| #108   | `T-H02` | Missing Features      | open   | frontend  | Multi-perspective viewer screen (tabs/swipe per perspective)        |
| #109   | `T-H03` | Missing Features      | open   | backend   | MiniGame CRUD API (admin create, user play, score tracking)         |
| #110   | `T-H04` | Missing Features      | open   | frontend  | MiniGame play screen (3 game types + score + animation)             |
| #111   | `T-H05` | Missing Features      | open   | frontend  | MiniGame result + leaderboard component                             |
| #112   | `T-I01` | DevOps & Deploy       | closed | devops    | Docker Compose (Postgres 16 + Redis 7 + API dev)                    |
| #113   | `T-I02` | DevOps & Deploy       | closed | devops    | Environment config (.env.example + Zod validation)                  |
| #114   | `T-I03` | DevOps & Deploy       | closed | devops    | Database migration CI (Prisma migrate + seed in pipeline)           |
| #115   | `T-I04` | DevOps & Deploy       | closed | devops    | GitHub Actions CI (lint + typecheck + test on PR)                   |
| #116   | `T-I05` | DevOps & Deploy       | closed | devops    | EAS Build config (iOS + Android preview + production)               |
| #117   | `T-I06` | DevOps & Deploy       | closed | devops    | API deployment (Dockerfile + Railway/Render/Fly.io)                 |
| #118   | `T-I07` | DevOps & Deploy       | closed | devops    | Production database (Neon/Supabase Postgres + connection pool)      |
| #119   | `T-J01` | Testing               | open   | testing   | Backend unit tests: Auth service                                    |
| #120   | `T-J02` | Testing               | open   | testing   | Backend unit tests: Story + Quiz services                           |
| #121   | `T-J03` | Testing               | open   | testing   | API integration tests (Supertest: auth + CRUD + errors)             |
| #122   | `T-J04` | Testing               | open   | testing   | Frontend component tests (RTL: Card, Quiz, Chat)                    |
| #123   | `T-J05` | Testing               | open   | testing   | E2E smoke test (Maestro: login-home-story-complete)                 |
| #124   | `T-K01` | Admin & Settings      | closed | frontend  | Settings screen (profile edit, password change, notification prefs) |
| #125   | `T-K02` | Admin & Settings      | closed | fullstack | Forgot/Reset password API + screen (email OTP flow)                 |
| #126   | `T-K03` | Admin & Settings      | open   | frontend  | Terms of Service + Privacy Policy screens (markdown render)         |
| #127   | `T-K04` | Admin & Settings      | closed | fullstack | Delete account API + confirmation flow                              |
