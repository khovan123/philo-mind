# T-D02: Story Scenario API (list with filters + detail with learn cards)

## GitHub Link

- Issue: [#68](https://github.com/khovan123/philo-mind/issues/68)
- State: done
- Track: D - Story Mode Engine
- Type: backend
- Priority: high
- Milestone: Week 3
- Assignees: @dklinh05
- Updated at: 2026-05-31T15:39:41Z
- Closed at: 2026-05-31T13:23:09Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #68 / `T-D02`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #68 |
| Task ID | T-D02 |
| Title | Story Scenario API (list with filters + detail with learn cards) |
| State | done |
| Local log path | `issues/by-github-id/#068-T-D02-Story Scenario API (list with filters + detail with learn cards).md` |

## Issue Body

## T-D02: Story Scenario API (list with filters + detail with learn cards)

### Mục tiêu
Hoàn thành **Story Scenario API (list with filters + detail with learn cards)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | D: Story Mode Engine |
| Nhóm | D-Backend |
| Owner gợi ý | Fullstack Dev |
| Estimate | 5h |
| Thời điểm dự kiến | Week 3 |
| Dependencies | `T-D01`, `T-A04` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Story Scenario API (list with filters + detail with learn cards)**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Paginated, include topic/choices/stats.

### Acceptance Criteria
- [ ] Paginated
- [ ] include topic/choices/stats

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #68 for `T-D02`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T13:23:09Z. Local log: `issues/by-github-id/#068-T-D02-Story Scenario API (list with filters + detail with learn cards).md`.
