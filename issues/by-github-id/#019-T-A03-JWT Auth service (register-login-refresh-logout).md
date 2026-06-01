# T-A03: JWT Auth service (register/login/refresh/logout)

## GitHub Link

- Issue: [#19](https://github.com/khovan123/philo-mind/issues/19)
- State: closed
- Track: A - Backend Core
- Type: backend
- Updated at: 2026-05-31T15:52:56Z

## T-A03: JWT Auth service (register/login/refresh/logout)

### Mục tiêu
Hoàn thành **JWT Auth service (register/login/refresh/logout)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | A: Backend Core |
| Nhóm | A-Foundation |
| Owner gợi ý | Backend Dev |
| Estimate | 4h |
| Thời điểm dự kiến | Week 1 |
| Dependencies | Không có dependency bắt buộc. |

### Dependency Notes
Task có thể bắt đầu ngay. Nếu phát hiện dependency ngầm, cập nhật issue trước khi tiếp tục.

### Checklist triển khai
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **JWT Auth service (register/login/refresh/logout)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: bcrypt 12, JWT 15min/7d, token rotation.

### Acceptance Criteria
- [ ] bcrypt 12
- [ ] JWT 15min/7d
- [ ] token rotation

### Kiểm chứng bắt buộc
- [ ] Chạy lint/typecheck/test phù hợp với package bị thay đổi.
- [ ] Ghi rõ command đã chạy và kết quả trong PR.
- [ ] Kiểm tra không commit secret, file `.env` thật hoặc artifact local.
- [ ] Nếu thay đổi contract dùng chung, cập nhật consumer hoặc ghi rõ follow-up dependency.

### Definition of Done
- [ ] Code/config đã commit trên branch riêng và mở PR liên kết issue này.
- [ ] PR mô tả phạm vi thay đổi, cách kiểm chứng và rủi ro còn lại.
- [ ] CI xanh hoặc PR ghi rõ blocker có thể tái hiện.
- [ ] Không còn TODO thuộc trực tiếp scope issue này.

---
_Generated from `docs/task-breakdown.md`. Nếu scope thay đổi, cập nhật breakdown và issue cùng lúc._

## Feature Output Contract

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #19 / `T-A03`, beyond implementation process notes.

### User-facing outcome

Người dùng có thể tạo tài khoản, đăng nhập, duy trì phiên, làm mới token và đăng xuất/khôi phục mật khẩu mà không mất dữ liệu học tập cá nhân.

### Inputs

- email
- password
- submit action
- auth API response

### Expected output

- Một hoặc nhiều endpoint dưới `/api/v1/auth` hoạt động với request hợp lệ và trả response chuẩn `{ success, data, meta? }`.
- Validation trả lỗi rõ ràng khi thiếu field, sai kiểu, record không tồn tại hoặc user không đủ quyền.
- Dữ liệu được ghi/đọc qua Prisma đúng quan hệ schema, không tạo duplicate ngoài ý muốn và không trả field nhạy cảm.
- Frontend/test có thể dùng response ngay mà không phải đoán tên field hoặc tự tính business logic chính.

### Success state

- Client gọi `/api/v1/auth`, nhận HTTP 2xx với data đủ field để consumer render/lưu state.

### Empty/error/loading states

- 400 cho input sai shape hoặc thiếu field bắt buộc.
- 401/403 cho user chưa đăng nhập hoặc không đủ role.
- 404 cho record không tồn tại; 409 cho duplicate/constraint conflict khi phù hợp.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #19 and mention `T-A03`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #19 for `T-A03`. Current source-of-truth status: **DONE**. Closed at: 2026-05-29T01:09:39Z. Local log: `issues/by-github-id/#019-T-A03-JWT Auth service (register-login-refresh-logout).md`.

