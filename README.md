# PhiloMind

Monorepo project powered by **Express.js** (backend) and **React Native / Expo** (frontend).

#trigger

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Frontend | Expo SDK 56, React Native 0.85, React 19          |
| Styling  | TailwindCSS v4 + NativeWind v5 + react-native-css |
| Backend  | Express.js 5, TypeScript 5                        |
| Monorepo | npm workspaces                                    |
| Shared   | @philo-mind/shared (types, constants, utilities)  |

## Design

🎨 **UI/UX Design:** [Stitch Project](https://stitch.withgoogle.com/projects/16360193101983963529)

## Project Structure

```
philo-mind
├─ .claude
│  └─ agents
│     ├─ atlas-tech-lead.md
│     ├─ forge-backend.md
│     ├─ muse-ai-storytelling.md
│     ├─ pixel-frontend.md
│     ├─ sage-product-ux.md
│     └─ verity-qa.md
├─ .code-review-graph
│  └─ graph.db
├─ .dockerignore
├─ .mcp.json
├─ .prettierignore
├─ .prettierrc
├─ AGENTS.md
├─ AGENTS.md.bak
├─ CLAUDE.md
├─ Dockerfile
├─ README.md
├─ core-data
│  └─ Chapter_01.pdf
├─ data
│  ├─ 01-topics.csv
│  ├─ 02-short-lessons.csv
│  ├─ 03-full-lessons
│  │  ├─ 01-chu-nghia-duy-vat-bien-chung.md
│  │  ├─ 01-triet-hoc-la-gi-va-tai-sao-can-hoc.md
│  │  ├─ 02-hoc-thuyet-gia-tri-thua-du.md
│  │  ├─ 02-triet-hoc-qua-cac-thoi-ky-lich-su.md
│  │  ├─ 03-cau-hoi-2500-nam-vat-chat-hay-y-thuc.md
│  │  ├─ 03-triet-hoc-phuong-dong-1.md
│  │  ├─ 04-thuyet-kha-tri-va-bat-kha-tri.md
│  │  ├─ 04-triet-hoc-phuong-dong-2.md
│  │  ├─ 05-ba-hinh-thuc-duy-vat-trong-lich-su.md
│  │  ├─ 05-khac-ky-1.md
│  │  ├─ 06-chu-nghia-duy-tam-khi-tinh-than-len-tren-vat-chat.md
│  │  ├─ 06-khac-ky-2.md
│  │  ├─ 07-cach-mang-cong-nghiep-va-giai-cap-vo-san-dieu-kien-kinh-te-xa-hoi-cua-triet-hoc-mac.md
│  │  ├─ 07-hien-sinh-1.md
│  │  ├─ 08-hien-sinh-2.md
│  │  ├─ 08-khoa-hoc-tu-nhien-va-tien-de-ly-luan-nen-tang-tri-thuc-cua-triet-hoc-mac.md
│  │  ├─ 09-khoai-lac-1.md
│  │  ├─ 10-khoai-lac-2.md
│  │  ├─ 11-nhan-thuc-1.md
│  │  ├─ 12-nhan-thuc-2.md
│  │  ├─ 13-chinh-tri-1.md
│  │  ├─ 14-chinh-tri-2.md
│  │  ├─ 15-tam-tri-1.md
│  │  ├─ 16-tam-tri-2.md
│  │  ├─ 17-my-hoc-1.md
│  │  ├─ 18-my-hoc-2.md
│  │  ├─ 19-thuc-dung-1.md
│  │  └─ 20-thuc-dung-2.md
│  ├─ 04-quizzes.csv
│  ├─ 05-stories
│  │  ├─ 01-dem-cuoi-ca-cua-minh.md
│  │  ├─ 01-triet-hoc-va-the-gioi-quan.md
│  │  ├─ 02-1-trieu-view-va-cau-hoi-ban-chua-dam-hoi.md
│  │  ├─ 02-van-de-co-ban-cua-triet-hoc.md
│  │  ├─ 03-chu-nghia-duy-vat-va-duy-tam.md
│  │  └─ 04-dieu-kien-ra-doi-triet-hoc-mac.md
│  ├─ 06-ai-character.csv
│  ├─ 06-ai-characters.csv
│  ├─ 07-scenarios.csv
│  ├─ 08-debates.csv
│  ├─ 09-critical-questions.csv
│  ├─ 10-badges.csv
│  ├─ 11-minigames
│  │  ├─ 01-dau-truong-tu-tuong.md
│  │  ├─ 01-marx-hay-khong-phai-marx.md
│  │  ├─ 02-ghep-khai-niem-mac-lenin.md
│  │  ├─ 03-triet-gia-bi-an.md
│  │  ├─ 04-ai-la-nha-tu-tuong.md
│  │  └─ 05-sap-xep-tam-doan-luan.md
│  ├─ 12-mindmaps
│  │  ├─ 01-chu-nghia-mac-le-nin.md
│  │  ├─ 01-triet-hoc-va-the-gioi-quan.md
│  │  ├─ 02_van_de_co_ban_cua_triet_hoc.md
│  │  ├─ 03_chu_nghia_duy_vat_va_duy_tam.md
│  │  ├─ 04_dieu_kien_ra_doi_triet_hoc_mac.md
│  │  └─ 06-chuong-1-khai-luoc-triet-hoc.md
│  ├─ 13-perspectives.csv
│  ├─ chapter-01
│  │  ├─ 01-i1-khai-luoc-ve-triet-hoc.json
│  │  ├─ 02-i2-van-de-co-ban-cua-triet-hoc.json
│  │  ├─ 03-i3-bien-chung-va-sieu-hinh.json
│  │  ├─ 04-ii1-su-ra-doi-va-phat-trien-triet-hoc-mac-lenin.json
│  │  ├─ 05-ii2a-doi-tuong-va-chuc-nang-triet-hoc-mac-lenin.json
│  │  ├─ 06-ii2b-vai-tro-trong-doi-song-va-doi-moi-o-viet-nam.json
│  │  └─ flashcards.json
│  ├─ content_chuong1.csv
│  └─ content_chuong2.csv
├─ docker-compose.yml
├─ eslint.config.mjs
├─ fly.toml
├─ infra
│  └─ postgres
│     └─ init.sql
├─ issues
│  ├─ [T-A06] Topic CRUD API (list-get-create-update + search-filter).md
│  ├─ [T-A07] Lesson CRUD API (list by topic, detail with questions).md
│  ├─ [T-A08] Short Lesson API (list-get-respond-comment).md
│  ├─ [T-A09] User Progress API (upsert-stats-by-topic).md
│  ├─ [T-A10] Quiz API (attempt-answer-complete-score).md
│  ├─ [T-A16] Badge definition + auto-award engine.md
│  ├─ [T-A17] Activity logging service + streak tracking.md
│  ├─ [T-A18] Content moderation (report-action-auto-flag).md
│  ├─ [T-B04] Login screen UI (email-pass + validation + loading).md
│  ├─ [T-B06] Secure token storage (expo-secure-store + web fallback).md
│  ├─ [T-B07] RTK Query API layer (baseQuery + reauth + token persistence).md
│  ├─ [T-B08] Auth Redux Toolkit slice + Redux Persist (login-register-logout-checkAuth).md
│  ├─ [T-B09] Home screen (daily hook + continue learning + stats).md
│  ├─ [T-B10] Explore screen (topic grid + search + category filter).md
│  ├─ [T-B11] Full Lesson screen (markdown render + concept highlight).md
│  ├─ [T-B12] Short Lesson swipe cards (hook-insight-conflict-vote).md
│  ├─ [T-B13] Quiz gameplay screen (questions + timer + result).md
│  ├─ [T-B16] Profile screen (stats grid + badge gallery + activity graph).md
│  ├─ [T-C04] Shared types- AI Chat, Scenario, Debate.md
│  ├─ [T-C05] Seed- 10 Topics + 30 Short Lessons.md
│  ├─ [T-C06] Seed- 20 Full Lessons + 40 Quiz Questions.md
│  ├─ [T-C07] Seed- 5 Story Scenarios (13-step complete).md
│  ├─ [T-C08] Seed- 5 AI Characters (prompts + bios).md
│  ├─ [T-C09] Seed- 10 Real-life Scenarios (4 perspectives each).md
│  ├─ [T-C10] Seed- 10 Debates + 20 Critical Questions + 10 Badges.md
│  ├─ [T-C11] Seed- 5 MiniGames (matching, guess-who, logic).md
│  ├─ [T-C12] Seed- TopicPerspective data (5 perspectives x 10 topics).md
│  ├─ [T-C13] Refactor validation logic to shared library.md
│  ├─ [T-D05] Community stats aggregation (% per choice, cache).md
│  ├─ [T-D06] Story list screen (cards + filters + replay indicator).md
│  ├─ [T-D07] Story RTK Query service + Redux slice.md
│  ├─ [T-D08] Step 1 (Story Detail) & Step 2 (Cinematic Opening).md
│  ├─ [T-D09] Step 3 (Role Selection) & Step 4 (Role Intro).md
│  ├─ [T-D10] Step 5 (Exploration Map).md
│  ├─ [T-D11] Step 6 (NPC Encounter) & Step 7 (Mini Game).md
│  ├─ [T-D12] Step 8 (Evidence Board) & Step 9 (Build Argument).md
│  ├─ [T-D13] Step 10 (Argument Result) & Step 11 (Knowledge Unlock).md
│  ├─ [T-D14] Step 12 (Quick Quiz) & Step 13 (Episode Complete).md
│  ├─ [T-D15] StepProgress component adapted for 13 steps.md
│  ├─ [T-D16] Story flow integration test (end-to-end 13 steps).md
│  ├─ [T-E01] Gemini API service (generate + stream + rate limit).md
│  ├─ [T-E02] AI Character CRUD + prompt template system.md
│  ├─ [T-E03] AI Chat session + message API.md
│  ├─ [T-E04] SSE streaming endpoint.md
│  ├─ [T-E05] AI Chat RTK Query service + Redux slice.md
│  ├─ [T-E06] Character gallery screen (cards + session list).md
│  ├─ [T-E07] Chat conversation screen (bubbles + streaming text).md
│  ├─ [T-E08] ChatInput component (text + send + suggested prompts).md
│  ├─ [T-E09] StreamingText component (character-by-character render).md
│  ├─ [T-E10] AI Chat integration test (full conversation flow).md
│  ├─ [T-F01] Schema migration- ScenarioPerspective, ScenarioFramework.md
│  ├─ [T-F02] Real-life Scenario API (CRUD + perspectives + respond + stats).md
│  ├─ [T-F03] Scenario SITUATION + PERSPECTIVES screens.md
│  ├─ [T-F04] Scenario FRAMEWORK + RETHINK screens.md
│  ├─ [T-F05] Debate CRUD + argument + vote + comment API.md
│  ├─ [T-F06] Debate list + detail screens (split FOR-AGAINST view).md
│  ├─ [T-F07] Debate argue screen (stance + editor + preview).md
│  ├─ [T-F08] Scenario + Debate integration tests.md
│  ├─ [T-G01] Badge gallery + earn notifications (frontend).md
│  ├─ [T-G02] Notification bell + list screen.md
│  ├─ [T-G03] Reflection journal screens (list + new + detail).md
│  ├─ [T-G04] Mindmap visualization (SVG + zoom + pan).md
│  ├─ [T-G05] Bookmark system (button + list screen).md
│  ├─ [T-G06] Performance optimization (caching + lazy load + bundle audit).md
│  ├─ [T-H01] TopicPerspective API (CRUD 5 perspectives per topic).md
│  ├─ [T-H02] Multi-perspective viewer screen (tabs-swipe per perspective).md
│  ├─ [T-H03] MiniGame CRUD API (admin create, user play, score tracking).md
│  ├─ [T-H04] MiniGame play screen (3 game types + score + animation).md
│  ├─ [T-H05] MiniGame result + leaderboard component.md
│  ├─ [T-J01] Backend unit tests- Auth service.md
│  ├─ [T-J02] Backend unit tests- Story + Quiz services.md
│  ├─ [T-J03] API integration tests (Supertest- auth + CRUD + errors).md
│  ├─ [T-J04] Frontend component tests (RTL- Card, Quiz, Chat).md
│  ├─ [T-J05] E2E smoke test (Maestro- login-home-story-complete).md
│  ├─ [T-K03] Terms of Service + Privacy Policy screens (markdown render).md
│  ├─ by-github-id
│  │  ├─ #017-T-A01-Response format util (sendSuccess, sendError, sendPaginated).md
│  │  ├─ #018-T-A02-Validation middleware (Zod validate for body-params-query).md
│  │  ├─ #019-T-A03-JWT Auth service (register-login-refresh-logout).md
│  │  ├─ #020-T-A04-Auth middleware (authGuard + roleGuard).md
│  │  ├─ #021-T-A05-Auth routes + controller (-api-v1-auth--).md
│  │  ├─ #022-T-A06-Topic CRUD API (list-get-create-update + search-filter).md
│  │  ├─ #023-T-A07-Lesson CRUD API (list by topic, detail with questions).md
│  │  ├─ #024-T-A08-Short Lesson API (list-get-respond-comment).md
│  │  ├─ #025-T-A09-User Progress API (upsert-stats-by-topic).md
│  │  ├─ #026-T-A10-Quiz API (attempt-answer-complete-score).md
│  │  ├─ #027-T-A11-Reflection CRUD API.md
│  │  ├─ #028-T-A12-Critical Question API (list-random-admin CRUD).md
│  │  ├─ #029-T-A13-Mindmap Node-Edge API.md
│  │  ├─ #030-T-A14-Bookmark toggle API (multi-type).md
│  │  ├─ #031-T-A15-Notification CRUD API.md
│  │  ├─ #032-T-A16-Badge definition + auto-award engine.md
│  │  ├─ #033-T-A17-Activity logging service + streak tracking.md
│  │  ├─ #034-T-A18-Content moderation (report-action-auto-flag).md
│  │  ├─ #035-T-A19-Database indexes + query optimization.md
│  │  ├─ #036-T-A20-Redis caching for hot endpoints.md
│  │  ├─ #037-T-A21-API response compression (gzip).md
│  │  ├─ #038-T-A22-Seed runner script (npm run seed).md
│  │  ├─ #039-T-B01-Design tokens + global styles (NativeWind theme).md
│  │  ├─ #040-T-B02-Common UI components (Button, Card, Input, Badge, Avatar).md
│  │  ├─ #041-T-B03-Tab navigation layout (5 tabs + icons + active state).md
│  │  ├─ #042-T-B04-Login screen UI (email-pass + validation + loading).md
│  │  ├─ #043-T-B05-Register screen UI (fullname-email-pass-confirm + strength).md
│  │  ├─ #044-T-B06-Secure token storage (expo-secure-store + web fallback).md
│  │  ├─ #045-T-B07-RTK Query API layer (baseQuery + reauth + token persistence).md
│  │  ├─ #046-T-B08-Auth Redux Toolkit slice + Redux Persist (login-register-logout-checkAuth).md
│  │  ├─ #047-T-B09-Home screen (daily hook + continue learning + stats).md
│  │  ├─ #048-T-B10-Explore screen (topic grid + search + category filter).md
│  │  ├─ #049-T-B11-Full Lesson screen (markdown render + concept highlight).md
│  │  ├─ #050-T-B12-Short Lesson swipe cards (hook-insight-conflict-vote).md
│  │  ├─ #051-T-B13-Quiz gameplay screen (questions + timer + result).md
│  │  ├─ #052-T-B14-Onboarding flow (welcome + how-it-works + interest picker).md
│  │  ├─ #053-T-B15-Progress components (ProgressRing, ProgressBadge, StatusBadge).md
│  │  ├─ #054-T-B16-Profile screen (stats grid + badge gallery + activity graph).md
│  │  ├─ #055-T-C01-Shared types- Auth, API response, enums.md
│  │  ├─ #056-T-C02-Shared types- Topic, Lesson, Quiz.md
│  │  ├─ #057-T-C03-Shared types- Story, Session, Consequence.md
│  │  ├─ #058-T-C04-Shared types- AI Chat, Scenario, Debate.md
│  │  ├─ #059-T-C05-Seed- 10 Topics + 30 Short Lessons.md
│  │  ├─ #060-T-C06-Seed- 20 Full Lessons + 40 Quiz Questions.md
│  │  ├─ #061-T-C07-Seed- 5 Story Scenarios (13-step complete).md
│  │  ├─ #061-T-C07-Seed- 5 Story Scenarios (7-step complete).md
│  │  ├─ #062-T-C08-Seed- 5 AI Characters (prompts + bios).md
│  │  ├─ #063-T-C09-Seed- 10 Real-life Scenarios (4 perspectives each).md
│  │  ├─ #064-T-C10-Seed- 10 Debates + 20 Critical Questions + 10 Badges.md
│  │  ├─ #065-T-C11-Seed- 5 MiniGames (matching, guess-who, logic).md
│  │  ├─ #066-T-C12-Seed- TopicPerspective data (5 perspectives x 10 topics).md
│  │  ├─ #067-T-D01-Schema migration- StoryLearnCard, AnalysisTab, PhilosophyTag.md
│  │  ├─ #068-T-D02-Story Scenario API (list with filters + detail with learn cards).md
│  │  ├─ #069-T-D03-Story Session API (start-decide-complete).md
│  │  ├─ #070-T-D04-Consequence + Analysis API (get by choice, 4 categories).md
│  │  ├─ #071-T-D05-Community stats aggregation (% per choice, cache).md
│  │  ├─ #072-T-D06-Story list screen (cards + filters + replay indicator).md
│  │  ├─ #073-T-D07-Story RTK Query service + Redux slice.md
│  │  ├─ #074-T-D08-Step 1 (Story Detail) & Step 2 (Cinematic Opening).md
│  │  ├─ #074-T-D08-Step 1- INTRO screen (cinematic + character briefing).md
│  │  ├─ #075-T-D09-Step 2- LEARN screen (swipeable cards + concept chips).md
│  │  ├─ #075-T-D09-Step 3 (Role Selection) & Step 4 (Role Intro).md
│  │  ├─ #076-T-D10-Step 3- DILEMMA screen (dramatic presentation).md
│  │  ├─ #076-T-D10-Step 5 (Exploration Map).md
│  │  ├─ #077-T-D11-Step 4- CHOOSE screen (choice cards + philosophy tags + reasoning).md
│  │  ├─ #077-T-D11-Step 6 (NPC Encounter) & Step 7 (Mini Game).md
│  │  ├─ #078-T-D12-Step 5- CONSEQUENCE screen (narrative + 4 analysis tabs).md
│  │  ├─ #078-T-D12-Step 8 (Evidence Board) & Step 9 (Build Argument).md
│  │  ├─ #079-T-D13-Step 10 (Argument Result) & Step 11 (Knowledge Unlock).md
│  │  ├─ #079-T-D13-Step 6- KNOWLEDGE screen (history + community stats + concepts).md
│  │  ├─ #080-T-D14-Step 12 (Quick Quiz) & Step 13 (Episode Complete).md
│  │  ├─ #080-T-D14-Step 7- REFLECT screen (journal + completion).md
│  │  ├─ #081-T-D15-StepProgress component (shared across all 7 steps).md
│  │  ├─ #081-T-D15-StepProgress component adapted for 13 steps.md
│  │  ├─ #082-T-D16-Story flow integration test (end-to-end 13 steps).md
│  │  ├─ #082-T-D16-Story flow integration test (end-to-end 7 steps).md
│  │  ├─ #083-T-E01-Gemini API service (generate + stream + rate limit).md
│  │  ├─ #084-T-E02-AI Character CRUD + prompt template system.md
│  │  ├─ #085-T-E03-AI Chat session + message API.md
│  │  ├─ #086-T-E04-SSE streaming endpoint.md
│  │  ├─ #087-T-E05-AI Chat RTK Query service + Redux slice.md
│  │  ├─ #088-T-E06-Character gallery screen (cards + session list).md
│  │  ├─ #089-T-E07-Chat conversation screen (bubbles + streaming text).md
│  │  ├─ #090-T-E08-ChatInput component (text + send + suggested prompts).md
│  │  ├─ #091-T-E09-StreamingText component (character-by-character render).md
│  │  ├─ #092-T-E10-AI Chat integration test (full conversation flow).md
│  │  ├─ #093-T-F01-Schema migration- ScenarioPerspective, ScenarioFramework.md
│  │  ├─ #094-T-F02-Real-life Scenario API (CRUD + perspectives + respond + stats).md
│  │  ├─ #095-T-F03-Scenario SITUATION + PERSPECTIVES screens.md
│  │  ├─ #096-T-F04-Scenario FRAMEWORK + RETHINK screens.md
│  │  ├─ #097-T-F05-Debate CRUD + argument + vote + comment API.md
│  │  ├─ #098-T-F06-Debate list + detail screens (split FOR-AGAINST view).md
│  │  ├─ #099-T-F07-Debate argue screen (stance + editor + preview).md
│  │  ├─ #100-T-F08-Scenario + Debate integration tests.md
│  │  ├─ #101-T-G01-Badge gallery + earn notifications (frontend).md
│  │  ├─ #102-T-G02-Notification bell + list screen.md
│  │  ├─ #103-T-G03-Reflection journal screens (list + new + detail).md
│  │  ├─ #104-T-G04-Mindmap visualization (SVG + zoom + pan).md
│  │  ├─ #105-T-G05-Bookmark system (button + list screen).md
│  │  ├─ #106-T-G06-Performance optimization (caching + lazy load + bundle audit).md
│  │  ├─ #107-T-H01-TopicPerspective API (CRUD 5 perspectives per topic).md
│  │  ├─ #108-T-H02-Multi-perspective viewer screen (tabs-swipe per perspective).md
│  │  ├─ #109-T-H03-MiniGame CRUD API (admin create, user play, score tracking).md
│  │  ├─ #110-T-H04-MiniGame play screen (3 game types + score + animation).md
│  │  ├─ #111-T-H05-MiniGame result + leaderboard component.md
│  │  ├─ #112-T-I01-Docker Compose (Postgres 16 + Redis 7 + API dev).md
│  │  ├─ #114-T-I03-Database migration CI (Prisma migrate + seed in pipeline).md
│  │  ├─ #115-T-I04-GitHub Actions CI (lint + typecheck + test on PR).md
│  │  ├─ #116-T-I05-EAS Build config (iOS + Android preview + production).md
│  │  ├─ #117-T-I06-API deployment (Dockerfile + Railway-Render-Fly.io).md
│  │  ├─ #118-T-I07-Production database (Neon-Supabase Postgres + connection pool).md
│  │  ├─ #119-T-J01-Backend unit tests- Auth service.md
│  │  ├─ #120-T-J02-Backend unit tests- Story + Quiz services.md
│  │  ├─ #121-T-J03-API integration tests (Supertest- auth + CRUD + errors).md
│  │  ├─ #122-T-J04-Frontend component tests (RTL- Card, Quiz, Chat).md
│  │  ├─ #123-T-J05-E2E smoke test (Maestro- login-home-story-complete).md
│  │  ├─ #124-T-K01-Settings screen (profile edit, password change, notification prefs).md
│  │  ├─ #125-T-K02-Forgot-Reset password API + screen (email OTP flow).md
│  │  ├─ #126-T-K03-Terms of Service + Privacy Policy screens (markdown render).md
│  │  ├─ #127-T-K04-Delete account API + confirmation flow.md
│  │  └─ #216-T-C13-Refactor validation logic to shared library.md
│  ├─ feature-output-contracts.md
│  └─ sprint-status.md
├─ libs
│  └─ shared
│     ├─ package.json
│     ├─ src
│     │  ├─ constants
│     │  ├─ index.ts
│     │  ├─ types
│     │  │  ├─ activity.ts
│     │  │  ├─ auth.ts
│     │  │  ├─ interactive.ts
│     │  │  ├─ learning.ts
│     │  │  └─ story.ts
│     │  ├─ utils
│     │  └─ validators
│     │     ├─ activity.validator.ts
│     │     ├─ ai-character.validator.ts
│     │     ├─ ai-chat.validator.ts
│     │     ├─ ai.validator.ts
│     │     ├─ analysis-tab.validator.ts
│     │     ├─ auth.validator.ts
│     │     ├─ bookmark.validator.ts
│     │     ├─ choice.validator.ts
│     │     ├─ critical-question.validator.ts
│     │     ├─ debate.validator.ts
│     │     ├─ lesson.validator.ts
│     │     ├─ mindmap.validator.ts
│     │     ├─ minigame.validator.ts
│     │     ├─ notification.validator.ts
│     │     ├─ philosophy-tag.validator.ts
│     │     ├─ progress.validator.ts
│     │     ├─ quiz.validator.ts
│     │     ├─ reflection.validator.ts
│     │     ├─ scenario.validator.ts
│     │     ├─ short-lesson.validator.ts
│     │     ├─ story-learn-card.validator.ts
│     │     ├─ story-session.validator.ts
│     │     ├─ story.validator.ts
│     │     ├─ topic-perspective.validator.ts
│     │     └─ topic.validator.ts
│     └─ tsconfig.json
├─ nativewind-env.d.ts
├─ package-lock.json
├─ package.json
├─ plans
│  └─ plan.md
├─ review.md
├─ services
│  ├─ .dockerignore
│  ├─ .prettierignore
│  ├─ Dockerfile.dev
│  ├─ eslint.config.mjs
│  ├─ jest.config.js
│  ├─ package.json
│  ├─ prisma.config.ts
│  ├─ scripts
│  │  ├─ db-rollback.sh
│  │  ├─ export-engagement-csv.mjs
│  │  ├─ export-minigames-md.mjs
│  │  └─ export-scenarios-csv.mjs
│  ├─ src
│  │  ├─ __tests__
│  │  │  ├─ activity.test.ts
│  │  │  ├─ ai-character.validator.test.ts
│  │  │  ├─ ai-chat.e2e.test.ts
│  │  │  ├─ ai-chat.service.test.ts
│  │  │  ├─ ai-chat.stream.test.ts
│  │  │  ├─ ai-chat.validator.test.ts
│  │  │  ├─ ai-rate-limit.test.ts
│  │  │  ├─ analysis-tab.test.ts
│  │  │  ├─ api.integration.test.ts
│  │  │  ├─ auth.middleware.test.ts
│  │  │  ├─ auth.reset.test.ts
│  │  │  ├─ auth.service.test.ts
│  │  │  ├─ badge.test.ts
│  │  │  ├─ bookmark.test.ts
│  │  │  ├─ cache-key.test.ts
│  │  │  ├─ cache.middleware.test.ts
│  │  │  ├─ consequence.test.ts
│  │  │  ├─ critical-question.test.ts
│  │  │  ├─ debate.test.ts
│  │  │  ├─ dummy.test.ts
│  │  │  ├─ lesson.validator.test.ts
│  │  │  ├─ mindmap.test.ts
│  │  │  ├─ minigame.test.ts
│  │  │  ├─ moderation.test.ts
│  │  │  ├─ notification.test.ts
│  │  │  ├─ progress.test.ts
│  │  │  ├─ quiz.test.ts
│  │  │  ├─ reflection.test.ts
│  │  │  ├─ scenario.test.ts
│  │  │  ├─ short-lesson.test.ts
│  │  │  ├─ story-learn-card.test.ts
│  │  │  ├─ story-scenarios.test.ts
│  │  │  ├─ story-session.service.test.ts
│  │  │  ├─ story-session.test.ts
│  │  │  ├─ story.service.test.ts
│  │  │  ├─ story.test.ts
│  │  │  ├─ topic-perspective.test.ts
│  │  │  └─ topic.test.ts
│  │  ├─ config
│  │  │  ├─ env.ts
│  │  │  └─ prisma.ts
│  │  ├─ controllers
│  │  │  ├─ activity-log.controller.ts
│  │  │  ├─ ai-character.controller.ts
│  │  │  ├─ ai-chat.controller.ts
│  │  │  ├─ ai.controller.ts
│  │  │  ├─ analysis-tab.controller.ts
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ badge.controller.ts
│  │  │  ├─ bookmark.controller.ts
│  │  │  ├─ chapter.controller.ts
│  │  │  ├─ consequence.controller.ts
│  │  │  ├─ critical-question.controller.ts
│  │  │  ├─ debate.controller.ts
│  │  │  ├─ learning.controller.ts
│  │  │  ├─ lesson.controller.ts
│  │  │  ├─ mindmap.controller.ts
│  │  │  ├─ minigame.controller.ts
│  │  │  ├─ moderation.controller.ts
│  │  │  ├─ notification.controller.ts
│  │  │  ├─ philosophy-tag.controller.ts
│  │  │  ├─ profile.controller.ts
│  │  │  ├─ progress.controller.ts
│  │  │  ├─ quiz.controller.ts
│  │  │  ├─ reflection.controller.ts
│  │  │  ├─ scenario.controller.ts
│  │  │  ├─ short-lesson.controller.ts
│  │  │  ├─ stats.controller.ts
│  │  │  ├─ story-learn-card.controller.ts
│  │  │  ├─ story-session.controller.ts
│  │  │  ├─ story.controller.ts
│  │  │  ├─ topic-perspective.controller.ts
│  │  │  └─ topic.controller.ts
│  │  ├─ index.ts
│  │  ├─ middleware
│  │  │  ├─ ai-rate-limit.ts
│  │  │  ├─ auth.middleware.ts
│  │  │  ├─ cache.middleware.ts
│  │  │  ├─ error.middleware.ts
│  │  │  ├─ rateLimit.middleware.ts
│  │  │  └─ validate.middleware.ts
│  │  ├─ models
│  │  ├─ prisma
│  │  │  ├─ generated
│  │  │  │  ├─ browser.ts
│  │  │  │  ├─ client.ts
│  │  │  │  ├─ commonInputTypes.ts
│  │  │  │  ├─ enums.ts
│  │  │  │  ├─ internal
│  │  │  │  │  ├─ class.ts
│  │  │  │  │  ├─ prismaNamespace.ts
│  │  │  │  │  └─ prismaNamespaceBrowser.ts
│  │  │  │  ├─ models
│  │  │  │  │  ├─ ActivityLog.ts
│  │  │  │  │  ├─ AiCharacter.ts
│  │  │  │  │  ├─ AiChatMessage.ts
│  │  │  │  │  ├─ AiChatSession.ts
│  │  │  │  │  ├─ AnalysisTab.ts
│  │  │  │  │  ├─ Badge.ts
│  │  │  │  │  ├─ Bookmark.ts
│  │  │  │  │  ├─ CriticalQuestion.ts
│  │  │  │  │  ├─ Debate.ts
│  │  │  │  │  ├─ DebateArgument.ts
│  │  │  │  │  ├─ DebateComment.ts
│  │  │  │  │  ├─ DebateVote.ts
│  │  │  │  │  ├─ Lesson.ts
│  │  │  │  │  ├─ LessonAnswer.ts
│  │  │  │  │  ├─ LessonQuestion.ts
│  │  │  │  │  ├─ MindmapEdge.ts
│  │  │  │  │  ├─ MindmapNode.ts
│  │  │  │  │  ├─ MiniGame.ts
│  │  │  │  │  ├─ MiniGameAttempt.ts
│  │  │  │  │  ├─ ModerationAction.ts
│  │  │  │  │  ├─ Notification.ts
│  │  │  │  │  ├─ PasswordReset.ts
│  │  │  │  │  ├─ PhilosophyTag.ts
│  │  │  │  │  ├─ Quiz.ts
│  │  │  │  │  ├─ QuizAttempt.ts
│  │  │  │  │  ├─ QuizAttemptAnswer.ts
│  │  │  │  │  ├─ QuizOption.ts
│  │  │  │  │  ├─ QuizQuestion.ts
│  │  │  │  │  ├─ RealLifeScenario.ts
│  │  │  │  │  ├─ ReflectionEntry.ts
│  │  │  │  │  ├─ RefreshToken.ts
│  │  │  │  │  ├─ Report.ts
│  │  │  │  │  ├─ ScenarioFramework.ts
│  │  │  │  │  ├─ ScenarioPerspective.ts
│  │  │  │  │  ├─ ScenarioResponse.ts
│  │  │  │  │  ├─ ShortLesson.ts
│  │  │  │  │  ├─ ShortLessonComment.ts
│  │  │  │  │  ├─ ShortLessonResponse.ts
│  │  │  │  │  ├─ StoryChoice.ts
│  │  │  │  │  ├─ StoryConsequence.ts
│  │  │  │  │  ├─ StoryDecision.ts
│  │  │  │  │  ├─ StoryLearnCard.ts
│  │  │  │  │  ├─ StoryLearnCardTag.ts
│  │  │  │  │  ├─ StoryScenario.ts
│  │  │  │  │  ├─ StorySession.ts
│  │  │  │  │  ├─ Topic.ts
│  │  │  │  │  ├─ TopicPerspective.ts
│  │  │  │  │  ├─ User.ts
│  │  │  │  │  ├─ UserBadge.ts
│  │  │  │  │  ├─ UserProgress.ts
│  │  │  │  │  └─ UserSession.ts
│  │  │  │  └─ models.ts
│  │  │  ├─ migrations
│  │  │  │  ├─ 20260526121229_init
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260530162132_add_composite_indexes
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260531002209_add_user_streak_fields
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260531060000_optimize_list_queries
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260531130000_story_learn_card_analysis_tab_philosophy_tag
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260601100000_add_user_soft_delete
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260601110000_add_password_reset
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260601120000_add_minigame_topic_and_updated_at
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260601120000_add_topic_perspective
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260601130000_add_scenario_perspectives_frameworks
│  │  │  │  │  └─ migration.sql
│  │  │  │  ├─ 20260617000000_add_quiz_question_explanation
│  │  │  │  │  └─ migration.sql
│  │  │  │  └─ migration_lock.toml
│  │  │  └─ schema.prisma
│  │  ├─ routes
│  │  │  ├─ activity.routes.ts
│  │  │  ├─ ai-character.route.ts
│  │  │  ├─ ai-chat.routes.ts
│  │  │  ├─ ai.routes.ts
│  │  │  ├─ analysis-tab.routes.ts
│  │  │  ├─ api.ts
│  │  │  ├─ auth.routes.ts
│  │  │  ├─ badge.routes.ts
│  │  │  ├─ bookmark.routes.ts
│  │  │  ├─ chapter.routes.ts
│  │  │  ├─ choice.routes.ts
│  │  │  ├─ critical-question.routes.ts
│  │  │  ├─ debate.routes.ts
│  │  │  ├─ health.ts
│  │  │  ├─ learning.routes.ts
│  │  │  ├─ lesson.routes.ts
│  │  │  ├─ mindmap.routes.ts
│  │  │  ├─ minigame.routes.ts
│  │  │  ├─ moderation.routes.ts
│  │  │  ├─ notification.routes.ts
│  │  │  ├─ philosophy-tag.routes.ts
│  │  │  ├─ profile.routes.ts
│  │  │  ├─ progress.routes.ts
│  │  │  ├─ quiz.routes.ts
│  │  │  ├─ reflection.routes.ts
│  │  │  ├─ scenario.routes.ts
│  │  │  ├─ short-lesson.routes.ts
│  │  │  ├─ stats.routes.ts
│  │  │  ├─ stories.routes.ts
│  │  │  ├─ story-learn-card.routes.ts
│  │  │  ├─ story-session.routes.ts
│  │  │  ├─ topic-perspective.routes.ts
│  │  │  └─ topics.routes.ts
│  │  ├─ seed
│  │  │  ├─ 00-users.ts
│  │  │  ├─ 01-topics.ts
│  │  │  ├─ 02-short-lessons.ts
│  │  │  ├─ 03-lessons.ts
│  │  │  ├─ 04-quizzes.ts
│  │  │  ├─ 05-stories.ts
│  │  │  ├─ 06-ai-characters.ts
│  │  │  ├─ 07-scenarios.ts
│  │  │  ├─ 08-debates.ts
│  │  │  ├─ 09-critical-questions.ts
│  │  │  ├─ 10-badges.ts
│  │  │  ├─ 11-minigames.ts
│  │  │  ├─ 11-topic-perspectives.ts
│  │  │  ├─ 12-mindmaps.ts
│  │  │  ├─ 13-chapter-01.ts
│  │  │  ├─ data
│  │  │  │  ├─ ai-characters.ts
│  │  │  │  ├─ critical-questions.ts
│  │  │  │  ├─ debates.ts
│  │  │  │  ├─ minigames.ts
│  │  │  │  ├─ real-life-scenarios.ts
│  │  │  │  ├─ story-scenarios.ts
│  │  │  │  └─ topic-perspectives.ts
│  │  │  ├─ index.ts
│  │  │  ├─ reset.ts
│  │  │  ├─ seed-stories-test.ts
│  │  │  └─ utils
│  │  │     ├─ csv-reader.ts
│  │  │     ├─ index.ts
│  │  │     └─ logger.ts
│  │  ├─ services
│  │  │  ├─ activity-log.service.ts
│  │  │  ├─ ai-character.service.ts
│  │  │  ├─ ai-chat-prompt.ts
│  │  │  ├─ ai-chat.service.ts
│  │  │  ├─ ai.service.ts
│  │  │  ├─ analysis-tab.service.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ badge.service.ts
│  │  │  ├─ bookmark.service.ts
│  │  │  ├─ chapter-content.service.ts
│  │  │  ├─ consequence.service.ts
│  │  │  ├─ critical-question.service.ts
│  │  │  ├─ csv-content-reader.service.ts
│  │  │  ├─ debate.service.ts
│  │  │  ├─ mindmap.service.ts
│  │  │  ├─ minigame.service.ts
│  │  │  ├─ moderation.service.ts
│  │  │  ├─ notification.service.ts
│  │  │  ├─ philosophy-tag.service.ts
│  │  │  ├─ progress.service.ts
│  │  │  ├─ prompt-builder.service.ts
│  │  │  ├─ quiz.service.ts
│  │  │  ├─ redis.service.ts
│  │  │  ├─ reflection.service.ts
│  │  │  ├─ scenario.service.ts
│  │  │  ├─ story-learn-card.service.ts
│  │  │  ├─ story-session.service.ts
│  │  │  ├─ story.service.ts
│  │  │  └─ topic-perspective.service.ts
│  │  ├─ types
│  │  │  ├─ activity.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ interactive.ts
│  │  │  ├─ learning.ts
│  │  │  └─ story.ts
│  │  ├─ utils
│  │  │  ├─ cache-key.ts
│  │  │  ├─ email.ts
│  │  │  ├─ jwt.ts
│  │  │  └─ response.ts
│  │  └─ validators
│  │     ├─ activity.validator.ts
│  │     ├─ ai-character.validator.ts
│  │     ├─ ai-chat.validator.ts
│  │     ├─ ai.validator.ts
│  │     ├─ analysis-tab.validator.ts
│  │     ├─ auth.validator.ts
│  │     ├─ bookmark.validator.ts
│  │     ├─ choice.validator.ts
│  │     ├─ critical-question.validator.ts
│  │     ├─ debate.validator.ts
│  │     ├─ lesson.validator.ts
│  │     ├─ mindmap.validator.ts
│  │     ├─ minigame.validator.ts
│  │     ├─ notification.validator.ts
│  │     ├─ philosophy-tag.validator.ts
│  │     ├─ progress.validator.ts
│  │     ├─ quiz.validator.ts
│  │     ├─ reflection.validator.ts
│  │     ├─ scenario.validator.ts
│  │     ├─ short-lesson.validator.ts
│  │     ├─ story-learn-card.validator.ts
│  │     ├─ story-session.validator.ts
│  │     ├─ story.validator.ts
│  │     ├─ topic-perspective.validator.ts
│  │     └─ topic.validator.ts
│  └─ tsconfig.json
├─ stories
│  ├─ 1-10-quiz-api-attempt-answer-complete-score.md
│  ├─ 1-16-badge-definition-auto-award-engine.md
│  ├─ 1-17-activity-logging-service-streak-tracking.md
│  ├─ 1-18-content-moderation-report-action-auto-flag.md
│  ├─ 1-6-topic-crud-api-list-get-create-update-search-filter.md
│  ├─ 1-7-lesson-crud-api-list-by-topic-detail-with-questions.md
│  ├─ 1-8-short-lesson-api-list-get-respond-comment.md
│  ├─ 1-9-user-progress-api-upsert-stats-by-topic.md
│  ├─ 10-1-backend-unit-tests-auth-service.md
│  ├─ 10-2-backend-unit-tests-story-quiz-services.md
│  ├─ 10-3-api-integration-tests-supertest-auth-crud-errors.md
│  ├─ 10-4-frontend-component-tests-rtl-card-quiz-chat.md
│  ├─ 10-5-e2e-smoke-test-maestro-login-home-story-complete.md
│  ├─ 11-3-terms-of-service-privacy-policy-screens-markdown-render.md
│  ├─ 2-10-explore-screen-topic-grid-search-category-filter.md
│  ├─ 2-11-full-lesson-screen-markdown-render-concept-highlight.md
│  ├─ 2-12-short-lesson-swipe-cards-hook-insight-conflict-vote.md
│  ├─ 2-13-quiz-gameplay-screen-questions-timer-result.md
│  ├─ 2-16-profile-screen-stats-grid-badge-gallery-activity-graph.md
│  ├─ 2-4-login-screen-ui-email-pass-validation-loading.md
│  ├─ 2-6-secure-token-storage-expo-secure-store-web-fallback.md
│  ├─ 2-7-rtk-query-api-layer-basequery-reauth-token-persistence.md
│  ├─ 2-8-auth-redux-toolkit-slice-redux-persist-login-register-logout-checkauth.md
│  ├─ 2-9-home-screen-daily-hook-continue-learning-stats.md
│  ├─ 3-10-seed-10-debates-20-critical-questions-10-badges.md
│  ├─ 3-11-seed-5-minigames-matching-guess-who-logic.md
│  ├─ 3-12-seed-topicperspective-data-5-perspectives-x-10-topics.md
│  ├─ 3-4-shared-types-ai-chat-scenario-debate.md
│  ├─ 3-5-seed-10-topics-30-short-lessons.md
│  ├─ 3-6-seed-20-full-lessons-40-quiz-questions.md
│  ├─ 3-7-seed-5-story-scenarios-13-step-complete.md
│  ├─ 3-8-seed-5-ai-characters-prompts-bios.md
│  ├─ 3-9-seed-10-real-life-scenarios-4-perspectives-each.md
│  ├─ 4-10-step-3-dilemma-screen-dramatic-presentation.md
│  ├─ 4-11-step-4-choose-screen-choice-cards-philosophy-tags-reasoning.md
│  ├─ 4-12-step-5-consequence-screen-narrative-4-analysis-tabs.md
│  ├─ 4-13-step-6-knowledge-screen-history-community-stats-concepts.md
│  ├─ 4-14-step-7-reflect-screen-journal-completion.md
│  ├─ 4-15-stepprogress-component-shared-across-all-7-steps.md
│  ├─ 4-16-story-flow-integration-test-end-to-end-7-steps.md
│  ├─ 4-2-story-scenario-api-list-with-filters-detail-with-learn-cards.md
│  ├─ 4-3-story-session-api-start-decide-complete.md
│  ├─ 4-4-consequence-analysis-api-get-by-choice-4-categories.md
│  ├─ 4-5-community-stats-aggregation-per-choice-cache.md
│  ├─ 4-6-story-list-screen-cards-filters-replay-indicator.md
│  ├─ 4-7-story-rtk-query-service-redux-slice.md
│  ├─ 4-8-step-1-intro-screen-cinematic-character-briefing.md
│  ├─ 4-9-step-2-learn-screen-swipeable-cards-concept-chips.md
│  ├─ 5-1-gemini-api-service-generate-stream-rate-limit.md
│  ├─ 5-10-ai-chat-integration-test-full-conversation-flow.md
│  ├─ 5-2-ai-character-crud-prompt-template-system.md
│  ├─ 5-3-ai-chat-session-message-api.md
│  ├─ 5-4-sse-streaming-endpoint.md
│  ├─ 5-5-ai-chat-rtk-query-service-redux-slice.md
│  ├─ 5-6-character-gallery-screen-cards-session-list.md
│  ├─ 5-7-chat-conversation-screen-bubbles-streaming-text.md
│  ├─ 5-8-chatinput-component-text-send-suggested-prompts.md
│  ├─ 5-9-streamingtext-component-character-by-character-render.md
│  ├─ 6-1-schema-migration-scenarioperspective-scenarioframework.md
│  ├─ 6-2-real-life-scenario-api-crud-perspectives-respond-stats.md
│  ├─ 6-3-scenario-situation-perspectives-screens.md
│  ├─ 6-4-scenario-framework-rethink-screens.md
│  ├─ 6-5-debate-crud-argument-vote-comment-api.md
│  ├─ 6-6-debate-list-detail-screens-split-for-against-view.md
│  ├─ 6-7-debate-argue-screen-stance-editor-preview.md
│  ├─ 6-8-scenario-debate-integration-tests.md
│  ├─ 7-1-badge-gallery-earn-notifications-frontend.md
│  ├─ 7-2-notification-bell-list-screen.md
│  ├─ 7-3-reflection-journal-screens-list-new-detail.md
│  ├─ 7-4-mindmap-visualization-svg-zoom-pan.md
│  ├─ 7-5-bookmark-system-button-list-screen.md
│  ├─ 7-6-performance-optimization-caching-lazy-load-bundle-audit.md
│  ├─ 8-1-topicperspective-api-crud-5-perspectives-per-topic.md
│  ├─ 8-2-multi-perspective-viewer-screen-tabs-swipe-per-perspective.md
│  ├─ 8-3-minigame-crud-api-admin-create-user-play-score-tracking.md
│  ├─ 8-4-minigame-play-screen-3-game-types-score-animation.md
│  └─ 8-5-minigame-result-leaderboard-component.md
├─ tools
│  ├─ enrich-feature-output-contracts.mjs
│  └─ sync-sprint-status-from-github.mjs
├─ tsconfig.base.json
├─ tsconfig.json
├─ vercel.json
└─ webapp
   ├─ LICENSE
   ├─ README.md
   ├─ app.config.js
   ├─ app.json
   ├─ assets
   │  ├─ expo.icon
   │  │  ├─ Assets
   │  │  │  ├─ expo-symbol 2.svg
   │  │  │  └─ grid.png
   │  │  └─ icon.json
   │  └─ images
   │     ├─ android-icon-background.png
   │     ├─ android-icon-foreground.png
   │     ├─ android-icon-monochrome.png
   │     ├─ expo-badge-white.png
   │     ├─ expo-badge.png
   │     ├─ expo-logo.png
   │     ├─ favicon.png
   │     ├─ icon.png
   │     ├─ logo-glow.png
   │     ├─ map_bg_dorm.png
   │     ├─ map_bg_garden.png
   │     ├─ map_bg_lab.png
   │     ├─ map_bg_office.png
   │     ├─ map_bg_paris.png
   │     ├─ onboarding.png
   │     ├─ philo-logo.png
   │     ├─ react-logo.png
   │     ├─ react-logo@2x.png
   │     ├─ react-logo@3x.png
   │     ├─ splash-icon.png
   │     ├─ tabIcons
   │     │  ├─ explore.png
   │     │  ├─ explore@2x.png
   │     │  ├─ explore@3x.png
   │     │  ├─ home.png
   │     │  ├─ home@2x.png
   │     │  └─ home@3x.png
   │     └─ tutorial-web.png
   ├─ eas.json
   ├─ eslint.config.mjs
   ├─ expo-env.d.ts
   ├─ jest.config.js
   ├─ jest.setup.js
   ├─ jest.styleMock.js
   ├─ metro.config.js
   ├─ nativewind-env.d.ts
   ├─ package.json
   ├─ postcss.config.mjs
   ├─ scripts
   │  ├─ reset-project.js
   │  └─ validate-eas-config.js
   ├─ src
   │  ├─ __tests__
   │  │  ├─ components.test.tsx
   │  │  ├─ scenario-debate-integration.test.ts
   │  │  └─ story-flow-integration.test.ts
   │  ├─ app
   │  │  ├─ (auth)
   │  │  │  ├─ _layout.tsx
   │  │  │  ├─ forgot-password.tsx
   │  │  │  ├─ login.tsx
   │  │  │  ├─ register.tsx
   │  │  │  ├─ reset-password.tsx
   │  │  │  └─ verify-otp.tsx
   │  │  ├─ (lesson)
   │  │  │  ├─ flashcard.tsx
   │  │  │  ├─ full-lesson.tsx
   │  │  │  ├─ quiz
   │  │  │  │  └─ [lessonId].tsx
   │  │  │  ├─ short-lesson.tsx
   │  │  │  └─ trial-of-socrates.tsx
   │  │  ├─ (tabs)
   │  │  │  ├─ _layout.tsx
   │  │  │  ├─ chat.tsx
   │  │  │  ├─ debate.tsx
   │  │  │  ├─ explore.tsx
   │  │  │  ├─ index.tsx
   │  │  │  ├─ learn.tsx
   │  │  │  ├─ legal
   │  │  │  │  ├─ __tests__
   │  │  │  │  │  └─ legal.test.tsx
   │  │  │  │  ├─ privacy.tsx
   │  │  │  │  └─ terms.tsx
   │  │  │  ├─ profile.tsx
   │  │  │  └─ story.tsx
   │  │  ├─ _layout.tsx
   │  │  ├─ auth-callback.tsx
   │  │  ├─ badges.tsx
   │  │  ├─ bookmarks.tsx
   │  │  ├─ chapter
   │  │  │  └─ [chapter]
   │  │  │     └─ [muc].tsx
   │  │  ├─ chat
   │  │  │  ├─ [id].tsx
   │  │  │  └─ index.tsx
   │  │  ├─ concept-comparison.tsx
   │  │  ├─ debates
   │  │  │  ├─ [id].tsx
   │  │  │  ├─ argue.tsx
   │  │  │  └─ result.tsx
   │  │  ├─ delete-account.tsx
   │  │  ├─ explore.tsx
   │  │  ├─ index.tsx
   │  │  ├─ mindmap.tsx
   │  │  ├─ minigames
   │  │  │  └─ [id].tsx
   │  │  ├─ minigames.tsx
   │  │  ├─ notifications.tsx
   │  │  ├─ onboarding.tsx
   │  │  ├─ profile.tsx
   │  │  ├─ scenarios
   │  │  │  ├─ [id].tsx
   │  │  │  └─ rethink.tsx
   │  │  ├─ settings.tsx
   │  │  ├─ story
   │  │  │  ├─ [id]
   │  │  │  │  ├─ argument-result.tsx
   │  │  │  │  ├─ build-argument.tsx
   │  │  │  │  ├─ choose.tsx
   │  │  │  │  ├─ cinematic.tsx
   │  │  │  │  ├─ complete.tsx
   │  │  │  │  ├─ consequence.tsx
   │  │  │  │  ├─ dilemma.tsx
   │  │  │  │  ├─ encounter.tsx
   │  │  │  │  ├─ evidence-board.tsx
   │  │  │  │  ├─ index.tsx
   │  │  │  │  ├─ knowledge.tsx
   │  │  │  │  ├─ learn.tsx
   │  │  │  │  ├─ map.tsx
   │  │  │  │  ├─ minigame.tsx
   │  │  │  │  ├─ quiz.tsx
   │  │  │  │  ├─ reflect.tsx
   │  │  │  │  ├─ role-intro.tsx
   │  │  │  │  └─ role-selection.tsx
   │  │  │  └─ index.tsx
   │  │  ├─ study-plan.tsx
   │  │  ├─ topic-lessons.tsx
   │  │  └─ topic-perspectives.tsx
   │  ├─ assets
   │  ├─ components
   │  │  ├─ animated-icon.module.css
   │  │  ├─ animated-icon.tsx
   │  │  ├─ animated-icon.web.tsx
   │  │  ├─ app-header.tsx
   │  │  ├─ app-tabs.tsx
   │  │  ├─ bookmark-button.tsx
   │  │  ├─ chapter-lesson
   │  │  │  ├─ ChapterLessonUI.tsx
   │  │  │  └─ steps
   │  │  │     ├─ DebateStep.tsx
   │  │  │     ├─ HookStep.tsx
   │  │  │     ├─ QuizStep.tsx
   │  │  │     └─ TheoryStep.tsx
   │  │  ├─ external-link.tsx
   │  │  ├─ hint-row.tsx
   │  │  ├─ markdown-renderer.tsx
   │  │  ├─ minigame-result.tsx
   │  │  ├─ notification-bell.tsx
   │  │  ├─ progress
   │  │  │  ├─ ProgressBadge.tsx
   │  │  │  ├─ ProgressRing.tsx
   │  │  │  ├─ StatusBadge.tsx
   │  │  │  ├─ index.ts
   │  │  │  └─ progress-theme.ts
   │  │  ├─ story
   │  │  │  └─ StepProgress.tsx
   │  │  ├─ themed-text.tsx
   │  │  ├─ themed-view.tsx
   │  │  ├─ ui
   │  │  │  ├─ Avatar.tsx
   │  │  │  ├─ Badge.tsx
   │  │  │  ├─ Button.tsx
   │  │  │  ├─ Card.tsx
   │  │  │  ├─ Input.tsx
   │  │  │  ├─ TabIcon.tsx
   │  │  │  ├─ collapsible.tsx
   │  │  │  └─ index.ts
   │  │  └─ web-badge.tsx
   │  ├─ constants
   │  │  ├─ chapterLesson.ts
   │  │  └─ theme.ts
   │  ├─ features
   │  │  ├─ chapter
   │  │  │  └─ progress.ts
   │  │  ├─ lesson
   │  │  │  ├─ full
   │  │  │  │  ├─ ConceptModal.tsx
   │  │  │  │  ├─ FullLessonContent.tsx
   │  │  │  │  ├─ data.ts
   │  │  │  │  └─ ui.ts
   │  │  │  ├─ short
   │  │  │  │  ├─ ConceptChip.tsx
   │  │  │  │  ├─ FinishedActions.tsx
   │  │  │  │  ├─ LessonSwipeCard.tsx
   │  │  │  │  ├─ ProgressBar.tsx
   │  │  │  │  ├─ ShortLessonHeader.tsx
   │  │  │  │  ├─ StateScaffold.tsx
   │  │  │  │  ├─ VoteCard.tsx
   │  │  │  │  ├─ VoteResult.tsx
   │  │  │  │  ├─ data.ts
   │  │  │  │  └─ ui.ts
   │  │  │  └─ story
   │  │  │     └─ trial
   │  │  │        ├─ LessonTopBar.tsx
   │  │  │        ├─ data.ts
   │  │  │        ├─ steps
   │  │  │        │  ├─ CharacterSelection.tsx
   │  │  │        │  ├─ ConsequenceResult.tsx
   │  │  │        │  ├─ DecisionSelection.tsx
   │  │  │        │  ├─ LessonExplanation.tsx
   │  │  │        │  ├─ RoleplaySituation.tsx
   │  │  │        │  └─ ScenarioContext.tsx
   │  │  │        └─ ui.tsx
   │  │  ├─ quiz
   │  │  │  ├─ AnswerOption.tsx
   │  │  │  ├─ Explanation.tsx
   │  │  │  ├─ QuestionCard.tsx
   │  │  │  ├─ QuestionProgress.tsx
   │  │  │  ├─ QuizCard.tsx
   │  │  │  ├─ QuizFilters.tsx
   │  │  │  ├─ QuizHeader.tsx
   │  │  │  ├─ QuizListEmpty.tsx
   │  │  │  ├─ QuizListStats.tsx
   │  │  │  ├─ QuizResultView.tsx
   │  │  │  ├─ QuizSearchBox.tsx
   │  │  │  ├─ QuizState.tsx
   │  │  │  ├─ SubmitAction.tsx
   │  │  │  ├─ mock.ts
   │  │  │  ├─ types.ts
   │  │  │  ├─ ui.ts
   │  │  │  └─ utils.ts
   │  │  └─ story
   │  │     ├─ encounterData.ts
   │  │     ├─ mapData.ts
   │  │     ├─ minigameData.ts
   │  │     └─ rolesData.ts
   │  ├─ global.css
   │  ├─ hooks
   │  │  ├─ use-color-scheme.ts
   │  │  ├─ use-color-scheme.web.ts
   │  │  └─ use-theme.ts
   │  ├─ lib
   │  │  ├─ i18n.ts
   │  │  ├─ onboarding-state.ts
   │  │  └─ utils.ts
   │  ├─ locales
   │  │  ├─ en.json
   │  │  └─ vi.json
   │  ├─ navigation
   │  │  └─ AuthBootstrap.tsx
   │  ├─ screen
   │  │  ├─ auth
   │  │  │  ├─ LoginScreen.tsx
   │  │  │  └─ RegisterScreen.tsx
   │  │  ├─ chapter
   │  │  │  ├─ ChapterLessonFlowScreen.tsx
   │  │  │  └─ ChapterSkillTreeScreen.tsx
   │  │  ├─ debate
   │  │  │  ├─ DebateListScreen.tsx
   │  │  │  └─ DebateResultScreen.tsx
   │  │  ├─ explore
   │  │  │  └─ ExploreScreen.tsx
   │  │  ├─ home
   │  │  │  └─ HomeScreen.tsx
   │  │  ├─ lesson
   │  │  │  ├─ FlashcardScreen.tsx
   │  │  │  ├─ LearnHomeScreen.tsx
   │  │  │  ├─ TopicLessonsScreen.tsx
   │  │  │  ├─ full
   │  │  │  │  └─ FullLessonScreen.tsx
   │  │  │  ├─ short
   │  │  │  │  └─ ShortLessonScreen.tsx
   │  │  │  └─ story
   │  │  │     └─ TrialOfSocratesScreen.tsx
   │  │  ├─ mindmap
   │  │  │  └─ ConceptComparisonScreen.tsx
   │  │  ├─ onboarding
   │  │  │  └─ OnboardingScreen.tsx
   │  │  ├─ profile
   │  │  │  └─ ProfileScreen.tsx
   │  │  ├─ quiz
   │  │  │  ├─ QuizGameplayScreen.tsx
   │  │  │  └─ QuizListScreen.tsx
   │  │  └─ study
   │  │     └─ StudyPlanScreen.tsx
   │  ├─ services
   │  │  ├─ aiChat.service.ts
   │  │  ├─ api.ts
   │  │  ├─ auth
   │  │  │  ├─ api.ts
   │  │  │  └─ tokenStorage.ts
   │  │  ├─ auth.service.ts
   │  │  ├─ bookmark.service.ts
   │  │  ├─ mindmap.service.ts
   │  │  ├─ minigame.service.ts
   │  │  ├─ reflection.service.ts
   │  │  ├─ rtk-api
   │  │  │  ├─ badge.api.ts
   │  │  │  ├─ baseApi.ts
   │  │  │  ├─ baseQueryWithReauth.ts
   │  │  │  ├─ bookmark.api.ts
   │  │  │  ├─ chapter.api.ts
   │  │  │  ├─ chatApi.ts
   │  │  │  ├─ debate.api.ts
   │  │  │  ├─ learning.api.ts
   │  │  │  ├─ lesson.api.ts
   │  │  │  ├─ mindmap.api.ts
   │  │  │  ├─ minigame.api.ts
   │  │  │  ├─ notification.api.ts
   │  │  │  ├─ profile.api.ts
   │  │  │  ├─ quiz.api.ts
   │  │  │  ├─ reflection.api.ts
   │  │  │  ├─ scenario.api.ts
   │  │  │  ├─ shortLesson.api.ts
   │  │  │  ├─ story.api.ts
   │  │  │  └─ topic.api.ts
   │  │  └─ story.service.ts
   │  ├─ stores
   │  │  ├─ auth.helpers.ts
   │  │  ├─ bookmark.store.ts
   │  │  ├─ hooks.ts
   │  │  ├─ index.ts
   │  │  ├─ mindmap.store.ts
   │  │  ├─ minigame.store.ts
   │  │  ├─ persistStorage.ts
   │  │  ├─ reflection.store.ts
   │  │  ├─ slices
   │  │  │  ├─ auth.slice.ts
   │  │  │  ├─ badge.slice.ts
   │  │  │  ├─ bookmark.slice.ts
   │  │  │  ├─ chat.slice.ts
   │  │  │  ├─ debate.slice.ts
   │  │  │  ├─ mindmap.slice.ts
   │  │  │  ├─ minigame.slice.ts
   │  │  │  ├─ notification.slice.ts
   │  │  │  ├─ reflection.slice.ts
   │  │  │  ├─ scenario.slice.ts
   │  │  │  ├─ settings.slice.ts
   │  │  │  └─ story.slice.ts
   │  │  └─ story.store.ts
   │  ├─ tw
   │  │  ├─ image.tsx
   │  │  └─ index.tsx
   │  ├─ types
   │  │  ├─ auth.ts
   │  │  ├─ bookmark.ts
   │  │  ├─ chapterLesson.ts
   │  │  ├─ css.d.ts
   │  │  ├─ learning.ts
   │  │  ├─ mindmap.ts
   │  │  ├─ minigame.ts
   │  │  ├─ reflection.ts
   │  │  └─ story.ts
   │  └─ utils
   │     └─ performance.ts
   └─ tsconfig.json

```

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Installation

```bash
# Install all dependencies from root
npm install
```

### Development

```bash
# Start backend (Express.js)
npm run backend:dev

# Start frontend (Expo)
npm run frontend:dev

# Start for specific platform
npm run frontend:ios
npm run frontend:android
npm run frontend:web

# Build shared package
npm run shared:build
```

### Using TailwindCSS in Frontend

Import CSS-wrapped components from `@/tw`:

```tsx
import { View, Text, ScrollView } from "@/tw";
import { Image } from "@/tw/image";
import { cn } from "@/lib/utils";

export default function MyScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className={cn("p-4 gap-4", isSpecial && "bg-primary")}>
        <Text className="text-xl font-bold text-gray-900">Hello TailwindCSS!</Text>
      </View>
    </ScrollView>
  );
}
```

## Scripts Reference

| Script                     | Description                   |
| -------------------------- | ----------------------------- |
| `npm run backend:dev`      | Start backend with hot reload |
| `npm run backend:build`    | Build backend TypeScript      |
| `npm run frontend:dev`     | Start Expo dev server         |
| `npm run frontend:ios`     | Start on iOS simulator        |
| `npm run frontend:android` | Start on Android emulator     |
| `npm run frontend:web`     | Start web version             |
| `npm run shared:build`     | Build shared package          |
| `npm run clean`            | Remove all node_modules       |

## API Deployment

The production API image uses a multi-stage Docker build and is configured for
Fly.io. See [Fly.io API Deployment](docs/fly-deployment.md) for secret injection,
deployment, migration, and health-check commands.

See [EAS Build and OTA Updates](docs/eas-build.md) for signed iOS and Android
preview/production builds and OTA release channels.
