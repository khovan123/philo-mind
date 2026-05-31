# PhiloMind Sprint Status From GitHub Issues

> Last sync: 2026-05-31
> Source of truth: GitHub issues in `khovan123/philo-mind`

## Summary

- Total tracked GitHub issues: 111
- Done / closed: 38
- Open / remaining: 73
- Completion: 34%
- Local issue logs available: 111
- GitHub issues currently missing Status Log: 0
- Sync action this run: 0 new local logs, 0 GitHub bodies patched

## Progress By Track

| Track | Name | Total | Done | Open |
| --- | --- | ---: | ---: | ---: |
| Track A | Backend Core | 22 | 14 | 8 |
| Track B | Frontend Shell | 16 | 6 | 10 |
| Track C | Shared Types & Seed | 12 | 3 | 9 |
| Track D | Story Mode Engine | 16 | 5 | 11 |
| Track E | AI & Chat System | 10 | 0 | 10 |
| Track F | Scenario & Debate | 8 | 0 | 8 |
| Track G | Polish & Gamification | 6 | 0 | 6 |
| Track H | Missing Features | 5 | 0 | 5 |
| Track I | DevOps & Deploy | 7 | 7 | 0 |
| Track J | Testing | 5 | 0 | 5 |
| Track K | Admin & Settings | 4 | 3 | 1 |

## Open Issues By Priority

| Priority | Open |
| --- | ---: |
| high | 9 |
| medium | 57 |
| low | 7 |

## Next Recommended Work

Run dev/review workflow for #22 `T-A06` Topic CRUD API (list/get/create/update + search/filter).

## Risks

- GitHub state only distinguishes open vs closed; it does not reliably show in-progress or review unless the team uses issue labels or project fields for those states.
- Local BMAD `_bmad-output` is ignored by Git, so this report and `issues/by-github-id/` are the tracked local docs for sprint visibility.
- Some tasks may be implemented through PRs while issue state stays open; keep issue state updated after merge to avoid stale plan status.

## Open Issues

- [ ] #22 `T-A06` Topic CRUD API (list/get/create/update + search/filter) (Backend Core, medium, @linhtv1209-fudn)
- [ ] #23 `T-A07` Lesson CRUD API (list by topic, detail with questions) (Backend Core, medium, @linhtv1209-fudn)
- [ ] #24 `T-A08` Short Lesson API (list/get/respond/comment) (Backend Core, medium, @linhtv1209-fudn)
- [ ] #25 `T-A09` User Progress API (upsert/stats/by-topic) (Backend Core, medium, @linhtv1209-fudn)
- [ ] #26 `T-A10` Quiz API (attempt/answer/complete/score) (Backend Core, medium, @linhtv1209-fudn)
- [ ] #32 `T-A16` Badge definition + auto-award engine (Backend Core, medium, @NTA1210)
- [ ] #33 `T-A17` Activity logging service + streak tracking (Backend Core, medium, @NTA1210)
- [ ] #34 `T-A18` Content moderation (report/action/auto-flag) (Backend Core, medium, @NTA1210)
- [ ] #42 `T-B04` Login screen UI (email/pass + validation + loading) (Frontend Shell, high, @thuhataplamdev)
- [ ] #44 `T-B06` Secure token storage (expo-secure-store + web fallback) (Frontend Shell, high, @thuhataplamdev)
- [ ] #45 `T-B07` API client (Axios instance + interceptors + auto-refresh) (Frontend Shell, high, @thuhataplamdev)
- [ ] #46 `T-B08` Auth Zustand store (login/register/logout/checkAuth) (Frontend Shell, high, @thuhataplamdev)
- [ ] #47 `T-B09` Home screen (daily hook + continue learning + stats) (Frontend Shell, medium, @anhthungye)
- [ ] #48 `T-B10` Explore screen (topic grid + search + category filter) (Frontend Shell, medium, @anhthungye)
- [ ] #49 `T-B11` Full Lesson screen (markdown render + concept highlight) (Frontend Shell, medium, @anhthungye)
- [ ] #50 `T-B12` Short Lesson swipe cards (hook-insight-conflict-vote) (Frontend Shell, medium, @anhthungye)
- [ ] #51 `T-B13` Quiz gameplay screen (questions + timer + result) (Frontend Shell, medium, @anhthungye)
- [ ] #54 `T-B16` Profile screen (stats grid + badge gallery + activity graph) (Frontend Shell, medium, @anhthungye)
- [ ] #58 `T-C04` Shared types: AI Chat, Scenario, Debate (Shared Types & Seed, high, @Thienhoang78)
- [ ] #59 `T-C05` Seed: 10 Topics + 30 Short Lessons (Shared Types & Seed, medium, @Thienhoang78)
- [ ] #60 `T-C06` Seed: 20 Full Lessons + 40 Quiz Questions (Shared Types & Seed, medium, @Thienhoang78)
- [ ] #61 `T-C07` Seed: 5 Story Scenarios (7-step complete) (Shared Types & Seed, medium, @Thienhoang78)
- [ ] #62 `T-C08` Seed: 5 AI Characters (prompts + bios) (Shared Types & Seed, medium, @Thienhoang78)
- [ ] #63 `T-C09` Seed: 10 Real-life Scenarios (4 perspectives each) (Shared Types & Seed, medium, @Thienhoang78)
- [ ] #64 `T-C10` Seed: 10 Debates + 20 Critical Questions + 10 Badges (Shared Types & Seed, medium, @Thienhoang78)
- [ ] #65 `T-C11` Seed: 5 MiniGames (matching, guess-who, logic) (Shared Types & Seed, medium, @Thienhoang78)
- [ ] #66 `T-C12` Seed: TopicPerspective data (5 perspectives x 10 topics) (Shared Types & Seed, medium, @Thienhoang78)
- [ ] #71 `T-D05` Community stats aggregation (% per choice, cache) (Story Mode Engine, medium, @dklinh05)
- [ ] #73 `T-D07` Story service + Zustand store (Story Mode Engine, medium, @dklinh05)
- [ ] #74 `T-D08` Step 1: INTRO screen (cinematic + character briefing) (Story Mode Engine, medium, @dklinh05)
- [ ] #75 `T-D09` Step 2: LEARN screen (swipeable cards + concept chips) (Story Mode Engine, medium, @dklinh05)
- [ ] #76 `T-D10` Step 3: DILEMMA screen (dramatic presentation) (Story Mode Engine, medium, @dklinh05)
- [ ] #77 `T-D11` Step 4: CHOOSE screen (choice cards + philosophy tags + reasoning) (Story Mode Engine, medium, @dklinh05)
- [ ] #78 `T-D12` Step 5: CONSEQUENCE screen (narrative + 4 analysis tabs) (Story Mode Engine, medium, @dklinh05)
- [ ] #79 `T-D13` Step 6: KNOWLEDGE screen (history + community stats + concepts) (Story Mode Engine, medium, @dklinh05)
- [ ] #80 `T-D14` Step 7: REFLECT screen (journal + completion) (Story Mode Engine, medium, @dklinh05)
- [ ] #81 `T-D15` StepProgress component (shared across all 7 steps) (Story Mode Engine, medium, @dklinh05)
- [ ] #82 `T-D16` Story flow integration test (end-to-end 7 steps) (Story Mode Engine, medium, @dklinh05)
- [ ] #83 `T-E01` Gemini API service (generate + stream + rate limit) (AI & Chat System, high, @VinhHoang03)
- [ ] #84 `T-E02` AI Character CRUD + prompt template system (AI & Chat System, high, @VinhHoang03)
- [ ] #85 `T-E03` AI Chat session + message API (AI & Chat System, high, @VinhHoang03)
- [ ] #86 `T-E04` SSE streaming endpoint (AI & Chat System, high, @VinhHoang03)
- [ ] #87 `T-E05` AI Chat service + Zustand store (AI & Chat System, medium, @VinhHoang03)
- [ ] #88 `T-E06` Character gallery screen (cards + session list) (AI & Chat System, medium, @VinhHoang03)
- [ ] #89 `T-E07` Chat conversation screen (bubbles + streaming text) (AI & Chat System, medium, @VinhHoang03)
- [ ] #90 `T-E08` ChatInput component (text + send + suggested prompts) (AI & Chat System, medium, @VinhHoang03)
- [ ] #91 `T-E09` StreamingText component (character-by-character render) (AI & Chat System, medium, @VinhHoang03)
- [ ] #92 `T-E10` AI Chat integration test (full conversation flow) (AI & Chat System, medium, @VinhHoang03)
- [ ] #93 `T-F01` Schema migration: ScenarioPerspective, ScenarioFramework (Scenario & Debate, medium, @Ngoclee123)
- [ ] #94 `T-F02` Real-life Scenario API (CRUD + perspectives + respond + stats) (Scenario & Debate, medium, @Ngoclee123)
- [ ] #95 `T-F03` Scenario SITUATION + PERSPECTIVES screens (Scenario & Debate, medium, @Ngoclee123)
- [ ] #96 `T-F04` Scenario FRAMEWORK + RETHINK screens (Scenario & Debate, medium, @Ngoclee123)
- [ ] #97 `T-F05` Debate CRUD + argument + vote + comment API (Scenario & Debate, medium, @Ngoclee123)
- [ ] #98 `T-F06` Debate list + detail screens (split FOR/AGAINST view) (Scenario & Debate, medium, @Ngoclee123)
- [ ] #99 `T-F07` Debate argue screen (stance + editor + preview) (Scenario & Debate, medium, @Ngoclee123)
- [ ] #100 `T-F08` Scenario + Debate integration tests (Scenario & Debate, low, @Ngoclee123)
- [ ] #101 `T-G01` Badge gallery + earn notifications (frontend) (Polish & Gamification, low, @kangdev03)
- [ ] #102 `T-G02` Notification bell + list screen (Polish & Gamification, low, @kangdev03)
- [ ] #103 `T-G03` Reflection journal screens (list + new + detail) (Polish & Gamification, low, @kangdev03)
- [ ] #104 `T-G04` Mindmap visualization (SVG + zoom + pan) (Polish & Gamification, low, @kangdev03)
- [ ] #105 `T-G05` Bookmark system (button + list screen) (Polish & Gamification, low, @kangdev03)
- [ ] #106 `T-G06` Performance optimization (caching + lazy load + bundle audit) (Polish & Gamification, medium, @kangdev03)
- [ ] #107 `T-H01` TopicPerspective API (CRUD 5 perspectives per topic) (Missing Features, medium, @Ngoclee123)
- [ ] #108 `T-H02` Multi-perspective viewer screen (tabs/swipe per perspective) (Missing Features, medium, @Ngoclee123)
- [ ] #109 `T-H03` MiniGame CRUD API (admin create, user play, score tracking) (Missing Features, medium, @kangdev03)
- [ ] #110 `T-H04` MiniGame play screen (3 game types + score + animation) (Missing Features, medium, @kangdev03)
- [ ] #111 `T-H05` MiniGame result + leaderboard component (Missing Features, medium, @kangdev03)
- [ ] #119 `T-J01` Backend unit tests: Auth service (Testing, medium, @NguyenDat204)
- [ ] #120 `T-J02` Backend unit tests: Story + Quiz services (Testing, medium, @NguyenDat204)
- [ ] #121 `T-J03` API integration tests (Supertest: auth + CRUD + errors) (Testing, medium, @NguyenDat204)
- [ ] #122 `T-J04` Frontend component tests (RTL: Card, Quiz, Chat) (Testing, medium, @NguyenDat204)
- [ ] #123 `T-J05` E2E smoke test (Maestro: login-home-story-complete) (Testing, medium, @NguyenDat204)
- [ ] #126 `T-K03` Terms of Service + Privacy Policy screens (markdown render) (Admin & Settings, low, @NguyenDat204)

## Recently Closed Issues

- [x] #72 `T-D06` Story list screen (cards + filters + replay indicator) (closed 2026-05-31T15:27:13Z)
- [x] #70 `T-D04` Consequence + Analysis API (get by choice, 4 categories) (closed 2026-05-31T14:07:07Z)
- [x] #69 `T-D03` Story Session API (start/decide/complete) (closed 2026-05-31T13:58:42Z)
- [x] #68 `T-D02` Story Scenario API (list with filters + detail with learn cards) (closed 2026-05-31T13:23:09Z)
- [x] #124 `T-K01` Settings screen (profile edit, password change, notification prefs) (closed 2026-05-31T12:54:09Z)
- [x] #127 `T-K04` Delete account API + confirmation flow (closed 2026-05-31T11:57:39Z)
- [x] #125 `T-K02` Forgot/Reset password API + screen (email OTP flow) (closed 2026-05-31T11:57:38Z)
- [x] #27 `T-A11` Reflection CRUD API (closed 2026-05-31T11:51:34Z)
- [x] #28 `T-A12` Critical Question API (list/random/admin CRUD) (closed 2026-05-31T10:33:41Z)
- [x] #67 `T-D01` Schema migration: StoryLearnCard, AnalysisTab, PhilosophyTag (closed 2026-05-31T09:51:43Z)
- [x] #116 `T-I05` EAS Build config (iOS + Android preview + production) (closed 2026-05-31T07:51:19Z)
- [x] #57 `T-C03` Shared types: Story, Session, Consequence (closed 2026-05-31T07:40:17Z)
- [x] #43 `T-B05` Register screen UI (fullname/email/pass/confirm + strength) (closed 2026-05-31T06:00:29Z)
- [x] #29 `T-A13` Mindmap Node/Edge API (closed 2026-05-31T05:41:51Z)
- [x] #118 `T-I07` Production database (Neon/Supabase Postgres + connection pool) (closed 2026-05-31T04:46:31Z)
- [x] #117 `T-I06` API deployment (Dockerfile + Railway/Render/Fly.io) (closed 2026-05-31T04:23:45Z)
- [x] #36 `T-A20` Redis caching for hot endpoints (closed 2026-05-31T04:01:54Z)
- [x] #35 `T-A19` Database indexes + query optimization (closed 2026-05-31T03:53:02Z)
- [x] #30 `T-A14` Bookmark toggle API (multi-type) (closed 2026-05-31T03:07:05Z)
- [x] #52 `T-B14` Onboarding flow (welcome + how-it-works + interest picker) (closed 2026-05-31T02:49:59Z)
