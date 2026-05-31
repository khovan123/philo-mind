# T-A12: Critical Question API (list/random/admin CRUD)

## GitHub Link

- Issue: [#28](https://github.com/khovan123/philo-mind/issues/28)
- State: done
- Track: A - Backend Core
- Type: backend
- Priority: medium
- Milestone: Week 4
- Assignees: @linhtv1209-fudn
- Updated at: 2026-05-31T15:39:00Z
- Closed at: 2026-05-31T10:33:41Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #28 / `T-A12`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #28 |
| Task ID | T-A12 |
| Title | Critical Question API (list/random/admin CRUD) |
| State | done |
| Local log path | `issues/by-github-id/#028-T-A12-Critical Question API (list-random-admin CRUD).md` |

## Issue Body

## T-A12: Critical Question API (list/random/admin CRUD)

### Mục tiêu
Hoàn thành **Critical Question API (list/random/admin CRUD)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | A: Backend Core |
| Nhóm | A-Advanced APIs |
| Owner gợi ý | Backend Dev |
| Estimate | 2h |
| Thời điểm dự kiến | Week 3 |
| Dependencies | `T-A04` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Critical Question API (list/random/admin CRUD)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Daily random, 3 question types.

### Acceptance Criteria
- [ ] Daily random
- [ ] 3 question types

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

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #28 for `T-A12`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T10:33:41Z. Local log: `issues/by-github-id/#028-T-A12-Critical Question API (list-random-admin CRUD).md`.
