# T-G06: Performance optimization (caching + lazy load + bundle audit)

## 1. Mục đích sản phẩm

Chức năng này dùng để biến task "Performance optimization (caching + lazy load + bundle audit)" thành một phần chức năng rõ ràng, có thể dùng, test và review độc lập.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #106 |
| Track | G: Polish & Gamification |
| Nhóm | All |
| Loại việc | fullstack |
| Priority | medium |
| Owner gợi ý | Any Dev |
| Assignee hiện tại | @kangdev03 |
| Estimate | 4h |
| Milestone | Week 7 |
| Dependencies | `All` |

## 3. Requirement cụ thể

- Endpoint base: `/api/v1`. Nếu task cần nhiều action, dùng REST sub-route rõ nghĩa dưới base này.
- Input nhận từ `params`, `query`, `body` hoặc JWT user context; validate bằng schema trước khi vào service.
- Output thành công dùng dạng `{ success: true, data, meta? }`; lỗi dùng `{ success: false, error: { code, message, details? } }`.
- Các trường output tối thiểu phải đủ để frontend render trực tiếp các AC: Redis; React.memo; Lighthouse > 80.
- Luồng tích hợp: route -> auth/role guard nếu cần -> validate -> controller -> service -> Prisma transaction/query -> response helper.
- Screen/route đề xuất: `/` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua API client/Zustand store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Các action chính phải có CTA rõ ràng; click vào item liên quan điều hướng tới detail hoặc flow kế tiếp thay vì chỉ render card tĩnh.
- UI phải thể hiện trực tiếp các AC: Redis; React.memo; Lighthouse > 80.

### API contract đề xuất

| Method | Endpoint | Input | Output |
| --- | --- | --- | --- |
| TBD | `/api/v1` | input/output xác định theo domain model liên quan | data đủ phục vụ AC và UI consumer |


### UI/navigation contract đề xuất

| Tình huống | Người dùng thao tác | Kết quả bắt buộc |
| --- | --- | --- |
| Mở màn hình | User vào `/` từ tab/card/link phù hợp | Render màn hình chính của Performance optimization (caching + lazy load + bundle audit) |
| Action chính | Bấm CTA/item chính | Thực hiện submit/navigate/update state theo domain |


## 4. Flow tích hợp

- Dependency trước khi tích hợp: `All`.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #106.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Hành vi cuối cùng phải quan sát được qua API, UI hoặc test tự động, không chỉ qua code tồn tại.

## 6. Acceptance Criteria chi tiết

- [ ] Redis: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] React.memo: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] Lighthouse > 80: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Triển khai end-to-end scope **Performance optimization (caching + lazy load + bundle audit)** theo cấu trúc hiện có của repo.
- [ ] Cập nhật API contract, frontend integration và state/error handling liên quan.
- [ ] Bổ sung migration hoặc type changes nếu feature yêu cầu.
- [ ] Chạy smoke test cho luồng người dùng hoàn chỉnh và ghi lại kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Redis, React.memo, Lighthouse > 80.

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
