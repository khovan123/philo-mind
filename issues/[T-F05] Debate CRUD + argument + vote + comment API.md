# T-F05: Debate CRUD + argument + vote + comment API

## 1. Mục đích sản phẩm

Chức năng này dùng để giúp người học phân tích tình huống đời thực từ nhiều góc nhìn, tranh luận và nhìn lại lập trường của mình.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #97 |
| Track | F: Scenario & Debate |
| Nhóm | F-Debate |
| Loại việc | backend |
| Priority | medium |
| Owner gợi ý | Fullstack Dev |
| Assignee hiện tại | @Ngoclee123 |
| Estimate | 5h |
| Milestone | Week 7 |
| Dependencies | `T-A04` |

## 3. Requirement cụ thể

- Endpoint base: `/api/v1/debates`. Nếu task cần nhiều action, dùng REST sub-route rõ nghĩa dưới base này.
- Input nhận từ `params`, `query`, `body` hoặc JWT user context; validate bằng schema trước khi vào service.
- Output thành công dùng dạng `{ success: true, data, meta? }`; lỗi dùng `{ success: false, error: { code, message, details? } }`.
- Các trường output tối thiểu phải đủ để frontend render trực tiếp các AC: FOR/AGAINST/NEUTRAL; unique vote.
- Luồng tích hợp: route -> auth/role guard nếu cần -> validate -> controller -> service -> Prisma transaction/query -> response helper.

### API contract đề xuất

| Method | Endpoint | Input | Output |
| --- | --- | --- | --- |
| GET | `/api/v1/debates` | query: { topicId, stance?, page, limit } | data: debate list with counts |
| GET | `/api/v1/debates/:id` | params: id | data: debate detail + for/against arguments + comments |
| POST | `/api/v1/debates/:id/arguments` | body: { stance, content, sources? } | data: created argument |
| POST | `/api/v1/debate-arguments/:id/votes` | body: { value } | data: updated vote summary |


## 4. Flow tích hợp

- Dependency trước khi tích hợp: `T-A04`.
- Consumer chính là frontend API client/store hoặc test suite tương ứng; contract phải đủ ổn định để consumer không đoán field.
- Nếu endpoint cần quyền user/admin, flow phải bắt đầu từ JWT auth middleware và trả 401/403 nhất quán.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #97.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Client gọi endpoint dưới `/api/v1/debates` với input hợp lệ thì nhận response thành công đủ dữ liệu để render hoặc lưu state.
- Input thiếu/sai kiểu/không đủ quyền phải trả lỗi chuẩn, không crash server và không ghi dữ liệu dở dang.
- Service phải xử lý edge case chính: record không tồn tại, duplicate khi có unique constraint, pagination/filter rỗng, quyền user/admin.
- Output cần expose field trực tiếp phục vụ AC: FOR/AGAINST/NEUTRAL, unique vote.

## 6. Acceptance Criteria chi tiết

- [ ] FOR/AGAINST/NEUTRAL: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] unique vote: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Debate CRUD + argument + vote + comment API**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: FOR/AGAINST/NEUTRAL, unique vote.

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

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.
