# PhiloMind — Implementation Specification

> **Mục đích:** Hướng dẫn kỹ thuật chi tiết để triển khai Phase 0-2 (Foundation → Story Mode)
> **Dành cho:** Developer / AI coding agent

---

## 1. Phase 0: Foundation — Technical Spec

### 1.1 JWT Authentication

#### Register Endpoint
```
POST /api/v1/auth/register
Body: { email, password, displayName }
Response: { user: { id, email, displayName }, tokens: { access, refresh } }
```

**Implementation:**
1. Validate input (Zod: email format, password min 8 chars)
2. Check duplicate email
3. Hash password (bcrypt, 12 rounds)
4. Create User record
5. Generate JWT pair (access: 15min, refresh: 7d)
6. Store refresh token hash in `Session` table
7. Return user + tokens

#### Login Endpoint
```
POST /api/v1/auth/login
Body: { email, password }
Response: { user, tokens }
```

#### Token Refresh
```
POST /api/v1/auth/refresh
Body: { refreshToken }
Response: { tokens: { access, refresh } }
```
- Verify refresh token
- Check Session status = ACTIVE
- Rotate: issue new pair, revoke old

#### Auth Middleware
```typescript
// middlewares/auth.middleware.ts
export const authGuard = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED' } });
  
  const payload = jwt.verify(token, JWT_SECRET);
  req.user = await prisma.user.findUnique({ where: { id: payload.sub } });
  next();
};
```

### 1.2 API Client (Frontend)

```typescript
// webapp/src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL + '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      await SecureStore.setItemAsync('accessToken', data.tokens.access);
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 1.3 Auth Store (Zustand)

```typescript
// webapp/src/stores/useAuthStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
```

---

## 2. Phase 2: Story Mode Engine — Technical Spec

### 2.1 Schema Additions

```prisma
model StoryLearnCard {
  id          String        @id @default(uuid())
  scenarioId  String
  scenario    StoryScenario @relation(fields: [scenarioId], references: [id])
  order       Int
  title       String
  icon        String        @default("📖")
  content     String        // Markdown
  conceptTerm       String?
  conceptDefinition String?
  createdAt   DateTime      @default(now())
}

model AnalysisTab {
  id             String           @id @default(uuid())
  consequenceId  String
  consequence    StoryConsequence @relation(fields: [consequenceId], references: [id])
  category       AnalysisCategory
  title          String
  content        String           // Markdown
  conceptTerm       String?
  conceptDefinition String?
  relatedFigures    String[]      @default([])
  order          Int
}

enum AnalysisCategory {
  ETHICS
  POLITICS
  PHILOSOPHY
  HISTORY
}
```

### 2.2 Story API Endpoints

#### Get Story with Full Content
```
GET /api/v1/stories/:id
Response: {
  scenario: StoryScenario,
  learnCards: StoryLearnCard[],
  choices: StoryChoice[],
}
```

#### Start Session
```
POST /api/v1/stories/:id/sessions
Response: { session: { id, status: 'IN_PROGRESS', startedAt } }
```

#### Submit Decision
```
POST /api/v1/stories/sessions/:sid/decide
Body: { choiceId, reasoning, timeSpentSeconds }
Response: {
  decision: StoryDecision,
  consequence: {
    narrative: string,
    analyses: AnalysisTab[],
  },
  communityStats: { choiceId: string, percentage: number }[]
}
```

### 2.3 Frontend Screen Flow

```typescript
// Story navigation flow
const storyFlow = {
  entry: '/story',                        // List
  intro: '/story/[id]',                   // INTRO screen
  learn: '/story/learn/[id]',             // LEARN cards
  play:  '/story/play/[sessionId]',       // DILEMMA + CHOOSE
  result:'/story/result/[sessionId]',     // CONSEQUENCE + KNOWLEDGE
  reflect:'/story/reflect/[sessionId]',   // REFLECT
};
```

### 2.4 Story Store

```typescript
// stores/useStoryStore.ts
interface StoryState {
  currentScenario: StoryScenario | null;
  currentSession: StorySession | null;
  learnCards: StoryLearnCard[];
  choices: StoryChoice[];
  selectedChoice: StoryChoice | null;
  reasoning: string;
  consequence: StoryConsequence | null;
  communityStats: CommunityStats[];
  
  loadScenario: (id: string) => Promise<void>;
  startSession: (scenarioId: string) => Promise<void>;
  submitDecision: (choiceId: string, reasoning: string) => Promise<void>;
  completeSession: () => Promise<void>;
}
```

---

## 3. Shared Types (libs/shared)

```typescript
// libs/shared/src/types/auth.ts
export interface RegisterDTO {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: { id: string; email: string; displayName: string; role: UserRole; };
  tokens: { access: string; refresh: string; };
}

// libs/shared/src/types/story.ts
export interface StoryScenarioDTO {
  id: string;
  title: string;
  description: string;
  historicalPeriod: string;
  characterName: string;
  characterBio: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  coverImageUrl: string;
  topicId: string;
}

// libs/shared/src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: any; };
  meta?: { page: number; limit: number; total: number; };
}
```

---

## 4. Data Seeding (Phase 0)

```typescript
// services/src/prisma/seeds/topics.ts
const topics = [
  { title: 'Tự do', description: 'Tự do là gì?', slug: 'tu-do', icon: '🕊️' },
  { title: 'Đạo đức', description: 'Đúng hay sai?', slug: 'dao-duc', icon: '⚖️' },
  { title: 'Hạnh phúc', description: 'Hạnh phúc thực sự', slug: 'hanh-phuc', icon: '😊' },
  { title: 'Công bằng', description: 'Xã hội công bằng', slug: 'cong-bang', icon: '🏛️' },
  { title: 'AI & Đạo đức', description: 'Công nghệ và đạo đức', slug: 'ai-dao-duc', icon: '🤖' },
  // ... 10 topics total
];
```

---

## 5. Development Checklist — Phase 0

- [ ] `services/src/utils/jwt.ts` — JWT sign/verify helpers
- [ ] `services/src/utils/response.ts` — Standardized response
- [ ] `services/src/middlewares/auth.middleware.ts` — JWT guard
- [ ] `services/src/middlewares/validate.middleware.ts` — Zod validation
- [ ] `services/src/services/auth.service.ts` — Auth business logic
- [ ] `services/src/controllers/auth.controller.ts` — Auth endpoints
- [ ] `services/src/routes/auth.routes.ts` — Auth routes
- [ ] `services/src/services/topic.service.ts` — Topic CRUD
- [ ] `services/src/controllers/topic.controller.ts` — Topic endpoints
- [ ] `services/src/routes/topic.routes.ts` — Topic routes
- [ ] `libs/shared/src/types/auth.ts` — Auth DTOs
- [ ] `libs/shared/src/types/api.ts` — Response format
- [ ] `webapp/src/services/api.ts` — Axios client
- [ ] `webapp/src/stores/useAuthStore.ts` — Auth state
- [ ] `webapp/src/app/(auth)/login.tsx` — Login screen
- [ ] `webapp/src/app/(auth)/register.tsx` — Register screen
- [ ] `webapp/src/app/(tabs)/_layout.tsx` — 5-tab navigation
