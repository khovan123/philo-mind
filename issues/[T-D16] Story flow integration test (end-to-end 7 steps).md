# T-D16: Story flow integration test (end-to-end 7 steps)

## 1. Mục đích sản phẩm

Chức năng này dùng để đưa người học đi qua story mode nhiều bước, từ bối cảnh, học khái niệm, ra quyết định, xem hệ quả đến phản tư.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #82 |
| Track | D: Story Mode Engine |
| Nhóm | D-Frontend |
| Loại việc | testing |
| Priority | medium |
| Owner gợi ý | Fullstack Dev |
| Assignee hiện tại | @dklinh05 |
| Estimate | 2h |
| Milestone | Week 7 |
| Dependencies | `T-D08..T-D14` |

## 3. Requirement cụ thể

- Test phải chạy bằng command repo/package tương ứng và không yêu cầu secret thật.
- Scope test bao phủ: Navigate all 7 steps; verify data persistence.
- Fixture phải deterministic; mock network/Prisma/external service khi flow không cần integration thật.
- Output mong muốn là suite fail khi chức năng vỡ và pass ổn định trong CI.


## 4. Flow tích hợp

- Test suite phải chạy sau khi dependency `T-D08..T-D14` có contract ổn định.
- Flow kiểm thử nên mô phỏng hành vi người dùng/API thật thay vì chỉ snapshot implementation detail.
- CI phải fail khi critical path bị regression.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #82.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy test suite và thấy test fail nếu flow chính bị phá vỡ.
- Test mô phỏng input/output hoặc thao tác người dùng thật ở mức phù hợp.
- Test log/CI output đủ rõ để biết lỗi nằm ở validation, API contract, UI render hay navigation.

## 6. Acceptance Criteria chi tiết

- [ ] Navigate all 7 steps: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] verify data persistence: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Story flow integration test (end-to-end 7 steps)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Navigate all 7 steps, verify data persistence.

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
