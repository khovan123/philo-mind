# T-K02: Forgot/Reset password API + screen (email OTP flow)

## GitHub Link

- Issue: [#125](https://github.com/khovan123/philo-mind/issues/125)
- State: done
- Track: K - Admin & Settings
- Type: fullstack
- Priority: medium
- Milestone: Week 7
- Assignees: @NguyenDat204
- Updated at: 2026-05-31T15:40:36Z
- Closed at: 2026-05-31T11:57:38Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #125 / `T-K02`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #125 |
| Task ID | T-K02 |
| Title | Forgot/Reset password API + screen (email OTP flow) |
| State | done |
| Local log path | `issues/by-github-id/#125-T-K02-Forgot-Reset password API + screen (email OTP flow).md` |

## Issue Body

## T-K02: Forgot/Reset password API + screen (email OTP flow)

### Mục tiêu
Hoàn thành **Forgot/Reset password API + screen (email OTP flow)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | K: Admin & Settings |
| Nhóm | All |
| Owner gợi ý | Frontend Dev |
| Estimate | 3h |
| Thời điểm dự kiến | Week 7 |
| Dependencies | `T-A03` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Triển khai end-to-end scope **Forgot/Reset password API + screen (email OTP flow)** theo cấu trúc hiện có của repo.
- [ ] Cập nhật API contract, frontend integration và state/error handling liên quan.
- [ ] Bổ sung migration hoặc type changes nếu feature yêu cầu.
- [ ] Chạy smoke test cho luồng người dùng hoàn chỉnh và ghi lại kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Send OTP → verify → new password, rate limit.

### Acceptance Criteria
- [ ] Send OTP → verify → new password
- [ ] rate limit

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #125 for `T-K02`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T11:57:38Z. Local log: `issues/by-github-id/#125-T-K02-Forgot-Reset password API + screen (email OTP flow).md`.
