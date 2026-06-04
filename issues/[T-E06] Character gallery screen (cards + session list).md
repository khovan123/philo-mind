# T-E06: Character gallery screen (cards + session list)

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị             |
| ----------------- | ------------------- |
| GitHub issue      | #88                 |
| Track             | E: AI & Chat System |
| Nhóm              | E-Frontend          |
| Loại việc         | frontend            |
| Priority          | medium              |
| Owner gợi ý       | Backend+AI Dev      |
| Assignee hiện tại | @NguyenDat204       |
| Estimate          | 4h                  |
| Milestone         | Week 6              |
| Dependencies      | `T-E05`             |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/ai/characters` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua RTK Query API slice + Redux Toolkit store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Click character card mở hoặc tạo chat session rồi điều hướng tới conversation screen.
- Nút gửi message disabled khi input rỗng/loading; streaming text phải append dần và auto-scroll xuống tin nhắn mới nhất.

### UI/navigation contract đề xuất

| Tình huống    | Người dùng thao tác                                | Kết quả bắt buộc                                                          |
| ------------- | -------------------------------------------------- | ------------------------------------------------------------------------- |
| Mở màn hình   | User vào `/ai/characters` từ tab/card/link phù hợp | Render màn hình chính của Character gallery screen (cards + session list) |
| Chọn nhân vật | Bấm character card                                 | Tạo/mở session và điều hướng `/ai/chat/[sessionId]`                       |
| Gửi tin nhắn  | Nhập prompt -> bấm send                            | Disable input khi gửi, stream response và auto-scroll                     |

## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-E05`.
- User mở màn hình qua route `/ai/characters`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #88.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/ai/characters` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] Portrait cards: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] era-themed borders: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Character gallery screen (cards + session list)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Portrait cards, era-themed borders.

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

> **Stitch Screen**: `098adda59fee4f7fb6c3b617a5765045` — "Nhân vật AI"
> **Project**: `16360193101983963529` | **Design System**: `PhiloMind Dark Scholar`

### 11.1 Screen Layout (Mobile 390px)

```
┌─────────────────────────────────────┐
│ ← Nhân vật AI                  🔍  │  TopAppBar
├─────────────────────────────────────┤
│ [Tất cả] [Cổ đại] [Trung cổ] ...  │  Filter Chips (horizontal scroll)
├─────────────────────────────────────┤
│ ┌────────┐  ┌────────┐             │
│ │Socrates│  │Khổng Tử│             │  2-column grid
│ │ Cổ đại │  │Phương Đ│             │
│ └────────┘  └────────┘             │
│ ┌────────┐  ┌────────┐             │
│ │Nietzsche│ │Aristotle│            │
│ └────────┘  └────────┘             │
│ ┌────────┐  ┌────────┐             │
│ │ Lão Tử │  │  Kant  │             │
│ └────────┘  └────────┘             │
├─────────────────────────────────────┤
│ Cuộc trò chuyện gần đây            │  Section header
│ ○ Socrates · "Về đạo đức..." · 2h  │
│ ─────────────────────────────────── │  1px #27272A divider
│ ○ Khổng Tử · "Nhân nghĩa..."· 1d   │
│ ─────────────────────────────────── │
│ ○ Nietzsche · "Ý chí quyền..."· 3d │
├─────────────────────────────────────┤
│ 🏠  🔍  📜  💬  👤               │  BottomNavBar (AI Chat = active)
└─────────────────────────────────────┘
```

### 11.2 Design Tokens

| Token            | Value            | Usage                               |
| ---------------- | ---------------- | ----------------------------------- |
| `background`     | `#0C0C0E`        | Screen background                   |
| `surface`        | `#18181B`        | Card backgrounds, nav bars          |
| `border`         | `#27272A`        | Card borders, dividers              |
| `text-primary`   | `#E4E4E7`        | Names, headings                     |
| `text-secondary` | `#A1A1AA`        | Bios, timestamps, metadata          |
| `accent`         | `#D97706`        | Active chip border, active tab icon |
| `heading-font`   | `Outfit`         | Card names, section titles          |
| `body-font`      | `Be Vietnam Pro` | Bios, list text, timestamps         |
| `card-radius`    | `0.5rem (8px)`   | Character cards                     |
| `button-radius`  | `0.25rem (4px)`  | Chips, buttons                      |

### 11.3 Component Specifications

#### Character Card

- **Background**: `#18181B`
- **Border**: `1px solid #27272A`
- **Radius**: `0.5rem`
- **Avatar**: Circle with initials, 48px, amber `#D97706` ring on hover/active
- **Name**: Outfit 16px semibold `#E4E4E7`
- **Era Tag**: Chip — `#27272A` bg, `#A1A1AA` text, 12px Be Vietnam Pro
- **Bio**: Be Vietnam Pro 13px `#A1A1AA`, max 2 lines, ellipsis overflow
- **Touch Feedback**: Background shifts to `#27272A` (no shadow, no elevation)

#### Filter Chips

- **Default**: `#27272A` bg, `#A1A1AA` text, `0.25rem` radius
- **Active**: `1px #D97706` border, `#D97706` text
- **Font**: Be Vietnam Pro 13px
- **Horizontal scroll**: No wrap, gap `8px`

#### Recent Sessions List

- **Row**: Avatar circle (32px) + Name (Outfit 14px) + Message preview (Be Vietnam Pro 13px `#A1A1AA`) + Timestamp
- **Divider**: `1px solid #27272A`
- **Touch**: Row bg shifts to `#27272A`

### 11.4 Interaction States

| State   | Visual                                        |
| ------- | --------------------------------------------- |
| Loading | Skeleton cards: `#18181B` shimmer blocks      |
| Empty   | Centered icon + "Chưa có nhân vật nào" text   |
| Error   | Error card with `#ffb4ab` text + retry button |
| Success | Full grid + session list rendered             |

### 11.5 Design Rules (MANDATORY)

- ❌ **NO** gradients, glows, or shadows
- ❌ **NO** elevation/box-shadow
- ✅ Use **tonal depth** (`#0C0C0E` → `#18181B` → `#27272A`) for layering
- ✅ Use **1px borders** for element separation
- ✅ Touch feedback via **color shift only**

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.
