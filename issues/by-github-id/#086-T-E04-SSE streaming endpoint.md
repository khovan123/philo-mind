# T-E04: SSE streaming endpoint

## GitHub Link

- Issue: [#86](https://github.com/khovan123/philo-mind/issues/86)
- State: open
- Track: E - AI & Chat System
- Type: backend
- Priority: high
- Milestone: Week 4
- Assignees: @VinhHoang03
- Updated at: 2026-05-31T15:39:58Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #86 / `T-E04`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #86 |
| Task ID | T-E04 |
| Title | SSE streaming endpoint |
| State | open |
| Local log path | `issues/by-github-id/#086-T-E04-SSE streaming endpoint.md` |

## Issue Body

# T-E04: SSE streaming endpoint

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #86 |
| Track | E: AI & Chat System |
| Nhóm | E-Backend |
| Loại việc | backend |
| Priority | high |
| Owner gợi ý | Backend+AI Dev |
| Assignee hiện tại | @VinhHoang03 |
| Estimate | 4h |
| Milestone | Week 4 |
| Dependencies | `T-E03` |

## 3. Requirement cụ thể

- Endpoint base: `/api/v1/ai/chat/sessions/:id/stream`. Nếu task cần nhiều action, dùng REST sub-route rõ nghĩa dưới base này.
- Input nhận từ `params`, `query`, `body` hoặc JWT user context; validate bằng schema trước khi vào service.
- Output thành công dùng dạng `{ success: true, data, meta? }`; lỗi dùng `{ success: false, error: { code, message, details? } }`.
- Các trường output tối thiểu phải đủ để frontend render trực tiếp các AC: `text/event-stream`; chunked; abort handling.
- Luồng tích hợp: route -> auth/role guard nếu cần -> validate -> controller -> service -> Prisma transaction/query -> response helper.

### API contract đề xuất

| Method | Endpoint | Input | Output |
| --- | --- | --- | --- |
| POST | `/api/v1/ai/chat/sessions` | body: { characterId, topicId? } | data: chat session |
| GET | `/api/v1/ai/chat/sessions` | auth user | data: session list |
| POST | `/api/v1/ai/chat/sessions/:id/messages` | body: { content } | data: user message + assistant response metadata |
| GET | `/api/v1/ai/chat/sessions/:id/stream` | query/header: session token context | SSE text chunks + done/error events |


## 4. Flow tích hợp

- Dependency trước khi tích hợp: `T-E03`.
- Consumer chính là frontend API client/store hoặc test suite tương ứng; contract phải đủ ổn định để consumer không đoán field.
- Nếu endpoint cần quyền user/admin, flow phải bắt đầu từ JWT auth middleware và trả 401/403 nhất quán.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #86.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Client gọi endpoint dưới `/api/v1/ai/chat/sessions/:id/stream` với input hợp lệ thì nhận response thành công đủ dữ liệu để render hoặc lưu state.
- Input thiếu/sai kiểu/không đủ quyền phải trả lỗi chuẩn, không crash server và không ghi dữ liệu dở dang.
- Service phải xử lý edge case chính: record không tồn tại, duplicate khi có unique constraint, pagination/filter rỗng, quyền user/admin.
- Output cần expose field trực tiếp phục vụ AC: `text/event-stream`, chunked, abort handling.

## 6. Acceptance Criteria chi tiết

- [ ] `text/event-stream`: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] chunked: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] abort handling: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **SSE streaming endpoint**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: `text/event-stream`, chunked, abort handling.

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #86 for `T-E04`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#086-T-E04-SSE streaming endpoint.md`.
