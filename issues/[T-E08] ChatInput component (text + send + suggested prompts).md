# T-E08: ChatInput component (text + send + suggested prompts)

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị             |
| ----------------- | ------------------- |
| GitHub issue      | #90                 |
| Track             | E: AI & Chat System |
| Nhóm              | E-Frontend          |
| Loại việc         | frontend            |
| Priority          | medium              |
| Owner gợi ý       | Backend+AI Dev      |
| Assignee hiện tại | @NguyenDat204        |
| Estimate          | 2h                  |
| Milestone         | Week 6              |
| Dependencies      | `T-E07`             |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/ai/chat/[sessionId]` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua RTK Query API slice + Redux Toolkit store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Click character card mở hoặc tạo chat session rồi điều hướng tới conversation screen.
- Nút gửi message disabled khi input rỗng/loading; streaming text phải append dần và auto-scroll xuống tin nhắn mới nhất.

### UI/navigation contract đề xuất

| Tình huống    | Người dùng thao tác                                      | Kết quả bắt buộc                                                                |
| ------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Mở màn hình   | User vào `/ai/chat/[sessionId]` từ tab/card/link phù hợp | Render màn hình chính của ChatInput component (text + send + suggested prompts) |
| Chọn nhân vật | Bấm character card                                       | Tạo/mở session và điều hướng `/ai/chat/[sessionId]`                             |
| Gửi tin nhắn  | Nhập prompt -> bấm send                                  | Disable input khi gửi, stream response và auto-scroll                           |

## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-E07`.
- User mở màn hình qua route `/ai/chat/[sessionId]`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #90.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/ai/chat/[sessionId]` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] First-message suggestions: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] loading indicator: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **ChatInput component (text + send + suggested prompts)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: First-message suggestions, loading indicator.

## 8. Kiểm chứng bắt buộc

- [ ] Chạy lint/typecheck/test phù hợp với package bị thay đổi.
- [ ] Ghi rõ command đã chạy và kết quả trong PR.
- [ ] Kiểm tra không commit secret, file `.env` thật hoặc artifact local.
- [ ] Nếu thay đổi contract dùng chung, cập nhật consumer hoặc ghi rõ follow-up dependency.
- [ ] Với API: ghi sample request/response thực tế hoặc test assertion tương đương.
- [ ] Với UI: ghi route, thao tác click/chạm, màn hình mở ra và trạng thái sau thao tác.

## 9. Definition of Done

- [ ] Code/config đã commit trên branch riêng và mở PR liên kết issue này.
- [ ] PR mô tả phạm vi thay đổi, cách kiểm chứng và rủi ro còn lại.
- [ ] CI xanh hoặc PR ghi rõ blocker có thể tái hiện.
- [ ] Không còn TODO thuộc trực tiếp scope issue này.
- [ ] Nếu thay đổi contract dùng chung, đã cập nhật consumer hoặc tạo follow-up issue rõ ràng.

## 10. Ghi chú triển khai

- Tech stack: Express 5 + Prisma 7 + PostgreSQL cho backend; Expo 56 + React Native + Expo Router + Redux Toolkit + Redux Persist cho frontend.
- API base chuẩn: `/api/v1`.
- Response chuẩn: `{ success, data, meta? }` hoặc `{ success: false, error: { code, message, details? } }`.
- Tài liệu tham chiếu: `docs/project-context.md`, `docs/architecture.md`, `docs/task-breakdown.md`.

---

_Updated by BMAD PM requirements pass on 2026-05-31. Nội dung này thay thế mô tả task ngắn trước đó bằng requirement cụ thể hơn cho dev/review._

## 11. UI Specification — "Dark Scholar" Design System

> **Stitch Screen**: `43204fb1f55d4c7cb0b59b0ebc848668` — "ChatInput Component States"
> **Project**: `16360193101983963529` | **Design System**: `PhiloMind Dark Scholar`

### 11.1 Component States (5 total)

#### State 1: Gợi ý ban đầu (Initial Suggestions)

```
┌─────────────────────────────────────┐
│ [Triết lý đạo đức?] [Plato vs      │  Suggested prompt chips
│  Aristotle] [Ý nghĩa cuộc sống]    │
├─────────────────────────────────────┤
│ [  Nhập câu hỏi...            ] [○]│  Input empty, send disabled
└─────────────────────────────────────┘
```

- **Chips**: `#18181B` bg, `1px #27272A` border, Be Vietnam Pro 13px `#E4E4E7`
- **Chip on tap**: `1px #D97706` border (text fills input)
- **Send button**: `#27272A` bg (disabled), circular
- **Input**: empty, placeholder `#A1A1AA`

#### State 2: Đang nhập (Typing)

```
┌─────────────────────────────────────┐
│ [  Thầy có thể giải thích... ] [➤] │  Input focused, send active
└─────────────────────────────────────┘
```

- **Input border**: `#D97706` (focused amber)
- **Text**: Be Vietnam Pro 15px `#E4E4E7`
- **Send button**: `#D97706` bg, dark arrow icon `#0C0C0E`
- **Suggested chips**: hidden (disappear when typing)

#### State 3: Đang gửi (Submitting)

```
┌─────────────────────────────────────┐
│                  Đang suy nghĩ...   │  Loading label
│ [  Thầy có thể giải thích... ] [●●●]│  Input disabled, spinner
└─────────────────────────────────────┘
```

- **Loading label**: Be Vietnam Pro 12px `#A1A1AA`
- **Input**: disabled, text grayed out (`#A1A1AA`)
- **Send button replaced by**: 3 pulsing dots in `#D97706`
- **Dot animation**: `pulse 1.4s ease-in-out infinite` with staggered delay

#### State 4: Streaming (AI Responding)

```
┌─────────────────────────────────────┐
│ ● Socrates đang trả lời...         │  Amber indicator bar
│ [  Nhập câu hỏi...            ] [○]│  Input disabled, dimmed
└─────────────────────────────────────┘
```

- **Indicator**: `#D97706` blinking dot + Be Vietnam Pro 12px `#D97706`
- **Input**: disabled, slightly dimmed (`opacity: 0.5`)
- **Send button**: `#27272A` bg (disabled)

#### State 5: Lỗi (Error)

```
┌─────────────────────────────────────┐
│ [  Thầy có thể giải thích... ] [➤] │  Input with red border
│ Không thể gửi tin nhắn. Thử lại.   │  Error text
│                          [Thử lại]  │  Ghost retry button
└─────────────────────────────────────┘
```

- **Input border**: `#ffb4ab` (error red)
- **Error text**: Be Vietnam Pro 12px `#ffb4ab`
- **Retry button**: Ghost — `#27272A` border, `#E4E4E7` text, `0.25rem` radius

### 11.2 Component Dimensions

| Property          | Value                          |
| ----------------- | ------------------------------ |
| Input height      | 44px                           |
| Input padding     | 12px horizontal, 10px vertical |
| Send button       | 40px circle                    |
| Chip height       | 32px                           |
| Chip padding      | 8px 12px                       |
| Bottom safe area  | 34px (iOS notch)               |
| Container padding | 16px horizontal                |

### 11.3 Design Tokens

| Token                  | Value     | Usage                     |
| ---------------------- | --------- | ------------------------- |
| `input-bg`             | `#18181B` | Input field background    |
| `input-border-default` | `#27272A` | Default border            |
| `input-border-focus`   | `#D97706` | Focused border            |
| `input-border-error`   | `#ffb4ab` | Error state border        |
| `input-text`           | `#E4E4E7` | Input text                |
| `input-placeholder`    | `#A1A1AA` | Placeholder text          |
| `send-active`          | `#D97706` | Active send button bg     |
| `send-disabled`        | `#27272A` | Disabled send button bg   |
| `send-icon`            | `#0C0C0E` | Arrow icon on active send |

### 11.4 Design Rules (MANDATORY)

- ❌ **NO** gradients, glows, or shadows
- ✅ Focus feedback via **border color shift** only
- ✅ Disabled states use **opacity** or **color shift**, not blur
- ✅ Chips use **border highlight** on tap, not bg color change
- ✅ Error state clearly distinct from default with `#ffb4ab`

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.
