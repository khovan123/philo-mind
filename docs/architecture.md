# Architecture

This document describes the active PhiloMind architecture after the cleanup of deprecated feature areas.

## Modules

Active backend and frontend modules:

- Auth, profile, password reset, settings, and account deletion.
- Learning home, progress, streaks, and activity logs.
- Topics, lessons, short lessons, chapters, skill tree, and story learning.
- Quizzes, critical questions, answer explanations, attempts, and results.
- Mini games with scoring and leaderboard/result data.
- Bookmarks, notifications, badges, achievements, and moderation.
- Search over retained lessons, videos, quizzes, topics, and questions.

Removed modules are not part of the active architecture: AI chat, chat characters, real-life scenarios, debates, and standalone argument flows.

## Backend

The API lives in `services/src` and is mounted under `/api/v1`.

Active route groups:

| Area | Base path |
| --- | --- |
| Auth | `/auth` |
| Profile | `/profile` |
| Topics | `/topics` |
| Topic perspectives | `/topics/:topicId/perspectives` |
| Lessons | `/lessons` |
| Short lessons | `/short-lessons` |
| Stories | `/stories` |
| Story sessions | `/story-sessions` |
| Story learn cards | `/stories/:storyId/learn-cards` |
| Story choices | `/choices` |
| Consequence analysis tabs | `/consequences/:consequenceId/tabs` |
| Philosophy tags | `/philosophy-tags` |
| Quizzes | `/quizzes` |
| Critical questions | `/critical-questions` |
| Progress and learning home | `/progress`, `/learning` |
| Mini games | `/minigames` |
| Mindmaps | `/mindmaps` |
| Bookmarks | `/bookmarks` |
| Notifications and badges | `/notifications`, `/badges` |
| Activity and moderation | `/activities`, `/moderation` |
| Chapters and movies | `/chapters`, `/movies` |
| Search and stats | `/search`, `/stats` |

## Database

Prisma schema: `services/src/prisma/schema.prisma`.

Active domain tables cover users/sessions/tokens, topics, lessons, short lessons, story mode, quizzes, critical questions, reflections, mini games, mindmaps, progress, badges, bookmarks, notifications, activity logs, reports/moderation, password resets, chapters, chapter nodes, movies, and movie sessions.

The cleanup migration `20260720011524_remove_unused` removes deprecated AI chat, character, real-life scenario, debate, and argument tables/enums from development databases.

## Frontend

The web app uses Expo Router under `webapp/src/app`, Redux Toolkit under `webapp/src/stores`, and RTK Query clients under `webapp/src/services/rtk-api`.

Reachable retained journeys:

- Auth, reset password, profile, settings, and account deletion.
- Home and learning tabs.
- Explore and topic/lesson discovery.
- Chapter learning, Skill Tree, Story Mode, short lessons, and full lessons.
- Quiz gameplay and results.
- Mini games and result/leaderboard screens.
- Bookmarks, notifications, badges, achievements, and progress.
