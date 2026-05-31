# T-A13: Mindmap Node/Edge API

## GitHub Link

- Issue: [#29](https://github.com/khovan123/philo-mind/issues/29)
- State: done
- Track: A - Backend Core
- Type: backend
- Priority: medium
- Milestone: Week 4
- Assignees: @linhtv1209-fudn
- Updated at: 2026-05-31T15:39:01Z
- Closed at: 2026-05-31T05:41:51Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #29 / `T-A13`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #29 |
| Task ID | T-A13 |
| Title | Mindmap Node/Edge API |
| State | done |
| Local log path | `issues/by-github-id/#029-T-A13-Mindmap Node-Edge API.md` |

## Issue Body

## T-A13: Mindmap Node/Edge API

### Mục tiêu
Hoàn thành **Mindmap Node/Edge API** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | A: Backend Core |
| Nhóm | A-Advanced APIs |
| Owner gợi ý | Backend Dev |
| Estimate | 4h |
| Thời điểm dự kiến | Week 3 |
| Dependencies | `T-A04` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Mindmap Node/Edge API**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Graph data by topic, cascade delete.

### Acceptance Criteria
- [ ] Graph data by topic
- [ ] cascade delete

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #29 for `T-A13`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T05:41:51Z. Local log: `issues/by-github-id/#029-T-A13-Mindmap Node-Edge API.md`.
