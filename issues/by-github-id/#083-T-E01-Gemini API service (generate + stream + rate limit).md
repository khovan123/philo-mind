# T-E01: Gemini API service (generate + stream + rate limit)

## GitHub Link

- Issue: [#83](https://github.com/khovan123/philo-mind/issues/83)
- State: open
- Track: E - AI & Chat System
- Type: backend
- Priority: high
- Milestone: Week 4
- Assignees: @VinhHoang03
- Updated at: 2026-06-01T05:30:48Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #83 / `T-E01`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field          | Value                                                                                   |
| -------------- | --------------------------------------------------------------------------------------- |
| GitHub issue   | #83                                                                                     |
| Task ID        | T-E01                                                                                   |
| Title          | Gemini API service (generate + stream + rate limit)                                     |
| State          | open                                                                                    |
| Local log path | `issues/by-github-id/#083-T-E01-Gemini API service (generate + stream + rate limit).md` |

## Issue Body

# T-E01: Gemini API service (generate + stream + rate limit)

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| GitHub issue      | #83                           |
| Track             | E: AI & Chat System           |
| Nhóm              | E-Backend                     |
| Loại việc         | backend                       |
| Priority          | high                          |
| Owner gợi ý       | Backend+AI Dev                |
| Assignee hiện tại | @VinhHoang03                  |
| Estimate          | 4h                            |
| Milestone         | Week 4                        |
| Dependencies      | Không có dependency bắt buộc. |

## 3. Requirement cụ thể

- Endpoint base: `/api/v1/ai/generate`. Nếu task cần nhiều action, dùng REST sub-route rõ nghĩa dưới base này.
- Input nhận từ `params`, `query`, `body` hoặc JWT user context; validate bằng schema trước khi vào service.
- Output thành công dùng dạng `{ success: true, data, meta? }`; lỗi dùng `{ success: false, error: { code, message, details? } }`.
- Các trường output tối thiểu phải đủ để frontend render trực tiếp các AC: 10 req/min/user; 30s timeout; safety filter.
- Luồng tích hợp: route -> auth/role guard nếu cần -> validate -> controller -> service -> Prisma transaction/query -> response helper.

### API contract đề xuất

| Method   | Endpoint                     | Input                                    | Output                                 |
| -------- | ---------------------------- | ---------------------------------------- | -------------------------------------- |
| POST     | `/api/v1/ai/generate`        | body: { prompt, characterId?, context? } | data: generated text + safety metadata |
| POST     | `/api/v1/ai/generate/stream` | body: prompt/context                     | SSE chunks or stream token events      |
| Internal | `rate limit`                 | input: userId + timestamp                | output: allow/deny + retryAfter        |

## 4. Flow tích hợp

- Dependency trước khi tích hợp: Không có dependency bắt buộc..
- Consumer chính là frontend API client/store hoặc test suite tương ứng; contract phải đủ ổn định để consumer không đoán field.
- Nếu endpoint cần quyền user/admin, flow phải bắt đầu từ JWT auth middleware và trả 401/403 nhất quán.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #83.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Client gọi endpoint dưới `/api/v1/ai/generate` với input hợp lệ thì nhận response thành công đủ dữ liệu để render hoặc lưu state.
- Input thiếu/sai kiểu/không đủ quyền phải trả lỗi chuẩn, không crash server và không ghi dữ liệu dở dang.
- Service phải xử lý edge case chính: record không tồn tại, duplicate khi có unique constraint, pagination/filter rỗng, quyền user/admin.
- Output cần expose field trực tiếp phục vụ AC: 10 req/min/user, 30s timeout, safety filter.

## 6. Acceptance Criteria chi tiết

- [ ] 10 req/min/user: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] 30s timeout: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] safety filter: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Gemini API service (generate + stream + rate limit)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: 10 req/min/user, 30s timeout, safety filter.

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

## Feature Output Contract

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #83 / `T-E01`, beyond implementation process notes.

### User-facing outcome

Người học trò chuyện với nhân vật triết học AI theo ngữ cảnh học tập, có phản hồi an toàn, streaming và lịch sử hội thoại.

### Inputs

- characterId
- sessionId
- message content
- conversation context

### Expected output

- Một hoặc nhiều endpoint dưới `/api/v1/ai/generate` hoạt động với request hợp lệ và trả response chuẩn `{ success, data, meta? }`.
- Validation trả lỗi rõ ràng khi thiếu field, sai kiểu, record không tồn tại hoặc user không đủ quyền.
- Dữ liệu được ghi/đọc qua Prisma đúng quan hệ schema, không tạo duplicate ngoài ý muốn và không trả field nhạy cảm.
- Frontend/test có thể dùng response ngay mà không phải đoán tên field hoặc tự tính business logic chính.

### Success state

- Client gọi `/api/v1/ai/generate`, nhận HTTP 2xx với data đủ field để consumer render/lưu state.

### Empty/error/loading states

- 400 cho input sai shape hoặc thiếu field bắt buộc.
- 401/403 cho user chưa đăng nhập hoặc không đủ role.
- 404 cho record không tồn tại; 409 cho duplicate/constraint conflict khi phù hợp.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #83 and mention `T-E01`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #83 for `T-E01`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#083-T-E01-Gemini API service (generate + stream + rate limit).md`.
