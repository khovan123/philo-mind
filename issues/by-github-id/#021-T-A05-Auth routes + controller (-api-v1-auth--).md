# T-A05: Auth routes + controller (/api/v1/auth/*)

## GitHub Link

- Issue: [#21](https://github.com/khovan123/philo-mind/issues/21)
- State: done
- Track: A - Backend Core
- Type: backend
- Priority: high
- Milestone: Week 1
- Assignees: @khovan123, @NTA1210
- Updated at: 2026-05-31T15:38:53Z
- Closed at: 2026-05-29T01:29:26Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #21 / `T-A05`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #21 |
| Task ID | T-A05 |
| Title | Auth routes + controller (/api/v1/auth/*) |
| State | done |
| Local log path | `issues/by-github-id/#021-T-A05-Auth routes + controller (-api-v1-auth--).md` |

## Issue Body

## T-A05: Auth routes + controller (`/api/v1/auth/*`)

### Mục tiêu
Hoàn thành **Auth routes + controller (`/api/v1/auth/*`)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | A: Backend Core |
| Nhóm | A-Foundation |
| Owner gợi ý | Backend Dev |
| Estimate | 2h |
| Thời điểm dự kiến | Week 1 |
| Dependencies | `T-A03`, `T-A04` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Auth routes + controller (`/api/v1/auth/*`)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: 4 endpoints: register, login, refresh, logout.

### Acceptance Criteria
- [ ] 4 endpoints: register
- [ ] login
- [ ] refresh
- [ ] logout

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #21 for `T-A05`. Current source-of-truth status: **DONE**. Closed at: 2026-05-29T01:29:26Z. Local log: `issues/by-github-id/#021-T-A05-Auth routes + controller (-api-v1-auth--).md`.
