# T-I05: EAS Build config (iOS + Android preview + production)

## GitHub Link

- Issue: [#116](https://github.com/khovan123/philo-mind/issues/116)
- State: done
- Track: I - DevOps & Deploy
- Type: devops
- Priority: medium
- Milestone: Week 8
- Assignees: @khovan123
- Updated at: 2026-05-31T15:40:27Z
- Closed at: 2026-05-31T07:51:19Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #116 / `T-I05`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #116 |
| Task ID | T-I05 |
| Title | EAS Build config (iOS + Android preview + production) |
| State | done |
| Local log path | `issues/by-github-id/#116-T-I05-EAS Build config (iOS + Android preview + production).md` |

## Issue Body

## T-I05: EAS Build config (iOS + Android preview + production)

### Mục tiêu
Hoàn thành **EAS Build config (iOS + Android preview + production)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | I: DevOps & Deployment |
| Nhóm | I-CI/CD |
| Owner gợi ý | DevOps / Lead Dev |
| Estimate | 3h |
| Thời điểm dự kiến | Week 8 |
| Dependencies | Không có dependency bắt buộc. |

### Dependency Notes
Task có thể bắt đầu ngay. Nếu phát hiện dependency ngầm, cập nhật issue trước khi tiếp tục.

### Checklist triển khai
- [ ] Triển khai cấu hình **EAS Build config (iOS + Android preview + production)** theo convention hiện có của repo.
- [ ] Document các biến môi trường, prerequisite và lệnh chạy cần thiết; không commit secret.
- [ ] Thêm fail-fast check hoặc health check để lỗi cấu hình hiển thị rõ.
- [ ] Chạy smoke test trong môi trường local hoặc CI tương ứng và ghi lại kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: `eas.json`, signing, OTA updates.

### Acceptance Criteria
- [ ] `eas.json`
- [ ] signing
- [ ] OTA updates

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #116 for `T-I05`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T07:51:19Z. Local log: `issues/by-github-id/#116-T-I05-EAS Build config (iOS + Android preview + production).md`.
