# T-E08: ChatInput component (text + send + suggested prompts)

## GitHub Link

- Issue: [#90](https://github.com/khovan123/philo-mind/issues/90)
- State: open
- Track: E - AI & Chat System
- Type: frontend
- Priority: medium
- Milestone: Week 6
- Assignees: @VinhHoang03
- Updated at: 2026-05-31T15:40:01Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #90 / `T-E08`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #90 |
| Task ID | T-E08 |
| Title | ChatInput component (text + send + suggested prompts) |
| State | open |
| Local log path | `issues/by-github-id/#090-T-E08-ChatInput component (text + send + suggested prompts).md` |

## Issue Body

# T-E08: ChatInput component (text + send + suggested prompts)

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #90 |
| Track | E: AI & Chat System |
| Nhóm | E-Frontend |
| Loại việc | frontend |
| Priority | medium |
| Owner gợi ý | Backend+AI Dev |
| Assignee hiện tại | @VinhHoang03 |
| Estimate | 2h |
| Milestone | Week 6 |
| Dependencies | `T-E07` |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/ai/chat/[sessionId]` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua API client/Zustand store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Click character card mở hoặc tạo chat session rồi điều hướng tới conversation screen.
- Nút gửi message disabled khi input rỗng/loading; streaming text phải append dần và auto-scroll xuống tin nhắn mới nhất.

### UI/navigation contract đề xuất

| Tình huống | Người dùng thao tác | Kết quả bắt buộc |
| --- | --- | --- |
| Mở màn hình | User vào `/ai/chat/[sessionId]` từ tab/card/link phù hợp | Render màn hình chính của ChatInput component (text + send + suggested prompts) |
| Chọn nhân vật | Bấm character card | Tạo/mở session và điều hướng `/ai/chat/[sessionId]` |
| Gửi tin nhắn | Nhập prompt -> bấm send | Disable input khi gửi, stream response và auto-scroll |


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

- Tech stack: Express 5 + Prisma 7 + PostgreSQL cho backend; Expo 56 + React Native + Expo Router + Zustand cho frontend.
- API base chuẩn: `/api/v1`.
- Response chuẩn: `{ success, data, meta? }` hoặc `{ success: false, error: { code, message, details? } }`.
- Tài liệu tham chiếu: `docs/project-context.md`, `docs/architecture.md`, `docs/task-breakdown.md`.

---

_Updated by BMAD PM requirements pass on 2026-05-31. Nội dung này thay thế mô tả task ngắn trước đó bằng requirement cụ thể hơn cho dev/review._

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #90 for `T-E08`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#090-T-E08-ChatInput component (text + send + suggested prompts).md`.
