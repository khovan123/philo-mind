# T-E07: Chat conversation screen (bubbles + streaming text)

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị             |
| ----------------- | ------------------- |
| GitHub issue      | #89                 |
| Track             | E: AI & Chat System |
| Nhóm              | E-Frontend          |
| Loại việc         | frontend            |
| Priority          | medium              |
| Owner gợi ý       | Backend+AI Dev      |
| Assignee hiện tại | @NguyenDat204       |
| Estimate          | 6h                  |
| Milestone         | Week 6              |
| Dependencies      | `T-E05`             |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/ai/chat/[sessionId]` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua RTK Query API slice + Redux Toolkit store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Click character card mở hoặc tạo chat session rồi điều hướng tới conversation screen.
- Nút gửi message disabled khi input rỗng/loading; streaming text phải append dần và auto-scroll xuống tin nhắn mới nhất.

### UI/navigation contract đề xuất

| Tình huống    | Người dùng thao tác                                      | Kết quả bắt buộc                                                              |
| ------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Mở màn hình   | User vào `/ai/chat/[sessionId]` từ tab/card/link phù hợp | Render màn hình chính của Chat conversation screen (bubbles + streaming text) |
| Chọn nhân vật | Bấm character card                                       | Tạo/mở session và điều hướng `/ai/chat/[sessionId]`                           |
| Gửi tin nhắn  | Nhập prompt -> bấm send                                  | Disable input khi gửi, stream response và auto-scroll                         |

## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-E05`.
- User mở màn hình qua route `/ai/chat/[sessionId]`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #89.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/ai/chat/[sessionId]` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] Left/right bubbles: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] progressive text: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] auto-scroll: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Chat conversation screen (bubbles + streaming text)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Left/right bubbles, progressive text, auto-scroll.

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

> **Stitch Screen**: `8076ad2fae0f45bda49ea35f41fbb9ff` — "Trò chuyện với Socrates"
> **Project**: `16360193101983963529` | **Design System**: `PhiloMind Dark Scholar`

### 11.1 Screen Layout (Mobile 390px)

```
┌─────────────────────────────────────┐
│ ← ○ Socrates                   ⋮   │  TopBar: avatar + name + subtitle
│   Triết gia Hy Lạp cổ đại          │
├─────────────────────────────────────┤
│                                     │
│  ○ ┌──────────────────────┐         │  AI message (LEFT)
│    │ Xin chào! Ta là      │         │
│    │ Socrates...           │         │
│    └──────────────────────┘         │
│                       10:30         │
│                                     │
│         ┌──────────────────┐        │  User message (RIGHT)
│         │ Thầy Socrates... │        │
│         └──────────────────┘        │
│                       10:31         │
│                                     │
│  ○ ┌──────────────────────┐         │  AI message
│    │ Một câu hỏi tuyệt   │         │
│    │ vời! Ta tin rằng...  │         │
│    └──────────────────────┘         │
│                       10:32         │
│                                     │
│  ○ ┌──────────────────────┐         │  AI STREAMING message
│    │ Thú vị lắm!...      │         │
│    │ tự do▌               │         │  ← blinking amber cursor
│    └──────────────────────┘         │
├─────────────────────────────────────┤
│ [  Nhập câu hỏi...          ] [➤]  │  ChatInput bar (fixed bottom)
└─────────────────────────────────────┘
```

### 11.2 Design Tokens

| Token            | Value     | Usage                                            |
| ---------------- | --------- | ------------------------------------------------ |
| `background`     | `#0C0C0E` | Screen background                                |
| `surface`        | `#18181B` | AI bubble bg, input bg, top bar                  |
| `border`         | `#27272A` | AI bubble border, input border                   |
| `text-primary`   | `#E4E4E7` | Message text, character name                     |
| `text-secondary` | `#A1A1AA` | Timestamps, subtitle, placeholder                |
| `accent`         | `#D97706` | User bubble bg, send button, avatar ring, cursor |
| `accent-on`      | `#0C0C0E` | Text on user bubble, icon on send button         |
| `error`          | `#ffb4ab` | Error state text                                 |

### 11.3 Component Specifications

#### Top Bar

- **Background**: `#18181B` (tonal layer 1)
- **Avatar**: 36px circle with `2px #D97706` ring
- **Name**: Outfit 18px semibold `#E4E4E7`
- **Subtitle**: Be Vietnam Pro 12px `#A1A1AA`
- **Overflow icon**: 3 dots, `#A1A1AA`

#### AI Message Bubble (LEFT-ALIGNED)

- **Background**: `#18181B`
- **Border**: `1px solid #27272A`
- **Radius**: `0.5rem` (top-left: `0.125rem` for first message)
- **Text**: Be Vietnam Pro 15px `#E4E4E7`
- **Avatar**: Small 24px amber-ringed circle beside bubble
- **Timestamp**: Be Vietnam Pro 12px `#A1A1AA`, below bubble
- **Max width**: 80% of container

#### User Message Bubble (RIGHT-ALIGNED)

- **Background**: `#D97706` (amber)
- **Text color**: `#0C0C0E` (dark)
- **Border**: none
- **Radius**: `0.5rem` (top-right: `0.125rem`)
- **Timestamp**: Be Vietnam Pro 12px `#A1A1AA`, below bubble
- **Max width**: 80% of container

#### Streaming Cursor

- **Character**: `▌` (Unicode U+258C)
- **Color**: `#D97706`
- **Animation**: `blink 1s step-end infinite`
- **Keyframe**: `0%, 100% { opacity: 1 } 50% { opacity: 0 }`

### 11.4 Behavior Requirements

| Behavior         | Spec                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| Auto-scroll      | Scroll to bottom on new message; pause if user scrolls up            |
| Streaming        | Append characters at 50ms/char (default); show cursor until complete |
| Send disable     | Disable send button when input empty OR when AI is streaming         |
| Message grouping | Consecutive same-sender messages reduce top spacing                  |
| Timestamps       | Show on every message; format: `HH:mm`                               |

### 11.5 Interaction States

| State           | Visual                                                 |
| --------------- | ------------------------------------------------------ |
| Loading history | Skeleton bubbles: alternating left/right shimmer       |
| Empty chat      | Welcome message from AI character auto-displayed       |
| Streaming       | Last AI bubble grows with blinking `▌` cursor          |
| Error           | Inline error banner: `#ffb4ab` text + "Thử lại" button |

### 11.6 Design Rules (MANDATORY)

- ❌ **NO** gradients, glows, or shadows on bubbles
- ❌ **NO** elevation/box-shadow
- ✅ Use **tonal depth** for AI bubbles vs background
- ✅ User bubbles use **solid amber** — high contrast with dark text
- ✅ Cursor uses **step-end** blink, not fade

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.
