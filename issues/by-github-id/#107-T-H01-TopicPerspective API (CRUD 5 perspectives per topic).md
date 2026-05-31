# T-H01: TopicPerspective API (CRUD 5 perspectives per topic)

## GitHub Link

- Issue: [#107](https://github.com/khovan123/philo-mind/issues/107)
- State: open
- Track: H - Missing Features
- Type: backend
- Updated at: 2026-05-31T15:54:21Z

# T-H01: TopicPerspective API (CRUD 5 perspectives per topic)

## 1. Mục đích sản phẩm

Chức năng này dùng để giúp người học duyệt, tìm kiếm và mở đúng chủ đề triết học theo danh mục, độ khó và nhu cầu học hiện tại.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #107 |
| Track | H: Missing Features |
| Nhóm | H-MultiPerspective |
| Loại việc | backend |
| Priority | medium |
| Owner gợi ý | Fullstack Dev |
| Assignee hiện tại | @Ngoclee123 |
| Estimate | 3h |
| Milestone | Week 5 |
| Dependencies | `T-A04`, `T-A06` |

## 3. Requirement cụ thể

- Endpoint base: `/api/v1/topics/:topicId/perspectives`. Nếu task cần nhiều action, dùng REST sub-route rõ nghĩa dưới base này.
- Input nhận từ `params`, `query`, `body` hoặc JWT user context; validate bằng schema trước khi vào service.
- Output thành công dùng dạng `{ success: true, data, meta? }`; lỗi dùng `{ success: false, error: { code, message, details? } }`.
- Các trường output tối thiểu phải đủ để frontend render trực tiếp các AC: tech; ethical; economic; social; philosophical views.
- Luồng tích hợp: route -> auth/role guard nếu cần -> validate -> controller -> service -> Prisma transaction/query -> response helper.

### API contract đề xuất

| Method | Endpoint | Input | Output |
| --- | --- | --- | --- |
| GET | `/api/v1/topics/:topicId/perspectives` | params: topicId; query: perspective? | data: perspectives[] gồm id, name, summary, arguments, examples |
| POST | `/api/v1/topics/:topicId/perspectives` | body: { perspective, summary, arguments[], examples[] } | data: created perspective; admin/moderator only |
| PATCH | `/api/v1/topic-perspectives/:id` | body: partial perspective fields | data: updated perspective |


## 4. Flow tích hợp

- Dependency trước khi tích hợp: `T-A04`, `T-A06`.
- Consumer chính là frontend API client/store hoặc test suite tương ứng; contract phải đủ ổn định để consumer không đoán field.
- Nếu endpoint cần quyền user/admin, flow phải bắt đầu từ JWT auth middleware và trả 401/403 nhất quán.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #107.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Client gọi endpoint dưới `/api/v1/topics/:topicId/perspectives` với input hợp lệ thì nhận response thành công đủ dữ liệu để render hoặc lưu state.
- Input thiếu/sai kiểu/không đủ quyền phải trả lỗi chuẩn, không crash server và không ghi dữ liệu dở dang.
- Service phải xử lý edge case chính: record không tồn tại, duplicate khi có unique constraint, pagination/filter rỗng, quyền user/admin.
- Output cần expose field trực tiếp phục vụ AC: tech, ethical, economic, social, philosophical views.

## 6. Acceptance Criteria chi tiết

- [ ] tech: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] ethical: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] economic: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] social: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] philosophical views: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **TopicPerspective API (CRUD 5 perspectives per topic)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: tech, ethical, economic, social, philosophical views.

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

## Feature Output Contract

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #107 / `T-H01`, beyond implementation process notes.

### User-facing outcome

Người học duyệt và mở đúng chủ đề triết học theo danh mục, độ khó, tìm kiếm và nội dung liên quan.

### Inputs

- page/limit
- search keyword
- category
- difficulty
- topicId when opening detail

### Expected output

- Một hoặc nhiều endpoint dưới `/api/v1/topics/:topicId/perspectives` hoạt động với request hợp lệ và trả response chuẩn `{ success, data, meta? }`.
- Validation trả lỗi rõ ràng khi thiếu field, sai kiểu, record không tồn tại hoặc user không đủ quyền.
- Dữ liệu được ghi/đọc qua Prisma đúng quan hệ schema, không tạo duplicate ngoài ý muốn và không trả field nhạy cảm.
- Frontend/test có thể dùng response ngay mà không phải đoán tên field hoặc tự tính business logic chính.

### Success state

- Client gọi `/api/v1/topics/:topicId/perspectives`, nhận HTTP 2xx với data đủ field để consumer render/lưu state.

### Empty/error/loading states

- 400 cho input sai shape hoặc thiếu field bắt buộc.
- 401/403 cho user chưa đăng nhập hoặc không đủ role.
- 404 cho record không tồn tại; 409 cho duplicate/constraint conflict khi phù hợp.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #107 and mention `T-H01`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #107 for `T-H01`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#107-T-H01-TopicPerspective API (CRUD 5 perspectives per topic).md`.

