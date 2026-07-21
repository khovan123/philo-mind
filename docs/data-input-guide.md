# Data Input Guide

This guide covers active seed inputs only. Do not add seed files for AI chat, chat characters, real-life scenarios, debates, or standalone argument flows.

## Active Seed Inputs

| Area | Source |
| --- | --- |
| Topics | `data/01-topics.csv` |
| Short lessons | `data/02-short-lessons.csv` |
| Full lessons | `data/03-full-lessons/*.md` |
| Quizzes | `data/04-quizzes.csv` |
| Story Mode | `data/05-stories/*.md` |
| Critical questions | `data/09-critical-questions.csv` and `data/chapter-01/*.json` |
| Badges | `data/10-badges.csv` |
| Mini games | `data/11-minigames/*.md` |
| Mindmaps | `data/12-mindmaps/*.md` |
| Chapter 1 canonical content | `data/chapter-01/*.json` plus `flashcards.json` |

## Chapter JSON Contract

Each section file under `data/chapter-01/` uses this shape:

```json
{
  "order": 1,
  "code": "I.1",
  "topic": {
    "title": "Khái lược về Triết học",
    "slug": "khai-luoc-ve-triet-hoc",
    "category": "Chương 1",
    "difficulty": "EASY",
    "description": "..."
  },
  "lesson": {
    "title": "...",
    "hook": "...",
    "body": "...",
    "examples": ["..."]
  },
  "quiz": [
    {
      "type": "SINGLE_CHOICE",
      "prompt": "...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 1,
      "explanation": "..."
    }
  ],
  "criticalQuestions": ["..."]
}
```

## Seed Command

```bash
npm run seed
```

The seed runner is idempotent and should only write retained domain data.
