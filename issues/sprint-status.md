# PhiloMind Sprint Status From GitHub Issues

> Last sync: 2026-05-31
> Source of truth: GitHub issues in `khovan123/philo-mind`

## Summary

- Total tracked GitHub issues: 112
- Done / closed: 63
- Open / remaining: 49
- Completion: 56%
- Local issue logs available: 112
- GitHub issues currently missing Status Log: 0
- Sync action this run: 0 new local logs, 0 GitHub bodies patched

## Progress By Track

| Track   | Name                  | Total | Done | Open |
| ------- | --------------------- | ----: | ---: | ---: |
| Track A | Backend Core          |    22 |   15 |    7 |
| Track B | Frontend Shell        |    16 |   10 |    6 |
| Track C | Shared Types & Seed   |    13 |   11 |    2 |
| Track D | Story Mode Engine     |    16 |    6 |   10 |
| Track E | AI & Chat System      |    10 |    0 |   10 |
| Track F | Scenario & Debate     |     8 |    2 |    6 |
| Track G | Polish & Gamification |     6 |    3 |    3 |
| Track H | Missing Features      |     5 |    5 |    0 |
| Track I | DevOps & Deploy       |     7 |    7 |    0 |
| Track J | Testing               |     5 |    0 |    5 |
| Track K | Admin & Settings      |     4 |    4 |    0 |

## Open Issues By Priority

| Priority | Open |
| -------- | ---: |
| high     |    4 |
| medium   |   42 |
| low      |    3 |

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
- [ ] #33 `T-A17` Activity logging service + streak tracking (Backend Core, medium, @NTA1210)
- [ ] #34 `T-A18` Content moderation (report/action/auto-flag) (Backend Core, medium, @NTA1210)
- [ ] #47 `T-B09` Home screen (daily hook + continue learning + stats) (Frontend Shell, medium, @anhthungye)
- [ ] #48 `T-B10` Explore screen (topic grid + search + category filter) (Frontend Shell, medium, @anhthungye)
- [ ] #49 `T-B11` Full Lesson screen (markdown render + concept highlight) (Frontend Shell, medium, @anhthungye)
- [ ] #50 `T-B12` Short Lesson swipe cards (hook-insight-conflict-vote) (Frontend Shell, medium, @anhthungye)
- [ ] #51 `T-B13` Quiz gameplay screen (questions + timer + result) (Frontend Shell, medium, @anhthungye)
- [ ] #54 `T-B16` Profile screen (stats grid + badge gallery + activity graph) (Frontend Shell, medium, @anhthungye)
- [ ] #61 `T-C07` Seed: 5 Story Scenarios (13-step complete) (Shared Types & Seed, medium, @thuhataplamdev)
- [ ] #71 `T-D05` Community stats aggregation (% per choice, cache) (Story Mode Engine, medium, @khovan123, @dklinh05)
- [ ] #74 `T-D08` Step 1 (Story Detail) & Step 2 (Cinematic Opening) (Story Mode Engine, medium, @dklinh05)
- [ ] #75 `T-D09` Step 3 (Role Selection) & Step 4 (Role Intro) (Story Mode Engine, medium, @dklinh05)
- [ ] #76 `T-D10` Step 5 (Exploration Map) (Story Mode Engine, medium, @dklinh05)
- [ ] #77 `T-D11` Step 6 (NPC Encounter) & Step 7 (Mini Game) (Story Mode Engine, medium, @dklinh05)
- [ ] #78 `T-D12` Step 8 (Evidence Board) & Step 9 (Build Argument) (Story Mode Engine, medium, @dklinh05)
- [ ] #79 `T-D13` Step 10 (Argument Result) & Step 11 (Knowledge Unlock) (Story Mode Engine, medium, @dklinh05)
- [ ] #80 `T-D14` Step 12 (Quick Quiz) & Step 13 (Episode Complete) (Story Mode Engine, medium, @dklinh05)
- [ ] #81 `T-D15` StepProgress component adapted for 13 steps (Story Mode Engine, medium, @dklinh05)
- [ ] #82 `T-D16` Story flow integration test (end-to-end 13 steps) (Story Mode Engine, medium, @dklinh05)
- [ ] #83 `T-E01` Gemini API service (generate + stream + rate limit) (AI & Chat System, high, @VinhHoang03)
- [ ] #84 `T-E02` AI Character CRUD + prompt template system (AI & Chat System, high, @VinhHoang03)
- [ ] #85 `T-E03` AI Chat session + message API (AI & Chat System, high, @VinhHoang03)
- [ ] #86 `T-E04` SSE streaming endpoint (AI & Chat System, high, @VinhHoang03)
- [ ] #87 `T-E05` AI Chat RTK Query service + Redux slice (AI & Chat System, medium, @VinhHoang03)
- [ ] #88 `T-E06` Character gallery screen (cards + session list) (AI & Chat System, medium, @VinhHoang03)
- [ ] #89 `T-E07` Chat conversation screen (bubbles + streaming text) (AI & Chat System, medium, @VinhHoang03)
- [ ] #90 `T-E08` ChatInput component (text + send + suggested prompts) (AI & Chat System, medium, @VinhHoang03)
- [ ] #91 `T-E09` StreamingText component (character-by-character render) (AI & Chat System, medium, @VinhHoang03)
- [ ] #92 `T-E10` AI Chat integration test (full conversation flow) (AI & Chat System, medium, @VinhHoang03)
- [ ] #95 `T-F03` Scenario SITUATION + PERSPECTIVES screens (Scenario & Debate, medium, @Ngoclee123)
- [ ] #96 `T-F04` Scenario FRAMEWORK + RETHINK screens (Scenario & Debate, medium, @Ngoclee123)
- [ ] #97 `T-F05` Debate CRUD + argument + vote + comment API (Scenario & Debate, medium, @Ngoclee123)
- [ ] #98 `T-F06` Debate list + detail screens (split FOR/AGAINST view) (Scenario & Debate, medium, @Ngoclee123)
- [ ] #99 `T-F07` Debate argue screen (stance + editor + preview) (Scenario & Debate, medium, @Ngoclee123)
- [ ] #100 `T-F08` Scenario + Debate integration tests (Scenario & Debate, low, @Ngoclee123)
- [ ] #101 `T-G01` Badge gallery + earn notifications (frontend) (Polish & Gamification, low, @kangdev03)
- [ ] #102 `T-G02` Notification bell + list screen (Polish & Gamification, low, @kangdev03)
- [ ] #106 `T-G06` Performance optimization (caching + lazy load + bundle audit) (Polish & Gamification, medium, @kangdev03)
- [ ] #119 `T-J01` Backend unit tests: Auth service (Testing, medium, @NguyenDat204)
- [ ] #120 `T-J02` Backend unit tests: Story + Quiz services (Testing, medium, @NguyenDat204)
- [ ] #121 `T-J03` API integration tests (Supertest: auth + CRUD + errors) (Testing, medium, @NguyenDat204)
- [ ] #122 `T-J04` Frontend component tests (RTL: Card, Quiz, Chat) (Testing, medium, @NguyenDat204)
- [ ] #123 `T-J05` E2E smoke test (Maestro: login-home-story-complete) (Testing, medium, @NguyenDat204)
- [ ] #216 `T-C13` Refactor validation logic to shared library (Shared Types & Seed, medium, @thuhataplamdev)

## Recently Closed Issues

- [x] #94 `T-F02` Real-life Scenario API (CRUD + perspectives + respond + stats) (closed 2026-06-02T18:16:31Z)
- [x] #46 `T-B08` Auth Redux Toolkit slice + Redux Persist (login/register/logout/checkAuth) (closed 2026-06-01T12:30:46Z)
- [x] #66 `T-C12` Seed: TopicPerspective data (5 perspectives x 10 topics) (closed 2026-06-01T12:17:19Z)
- [x] #65 `T-C11` Seed: 5 MiniGames (matching, guess-who, logic) (closed 2026-06-01T12:04:19Z)
- [x] #64 `T-C10` Seed: 10 Debates + 20 Critical Questions + 10 Badges (closed 2026-06-01T11:50:33Z)
- [x] #73 `T-D07` Story RTK Query service + Redux slice (closed 2026-06-01T10:49:28Z)
- [x] #63 `T-C09` Seed: 10 Real-life Scenarios (4 perspectives each) (closed 2026-06-01T10:16:16Z)
- [x] #62 `T-C08` Seed: 5 AI Characters (prompts + bios) (closed 2026-06-01T09:46:01Z)
- [x] #45 `T-B07` RTK Query API layer (baseQuery + reauth + token persistence) (closed 2026-06-01T09:06:48Z)
- [x] #93 `T-F01` Schema migration: ScenarioPerspective, ScenarioFramework (closed 2026-06-01T06:29:11Z)
- [x] #44 `T-B06` Secure token storage (expo-secure-store + web fallback) (closed 2026-06-01T05:15:53Z)
- [x] #126 `T-K03` Terms of Service + Privacy Policy screens (markdown render) (closed 2026-06-01T04:01:25Z)
- [x] #60 `T-C06` Seed: 20 Full Lessons + 40 Quiz Questions (closed 2026-06-01T01:09:09Z)
- [x] #59 `T-C05` Seed: 10 Topics + 30 Short Lessons (closed 2026-06-01T00:28:41Z)
- [x] #42 `T-B04` Login screen UI (email/pass + validation + loading) (closed 2026-05-31T20:56:19Z)
- [x] #111 `T-H05` MiniGame result + leaderboard component (closed 2026-05-31T19:39:12Z)
- [x] #110 `T-H04` MiniGame play screen (3 game types + score + animation) (closed 2026-05-31T19:33:19Z)
- [x] #105 `T-G05` Bookmark system (button + list screen) (closed 2026-05-31T19:21:46Z)
- [x] #107 `T-H01` TopicPerspective API (CRUD 5 perspectives per topic) (closed 2026-05-31T19:12:37Z)
- [x] #108 `T-H02` Multi-perspective viewer screen (tabs/swipe per perspective) (closed 2026-05-31T19:12:37Z)
