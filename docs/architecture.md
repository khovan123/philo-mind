# PhiloMind — Architecture Document

> **Cập nhật:** 2026-05-28 | **Phiên bản:** 1.0

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        MOBILE APP                           │
│                     (Expo 56 + RN)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Auth     │  │ Story    │  │ Scenario │  │ AI Chat  │   │
│  │ Screens  │  │ Engine   │  │ Engine   │  │ UI       │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └──────────────┴──────────────┴──────────────┘        │
│                        RTK Query API Layer                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS/REST
┌──────────────────────────┴──────────────────────────────────┐
│                      BACKEND API                            │
│                    (Express 5 + TS)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Auth     │  │ Story    │  │ Scenario │  │ AI Chat  │   │
│  │ Controller│ │ Controller│ │ Controller│ │ Controller│   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │              │         │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐   │
│  │ Auth     │  │ Story    │  │ Scenario │  │ AI Chat  │   │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       └──────────────┴──────────────┴──────┬─────┘          │
│                                            │                │
│  ┌─────────────────────────────────────────┴──────────────┐ │
│  │                   Prisma ORM                           │ │
│  └────────────────────────┬───────────────────────────────┘ │
└───────────────────────────┼─────────────────────────────────┘
                            │
              ┌─────────────┴──────────────┐
              │       PostgreSQL           │
              │    (35+ tables)            │
              └────────────────────────────┘
                            │
              ┌─────────────┴──────────────┐
              │     Google Gemini API      │
              │   (AI Character Chat)      │
              └────────────────────────────┘
```

---

## 2. Backend Architecture (Controller → Service → Repository)

### Layer Responsibilities

```
Request → Middleware → Controller → Service → Prisma → Response
              │
        ┌─────┴─────┐
        │ Auth Guard │
        │ Validator  │
        │ Rate Limit │
        └────────────┘
```

| Layer | Trách nhiệm |
|-------|-------------|
| **Middleware** | Auth (JWT verify), validation (zod), rate limiting |
| **Controller** | Parse request, call service, format response |
| **Service** | Business logic, orchestration, AI integration |
| **Prisma** | Database queries, transactions |

### File Structure

```
services/src/
├── controllers/
│   ├── auth.controller.ts
│   ├── topic.controller.ts
│   ├── lesson.controller.ts
│   ├── story.controller.ts
│   ├── scenario.controller.ts
│   └── ai-chat.controller.ts
├── services/
│   ├── auth.service.ts
│   ├── topic.service.ts
│   ├── story.service.ts
│   ├── scenario.service.ts
│   └── ai-chat.service.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── validate.middleware.ts
│   └── rate-limit.middleware.ts
├── routes/
│   ├── index.ts           # Route aggregator
│   ├── auth.routes.ts
│   ├── topic.routes.ts
│   ├── story.routes.ts
│   └── scenario.routes.ts
├── utils/
│   ├── jwt.ts
│   ├── response.ts        # Standardized responses
│   └── gemini.ts          # AI client wrapper
└── prisma/
    └── schema.prisma
```

---

## 3. API Design

### Base URL: `/api/v1/`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Đăng ký |
| POST | `/auth/login` | Đăng nhập → access + refresh tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Revoke refresh token |

### Stories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stories` | Danh sách kịch bản (filter: topic, difficulty) |
| GET | `/stories/:id` | Chi tiết kịch bản + learn cards + choices |
| POST | `/stories/:id/sessions` | Bắt đầu phiên chơi mới |
| POST | `/stories/sessions/:sid/decide` | Ghi nhận quyết định + reasoning |
| GET | `/stories/sessions/:sid/result` | Lấy consequence + analysis |
| PATCH | `/stories/sessions/:sid/complete` | Đánh dấu hoàn thành |

### Scenarios
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/scenarios` | Danh sách tình huống |
| GET | `/scenarios/:id` | Chi tiết + perspectives + framework |
| POST | `/scenarios/:id/respond` | Ghi nhận lập trường ban đầu |
| PATCH | `/scenarios/:id/rethink` | Ghi nhận suy nghĩ lại |

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 50 }
}
```
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token expired"
  }
}
```

---

## 4. Frontend Architecture

### State Management: Redux Toolkit + RTK Query + Redux Persist

```text
store/
├── index.ts              # configureStore + persistStore
├── root-reducer.ts       # combined slices + RTK Query reducers
├── hooks.ts              # typed useAppDispatch/useAppSelector
├── slices/
│   ├── authSlice.ts      # user/session UI state
│   ├── storySlice.ts     # active story UI state
│   └── appSlice.ts       # global app preferences
└── api/
    ├── baseApi.ts        # fetchBaseQuery + reauth + cache tags
    ├── authApi.ts
    ├── storyApi.ts
    └── scenarioApi.ts
```

### API Layer

```typescript
// services/baseApi.ts
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Topic', 'Story', 'Scenario', 'AIChat'],
  endpoints: () => ({}),
});

export const persistedReducer = persistReducer(
  { key: 'root', storage, whitelist: ['auth'] },
  rootReducer,
);
```

---

## 5. AI Integration (Gemini)

### AI Character Chat Flow

```
User Message → Backend API → Prompt Builder → Gemini API → Filter → Store → Return
```

### Prompt Template
```
System: You are {character.name}, {character.bio}.
Your worldview: {character.worldview}
Topic: {topic.title}
Rules: {character.promptInstruction}
- Stay in character
- Use Socratic questioning
- Challenge assumptions
- Reference historical context
```

### Streaming: Server-Sent Events (SSE)
- Endpoint: `GET /ai-chat/sessions/:id/stream`
- Backend streams Gemini response chunks to client

---

## 6. Security

| Concern | Solution |
|---------|---------|
| Authentication | JWT (15min access + 7d refresh) |
| Password | bcrypt hash |
| Input validation | Zod schemas on all endpoints |
| Rate limiting | express-rate-limit (100 req/min) |
| CORS | Whitelist mobile app origins |
| SQL Injection | Prisma parameterized queries |
| AI Safety | Content filter on Gemini responses |
