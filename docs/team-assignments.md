# PhiloMind — Team Assignments

> **Cập nhật:** 2026-05-29 | **Thành viên:** 11 | **Tổng tasks:** 111

## Nguyên tắc phân công

1. **Theo flow** — Mỗi người làm task liên tiếp trong cùng domain (BE→FE cùng feature)
2. **Giảm context switch** — Không giao task rời rạc thuộc nhiều module khác nhau
3. **Ownership rõ ràng** — Mỗi người "sở hữu" 1-2 module từ đầu đến cuối
4. **Cân bằng workload** — ~10 tasks/người (±2)

---

## Tổng quan phân công

| # | Thành viên | Vai trò | Tasks | Số lượng | Domain |
|---|-----------|---------|-------|----------|--------|
| 1 | **khovan** | Tech Lead / DevOps | T-I01→I07, T-A19→A22 | 11 | Infra, CI/CD, Optimization |
| 2 | **Nguyễn Tuấn Anh** | Backend Lead | T-A01→A05, T-A16→A18 | 8 | Auth, Badge, Activity, Moderation |
| 3 | **Trần Văn Linh** | Backend Dev | T-A06→A10 , T-A11→A15 | 10 | Content APIs, Advanced APIs |
| 4 | **Thu Hà** | Frontend Lead | T-B01→B08 | 8 | Design System, Auth UI, API Client |
| 5 | **Anh Thư** | Frontend Dev | T-B09→B16 | 8 | Home, Explore, Lesson, Profile |
| 6 | **Hoàng Nguyễn** | Shared/Seed | T-C01→C12 | 12 | Types, All Seed Data |
| 7 | **Khánh Linh** (`dklinh05`) ✅ | Fullstack (Story) | T-D01→D16 | 16 | Story Mode BE + FE trọn bộ |
| 8 | **Vinh Nguyễn** | Fullstack (AI) | T-E01→E10 | 10 | AI Chat BE + FE trọn bộ |
| 9 | **Ngọc Lê** | Fullstack (Scenario) | T-F01→F08, T-H01→H02 | 10 | Scenario, Debate, Multi-perspective |
| 10 | **Duy Khang** | Fullstack (Game/Polish) | T-H03→H05, T-G01→G06 | 9 | MiniGame, Gamification, Polish |
| 11 | **Nguyễn Tiến Đạt** | QA / Settings | T-J01→J05, T-K01→K04 | 9 | Testing, Admin, Settings |

---

## Chi tiết từng thành viên

### 1. khovan (Tech Lead / DevOps) — 11 tasks

**Flow:** Infra setup → Optimization → CI/CD → Deploy

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W1 | T-I01, T-I02 | Docker Compose + Env validation |
| W5 | T-A19, T-A20, T-A21 | DB indexes, Redis cache, gzip |
| W5 | T-A22 | Seed runner script |
| W7 | T-I03, T-I04 | Migration CI, GitHub Actions |
| W8 | T-I05, T-I06, T-I07 | EAS Build, API deploy, Prod DB |

**Lý do:** Lead cần setup hạ tầng trước (W1) để team có môi trường dev. Sau đó optimize + deploy cuối sprint.

---

### 2. Nguyễn Tuấn Anh (Backend Lead) — 8 tasks

**Flow:** Auth foundation → Platform services

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W1 | T-A01, T-A02, T-A03 | Response util, Validation MW, JWT Auth |
| W1 | T-A04, T-A05 | Auth middleware, Auth routes |
| W4 | T-A16, T-A17, T-A18 | Badge engine, Activity log, Moderation |

**Lý do:** Auth là nền tảng — cần 1 người senior làm xuyên suốt. Platform APIs (badge, activity, moderation) cùng pattern "hook vào user action" nên giao luôn.

---

### 3. Trần Văn Linh (Backend Dev) — 10 tasks

**Flow:** Content CRUD APIs → Advanced APIs (cùng pattern)

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W2 | T-A06, T-A07, T-A08 | Topic, Lesson, Short Lesson API |
| W3 | T-A09, T-A10 | Progress API, Quiz API |
| W4 | T-A11, T-A12, T-A13 | Reflection, Critical Question, Mindmap |
| W5 | T-A14, T-A15 | Bookmark, Notification API |

**Lý do:** Tất cả đều là CRUD APIs theo cùng pattern (Prisma + validate + paginate). Làm liên tục không cần đọc lại context.

---

### 4. Thu Hà (Frontend Lead) — 8 tasks

**Flow:** Design system → Common components → Auth screens → API client

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W1 | T-B01, T-B02 | Design tokens, Common UI components |
| W1 | T-B03 | Tab navigation layout |
| W2 | T-B04, T-B05 | Login screen, Register screen |
| W2 | T-B06, T-B07, T-B08 | Secure storage, API client, Auth store |

**Lý do:** Foundation → Auth UI là flow tự nhiên. Thu Hà "sở hữu" design system nên mọi component primitive đều đi qua cô ấy.

---

### 5. Anh Thư (Frontend Dev) — 8 tasks

**Flow:** Main screens (dùng components Thu Hà tạo)

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W3 | T-B09, T-B10 | Home screen, Explore screen |
| W3 | T-B11, T-B12 | Full Lesson screen, Short Lesson cards |
| W4 | T-B13 | Quiz gameplay screen |
| W4 | T-B14, T-B15 | Onboarding flow, Progress components |
| W5 | T-B16 | Profile screen |

**Lý do:** Tất cả là main screens dùng chung UI primitives. Flow tự nhiên: Home → Explore → Lesson → Quiz → Profile.

---

### 6. Hoàng Nguyễn (Shared/Seed) — 12 tasks

**Flow:** Types trước → Seed data theo module

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W1 | T-C01, T-C02, T-C03, T-C04 | Shared types (Auth, Topic, Story, AI) |
| W2 | T-C05, T-C06 | Topic + Short Lesson seed, Full Lesson + Quiz seed |
| W3 | T-C07, T-C08, T-C09 | Story scenarios, AI Characters, Real-life Scenarios |
| W3 | T-C10, T-C11, T-C12 | Debates + Badges, MiniGames, Perspectives |

**Lý do:** Types phải xong W1 (SP-1 sync point). Seed data theo thứ tự module giúp backend dev test ngay.

---

### 7. Khánh Linh (Fullstack — Story Mode) — 16 tasks

**Flow:** Schema → Backend APIs → Frontend screens (7-step journey)

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W3 | T-D01, T-D02, T-D03 | Schema migration, Story API, Session API |
| W4 | T-D04, T-D05 | Consequence API, Community stats |
| W5 | T-D06, T-D07 | Story list screen, Store setup |
| W5 | T-D08, T-D09, T-D10 | INTRO, LEARN, DILEMMA screens |
| W6 | T-D11, T-D12, T-D13 | CHOOSE, CONSEQUENCE, KNOWLEDGE screens |
| W7 | T-D14, T-D15, T-D16 | REFLECT, StepProgress, Integration test |

**Lý do:** Story Mode là module phức tạp nhất (7 steps). 1 người làm trọn bộ BE→FE đảm bảo hiểu toàn bộ data flow.

---

### 8. Vinh Nguyễn (Fullstack — AI Chat) — 10 tasks

**Flow:** Gemini integration → Chat APIs → Chat UI

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W4 | T-E01, T-E02 | Gemini API service, AI Character CRUD |
| W4 | T-E03, T-E04 | Chat session API, SSE streaming |
| W6 | T-E05, T-E06 | Chat service + store, Character gallery |
| W6 | T-E07, T-E08 | Chat conversation screen, ChatInput |
| W7 | T-E09, T-E10 | StreamingText component, Integration test |

**Lý do:** AI/streaming là domain chuyên biệt. 1 người làm từ Gemini API → SSE → streaming UI giữ context liên tục.

---

### 9. Ngọc Lê (Fullstack — Scenario & Debate) — 10 tasks

**Flow:** Scenario BE→FE → Debate BE→FE → Multi-perspective

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W5 | T-F01, T-F02 | Scenario schema, Scenario API |
| W5 | T-H01, T-H02 | TopicPerspective API, Perspective viewer |
| W6 | T-F03, T-F04 | Scenario screens (Situation, Framework) |
| W7 | T-F05, T-F06 | Debate API, Debate screens |
| W7 | T-F07, T-F08 | Argue screen, Integration tests |

**Lý do:** Scenario + Debate + Multi-perspective cùng pattern "multiple viewpoints". Gom lại 1 người hiểu sâu domain.

---

### 10. Duy Khang (Fullstack — Game & Polish) — 9 tasks

**Flow:** MiniGame module → Gamification polish

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W6 | T-H03, T-H04, T-H05 | MiniGame API, Play screen, Leaderboard |
| W6 | T-G01, T-G02 | Badge gallery, Notification bell |
| W7 | T-G03, T-G04 | Reflection journal, Mindmap visualization |
| W7 | T-G05, T-G06 | Bookmark system, Performance optimization |

**Lý do:** MiniGame → Gamification polish là flow tự nhiên. Cả hai đều focus vào "engagement features".

---

### 11. Nguyễn Tiến Đạt (QA / Settings) — 9 tasks

**Flow:** Backend tests → Frontend tests → E2E → Settings/Admin

| Tuần | Tasks | Mô tả |
|------|-------|-------|
| W6 | T-J01, T-J02 | Unit tests: Auth, Story + Quiz |
| W7 | T-J03, T-J04 | API integration tests, Component tests |
| W7 | T-J05 | E2E smoke test (Maestro) |
| W7 | T-K01, T-K02 | Settings screen, Forgot password |
| W7 | T-K03, T-K04 | ToS/Privacy, Delete account |

**Lý do:** QA cần đợi APIs stable (W6+). Settings/Admin là screens độc lập, phù hợp giao cùng QA.

---

## Timeline theo thành viên

```
         W1          W2          W3          W4          W5          W6          W7          W8
khovan   ██ I01-I02                          ██ A19-A22              ██ I03-I07
TuấnAnh  ██ A01-A05              ██ A16-A18
VănLinh              ██ A06-A08  ██ A09-A13  ██ A14-A15
Thu Hà   ██ B01-B03  ██ B04-B08
Anh Thư              ██ B09-B12  ██ B13-B16
Hoàng    ██ C01-C04  ██ C05-C06  ██ C07-C12
KhánhLinh                       ██ D01-D05  ██ D06-D10  ██ D11-D13  ██ D14-D16
Vinh                             ██ E01-E04              ██ E05-E10
Ngọc Lê                                     ██ F01-H02  ██ F03-F04  ██ F05-F08
DuyKhang                                                 ██ H03-G02  ██ G03-G06
TiếnĐạt                                                 ██ J01-J02  ██ J03-K04
```

---

## Sync Points & Handoffs

| Sync | Người sản xuất | Người tiêu thụ | Khi nào |
|------|---------------|----------------|---------|
| SP-1 | Hoàng (T-C01) | Tuấn Anh, Thu Hà | Cuối W1 |
| SP-2 | Tuấn Anh (T-A03) | Thu Hà (T-B05) | Cuối W1 |
| SP-3 | Văn Linh (T-A06) | Anh Thư (T-B10) | Cuối W2 |
| SP-4 | Văn Linh (T-A10) | Khánh Linh (T-D05) | Cuối W3 |
| SP-5 | Hoàng (T-C05) | Khánh Linh (T-D01) | Đầu W2 |
| SP-6 | Tuấn Anh (T-A03) | Vinh (T-E01) | Cuối W1 |
| SP-7 | Hoàng (T-C07) | Ngọc Lê (T-F01) | Cuối W2 |
| SP-8 | khovan (T-I01) | Tuấn Anh, Văn Linh | Đầu W1 |
| SP-9 | Văn Linh (all A) | Tiến Đạt (T-J01) | Cuối W5 |
| SP-10 | Anh Thư (T-B16) | Tiến Đạt (T-K01) | Cuối W5 |

---

## Quy tắc làm việc

1. **Daily standup:** Mỗi người update status task đang làm trên sprint-status.yaml
2. **PR convention:** `feat/T-A01-response-util` — prefix theo task ID
3. **Review:** Cùng track review chéo (BE↔BE, FE↔FE)
4. **Blocked?** Tag người sản xuất sync point trên Slack/Discord
5. **Done = merged** — Task chỉ DONE khi PR merged vào `develop`
