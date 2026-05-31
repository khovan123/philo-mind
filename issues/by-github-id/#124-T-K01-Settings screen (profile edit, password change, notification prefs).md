# T-K01: Settings screen (profile edit, password change, notification prefs)

## GitHub Link

- Issue: [#124](https://github.com/khovan123/philo-mind/issues/124)
- State: done
- Track: K - Admin & Settings
- Type: frontend
- Priority: medium
- Milestone: Week 7
- Assignees: @NguyenDat204
- Updated at: 2026-05-31T15:40:35Z
- Closed at: 2026-05-31T12:54:09Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #124 / `T-K01`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #124 |
| Task ID | T-K01 |
| Title | Settings screen (profile edit, password change, notification prefs) |
| State | done |
| Local log path | `issues/by-github-id/#124-T-K01-Settings screen (profile edit, password change, notification prefs).md` |

## Issue Body

## T-K01: Settings screen (profile edit, password change, notification prefs)

### Mục tiêu
Hoàn thành **Settings screen (profile edit, password change, notification prefs)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | K: Admin & Settings |
| Nhóm | All |
| Owner gợi ý | Frontend Dev |
| Estimate | 4h |
| Thời điểm dự kiến | Week 7 |
| Dependencies | `T-B16`, `T-A05` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Settings screen (profile edit, password change, notification prefs)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Form validation, avatar upload, password rules.

### Acceptance Criteria
- [ ] Form validation
- [ ] avatar upload
- [ ] password rules

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #124 for `T-K01`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T12:54:09Z. Local log: `issues/by-github-id/#124-T-K01-Settings screen (profile edit, password change, notification prefs).md`.
