# T-F01: Schema migration: ScenarioPerspective, ScenarioFramework

## 1. Mục đích sản phẩm

Chức năng này dùng để giúp người học phân tích tình huống đời thực từ nhiều góc nhìn, tranh luận và nhìn lại lập trường của mình.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| GitHub issue      | #93                           |
| Track             | F: Scenario & Debate          |
| Nhóm              | F-Scenario                    |
| Loại việc         | fullstack                     |
| Priority          | medium                        |
| Owner gợi ý       | Fullstack Dev                 |
| Assignee hiện tại | @Ngoclee123                   |
| Estimate          | 2h                            |
| Milestone         | Week 5                        |
| Dependencies      | Không có dependency bắt buộc. |

## 3. Requirement cụ thể

- Endpoint base: `/api/v1/scenarios`. Nếu task cần nhiều action, dùng REST sub-route rõ nghĩa dưới base này.
- Input nhận từ `params`, `query`, `body` hoặc JWT user context; validate bằng schema trước khi vào service.
- Output thành công dùng dạng `{ success: true, data, meta? }`; lỗi dùng `{ success: false, error: { code, message, details? } }`.
- Các trường output tối thiểu phải đủ để frontend render trực tiếp các AC: New models; stance fields.
- Luồng tích hợp: route -> auth/role guard nếu cần -> validate -> controller -> service -> Prisma transaction/query -> response helper.
- Screen/route đề xuất: `/scenarios/[id]` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua API client/Zustand store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Click scenario/debate card mở detail; CTA respond/argue mở form nhập lập trường hoặc luận điểm.
- Sau khi submit, màn hình cập nhật stats/perspective và cho phép người dùng xem lại hoặc điều hướng sang bước kế tiếp.

### API contract đề xuất

| Method | Endpoint                        | Input                                 | Output                                         |
| ------ | ------------------------------- | ------------------------------------- | ---------------------------------------------- |
| GET    | `/api/v1/scenarios`             | query: { topicId, page, limit }       | data: scenario cards[]                         |
| GET    | `/api/v1/scenarios/:id`         | params: id                            | data: situation + perspectives[] + framework[] |
| POST   | `/api/v1/scenarios/:id/respond` | body: { initialPosition, reasoning }  | data: saved response + perspective stats       |
| PATCH  | `/api/v1/scenarios/:id/rethink` | body: { revisedPosition, reflection } | data: updated response                         |

### UI/navigation contract đề xuất

| Tình huống     | Người dùng thao tác                                 | Kết quả bắt buộc                                                                   |
| -------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Mở màn hình    | User vào `/scenarios/[id]` từ tab/card/link phù hợp | Render màn hình chính của Schema migration: ScenarioPerspective, ScenarioFramework |
| Mở tình huống  | Bấm scenario card                                   | Render situation + perspectives                                                    |
| Gửi lập trường | Bấm respond/rethink CTA                             | Submit response, cập nhật stats và bước rethink                                    |

## 4. Flow tích hợp

- Dependency trước khi tích hợp: Không có dependency bắt buộc..
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #93.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Hành vi cuối cùng phải quan sát được qua API, UI hoặc test tự động, không chỉ qua code tồn tại.

## 6. Acceptance Criteria chi tiết

- [ ] New models: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] stance fields: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Schema migration: ScenarioPerspective, ScenarioFramework**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: New models, stance fields.

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
