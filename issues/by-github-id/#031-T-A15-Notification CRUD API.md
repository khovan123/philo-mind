# T-A15: Notification CRUD API

## GitHub Link

- Issue: [#31](https://github.com/khovan123/philo-mind/issues/31)
- State: closed
- Track: A - Backend Core
- Type: backend
- Updated at: 2026-05-31T15:53:08Z

## T-A15: Notification CRUD API

### Mục tiêu

Hoàn thành **Notification CRUD API** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị         |
| ----------------- | --------------- |
| Track             | A: Backend Core |
| Nhóm              | A-Advanced APIs |
| Owner gợi ý       | Backend Dev     |
| Estimate          | 3h              |
| Thời điểm dự kiến | Week 3          |
| Dependencies      | `T-A04`         |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Notification CRUD API**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Unread count, mark read, deep-link metadata.

### Acceptance Criteria

- [ ] Unread count
- [ ] mark read
- [ ] deep-link metadata

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #31 / `T-A15`, beyond implementation process notes.

### User-facing outcome

Người học nhận động lực quay lại app qua tiến độ, streak, badge, mini-game, thông báo và bảng xếp hạng.

### Inputs

- request params/query/body or user action relevant to this issue

### Expected output

- Một hoặc nhiều endpoint dưới `/api/v1/notifications` hoạt động với request hợp lệ và trả response chuẩn `{ success, data, meta? }`.
- Validation trả lỗi rõ ràng khi thiếu field, sai kiểu, record không tồn tại hoặc user không đủ quyền.
- Dữ liệu được ghi/đọc qua Prisma đúng quan hệ schema, không tạo duplicate ngoài ý muốn và không trả field nhạy cảm.
- Frontend/test có thể dùng response ngay mà không phải đoán tên field hoặc tự tính business logic chính.

### Success state

- Client gọi `/api/v1/notifications`, nhận HTTP 2xx với data đủ field để consumer render/lưu state.

### Empty/error/loading states

- 400 cho input sai shape hoặc thiếu field bắt buộc.
- 401/403 cho user chưa đăng nhập hoặc không đủ role.
- 404 cho record không tồn tại; 409 cho duplicate/constraint conflict khi phù hợp.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #31 and mention `T-A15`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #31 for `T-A15`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T02:07:56Z. Local log: `issues/by-github-id/#031-T-A15-Notification CRUD API.md`.
