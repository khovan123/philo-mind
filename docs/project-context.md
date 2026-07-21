# Project Context

PhiloMind is a philosophy learning app for Vietnamese learners. The current product focuses on guided learning, story-based practice, quizzes, mini games, bookmarks, notifications, achievements, and profile/progress management.

## Retained Scope

- Learning home: streak, points, daily hook, unfinished lessons, and progress stats.
- Discovery: search and filters for topics, lessons, chapters, and questions.
- Learning flows: Chapter, Skill Tree, Story Mode, short lesson, and full lesson.
- Quiz and practice: question list, timer/scoring, explanations, attempts, and results.
- Mini games: concept matching, philosopher guessing, and argument sorting.
- Bookmark and notification system with badges and achievements.
- Account/profile: auth, OTP reset, settings, password changes, account deletion, profile, and progress.

## Removed Scope

The following areas are deprecated and removed from active source, schema, seed data, and current docs:

- AI chat sessions/messages.
- Chat character/persona systems.
- Real-life scenario flows.
- Debate, argument, vote, and comment flows.

Historical issue files and migrations may still mention these modules as archival records.

## Repository Layout

```text
libs/shared/     Shared TypeScript types and validators
services/        Express API, Prisma schema, seed scripts, tests
webapp/          Expo Router application
data/            Seed input for retained learning content
docs/            Current docs plus archival planning records
```

## Runtime Stack

- Backend: Express, Prisma, PostgreSQL, Redis optional cache, Jest.
- Frontend: Expo Router, React Native, Redux Toolkit, RTK Query.
- Shared: TypeScript and Zod contracts.

Gemini embeddings may be used by retained search when configured, but no AI chat product surface is active.
