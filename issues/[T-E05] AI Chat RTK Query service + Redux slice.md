# T-E05: AI Chat RTK Query service + Redux slice

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị             |
| ----------------- | ------------------- |
| GitHub issue      | #87                 |
| Track             | E: AI & Chat System |
| Nhóm              | E-Frontend          |
| Loại việc         | frontend            |
| Priority          | medium              |
| Owner gợi ý       | Backend+AI Dev      |
| Assignee hiện tại | @NguyenDat204       |
| Estimate          | 2h                  |
| Milestone         | Week 6              |
| Dependencies      | `T-E03`             |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/ai/chat/[sessionId]` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua RTK Query API slice + Redux Toolkit store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Click character card mở hoặc tạo chat session rồi điều hướng tới conversation screen.
- Nút gửi message disabled khi input rỗng/loading; streaming text phải append dần và auto-scroll xuống tin nhắn mới nhất.

### UI/navigation contract đề xuất

| Tình huống    | Người dùng thao tác                                      | Kết quả bắt buộc                                                  |
| ------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| Mở màn hình   | User vào `/ai/chat/[sessionId]` từ tab/card/link phù hợp | Render màn hình chính của AI Chat RTK Query service + Redux slice |
| Chọn nhân vật | Bấm character card                                       | Tạo/mở session và điều hướng `/ai/chat/[sessionId]`               |
| Gửi tin nhắn  | Nhập prompt -> bấm send                                  | Disable input khi gửi, stream response và auto-scroll             |

## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-E03`.
- User mở màn hình qua route `/ai/chat/[sessionId]`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #87.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/ai/chat/[sessionId]` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] API client: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] session/message state: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **AI Chat RTK Query service + Redux slice** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: RTK Query endpoints, Redux slices for session/message UI state.

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

_Updated by BMAD PM requirements pass on 2026-05-31._

## 11. UI/Design Context

> **Note**: T-E05 is a **pure infrastructure** task (RTK Query + Redux slices). It has no dedicated Stitch UI screen.
> The API/state contracts defined here are consumed by the following visual screens:
>
> | Consumer | Stitch Screen                      | Description       |
> | -------- | ---------------------------------- | ----------------- |
> | T-E06    | `098adda59fee4f7fb6c3b617a5765045` | Character Gallery |
> | T-E07    | `8076ad2fae0f45bda49ea35f41fbb9ff` | Chat Conversation |
> | T-E08    | `43204fb1f55d4c7cb0b59b0ebc848668` | ChatInput States  |
> | T-E09    | `3c789f742f344aa28568ec82844c61bf` | StreamingText     |
>
> All screens use the **PhiloMind Dark Scholar** design system (`#0C0C0E` bg, `#D97706` accent).

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.
