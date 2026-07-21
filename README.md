# PhiloMind

PhiloMind is a philosophy learning workspace with an Express backend, shared TypeScript contracts, and an Expo/React Native web app.

## Current Product Scope

The maintained product modules are:

- Learning home: streaks, points, daily hook, continue-learning cards, and progress statistics.
- Content discovery: search and filters for topics, lessons, chapters, and questions.
- Lesson flows: quiz lessons plus Chapter, Skill Tree, and Story Mode learning.
- Quiz and practice: question lists, filters, timed/scored gameplay, answer explanations, and results.
- Mini games: concept matching, philosopher guessing, and argument sorting with scoring/results.
- Bookmarks and notifications: saved lessons/topics/stories/mini games, notifications, badges, and achievements.
- Account and profile: registration, login, forgot/reset password with OTP, settings, password changes, account deletion, profile, and progress.

Deprecated modules have been removed from the active codebase: AI chat and chat characters, real-life scenarios, debates, and standalone argument flows.

## Workspace Layout

```text
libs/shared/     Shared types and Zod validators
services/        Express API, Prisma schema, seed scripts, backend tests
webapp/          Expo Router app, Redux stores, API clients, frontend tests
data/            Seed input for retained learning content
docs/            Operational and architecture notes
```

## Commands

Run commands from the repository root unless noted otherwise.

```bash
npm run shared:build
npm run backend:build
npm run seed
npm run test
```

Frontend type-check:

```bash
cd webapp
npx tsc --noEmit
```

Local development:

```bash
npm run start:dev
npm run backend:dev
npm run frontend:web
```

## Database

The Prisma schema is at `services/src/prisma/schema.prisma`. The active schema contains only retained learning, quiz, story, chapter/movie, mini-game, bookmark, notification, badge, activity, moderation, auth, profile, and password-reset models.

Development migrations live in `services/src/prisma/migrations`. The migration `20260720011524_remove_unused` drops the removed AI chat, character, real-life scenario, debate, and argument tables/enums.

## Seed Data

`npm run seed` runs `services/src/seed/index.ts` and seeds retained content in dependency order:

- users, topics, badges
- short lessons, lessons, critical questions, topic perspectives, stories, mini games, mindmaps
- quizzes
- canonical Chapter 1 content and chapter movies

Chapter JSON files under `data/chapter-01/` now use `criticalQuestions` for retained open-ended practice prompts.
