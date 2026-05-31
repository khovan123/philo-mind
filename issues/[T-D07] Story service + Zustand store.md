# T-D07: Story service + Zustand store

## 1. Mục đích sản phẩm

Chức năng này dùng để đưa người học đi qua story mode nhiều bước, từ bối cảnh, học khái niệm, ra quyết định, xem hệ quả đến phản tư.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #73 |
| Track | D: Story Mode Engine |
| Nhóm | D-Frontend |
| Loại việc | frontend |
| Priority | medium |
| Owner gợi ý | Fullstack Dev |
| Assignee hiện tại | @dklinh05 |
| Estimate | 2h |
| Milestone | Week 5 |
| Dependencies | `T-D02` |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua API client/Zustand store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Card/CTA story phải điều hướng đúng chuỗi: list -> intro -> learn -> dilemma/choose -> result -> knowledge -> reflect -> list/profile progress.
- Các nút tiếp tục/quay lại phải giữ sessionId/current story trong store để không mất tiến trình giữa các bước.

### UI/navigation contract đề xuất

| Tình huống | Người dùng thao tác | Kết quả bắt buộc |
| --- | --- | --- |
| Mở màn hình | User vào `/` từ tab/card/link phù hợp | Render màn hình chính của Story service + Zustand store |
| Bắt đầu/tiếp tục | Bấm story card hoặc CTA tiếp tục | Điều hướng đúng step kế tiếp, giữ storyId/sessionId |
| Qua bước kế tiếp | Bấm CTA chính của step | Điều hướng theo chain story mode: list -> intro -> learn -> choose -> result -> knowledge -> reflect |


## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-D02`.
- User mở màn hình qua route `/`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #73.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] API integration: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] session state management: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Story service + Zustand store** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: API integration, session state management.

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
