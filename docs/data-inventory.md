# Data Inventory

This inventory lists retained data domains after the cleanup.

## Retained Data Sets

| Domain | Storage | Seed source |
| --- | --- | --- |
| Users | `users`, sessions, refresh tokens, password resets | `services/src/seed/00-users.ts` |
| Topics | `topics` | `data/01-topics.csv`, `data/chapter-01/*.json` |
| Lessons | `lessons`, `lesson_questions`, `lesson_answers` | `data/02-short-lessons.csv`, `data/03-full-lessons/*.md`, chapter JSON |
| Story Mode | `story_scenarios`, choices, consequences, sessions, learn cards, analysis tabs, tags | `data/05-stories/*.md`, `services/src/seed/05-stories.ts` |
| Quizzes | quizzes, questions, options, attempts, answers | `data/04-quizzes.csv`, chapter JSON |
| Critical questions and reflections | `critical_questions`, `reflection_entries` | `data/09-critical-questions.csv`, chapter JSON |
| Topic perspectives | `topic_perspectives` | `data/13-perspectives.csv`, `services/src/seed/data/topic-perspectives.ts` |
| Mini games | `mini_games`, `mini_game_attempts` | `data/11-minigames/*.md`, `data/chapter-01/flashcards.json` |
| Mindmaps | `mindmap_nodes`, `mindmap_edges` | `data/12-mindmaps/*.md` |
| Engagement | progress, activity logs, badges, bookmarks, notifications, moderation reports | seed scripts and runtime user activity |
| Chapters and movies | `chapters`, `chapter_nodes`, `movies`, `movie_sessions` | `data/chapter-01/*.json`, `services/src/seed/14-chapter-movies.ts` |

## Removed Data Sets

Seed data and schema for these areas are no longer maintained:

- AI chat characters, sessions, and messages.
- Real-life scenarios, scenario perspectives, frameworks, and responses.
- Debates, debate arguments, votes, and comments.

Historical migrations and issue archives may still mention the removed tables.
