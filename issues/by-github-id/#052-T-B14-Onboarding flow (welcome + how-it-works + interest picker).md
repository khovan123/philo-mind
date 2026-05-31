# T-B14: Onboarding flow (welcome + how-it-works + interest picker)

## GitHub Link

- Issue: [#52](https://github.com/khovan123/philo-mind/issues/52)
- State: done
- Track: B - Frontend Shell
- Type: frontend
- Priority: medium
- Milestone: Week 4
- Assignees: @anhthungye
- Updated at: 2026-05-31T15:39:25Z
- Closed at: 2026-05-31T02:49:59Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #52 / `T-B14`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #52 |
| Task ID | T-B14 |
| Title | Onboarding flow (welcome + how-it-works + interest picker) |
| State | done |
| Local log path | `issues/by-github-id/#052-T-B14-Onboarding flow (welcome + how-it-works + interest picker).md` |

## Issue Body

## T-B14: Onboarding flow (welcome + how-it-works + interest picker)

### Mục tiêu
Hoàn thành **Onboarding flow (welcome + how-it-works + interest picker)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | B: Frontend Shell |
| Nhóm | B-Main Screens |
| Owner gợi ý | Frontend Dev |
| Estimate | 4h |
| Thời điểm dự kiến | Week 7 |
| Dependencies | `T-B08` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Onboarding flow (welcome + how-it-works + interest picker)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: 3 steps, skip option, first-launch flag.

### Acceptance Criteria
- [ ] 3 steps
- [ ] skip option
- [ ] first-launch flag

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #52 for `T-B14`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T02:49:59Z. Local log: `issues/by-github-id/#052-T-B14-Onboarding flow (welcome + how-it-works + interest picker).md`.
