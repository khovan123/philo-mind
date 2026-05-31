# T-C02: Shared types: Topic, Lesson, Quiz

## GitHub Link

- Issue: [#56](https://github.com/khovan123/philo-mind/issues/56)
- State: done
- Track: C - Shared Types & Seed
- Type: seed-data
- Priority: high
- Milestone: Week 1
- Assignees: @Thienhoang78
- Updated at: 2026-05-31T15:39:29Z
- Closed at: 2026-05-30T17:37:45Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #56 / `T-C02`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #56 |
| Task ID | T-C02 |
| Title | Shared types: Topic, Lesson, Quiz |
| State | done |
| Local log path | `issues/by-github-id/#056-T-C02-Shared types- Topic, Lesson, Quiz.md` |

## Issue Body

## T-C02: Shared types: Topic, Lesson, Quiz

### Mục tiêu
Hoàn thành **Shared types: Topic, Lesson, Quiz** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | C: Shared Types & Seed Data |
| Nhóm | All |
| Owner gợi ý | Any Dev |
| Estimate | 2h |
| Thời điểm dự kiến | Week 1 |
| Dependencies | Không có dependency bắt buộc. |

### Dependency Notes
Task có thể bắt đầu ngay. Nếu phát hiện dependency ngầm, cập nhật issue trước khi tiếp tục.

### Checklist triển khai
- [ ] Triển khai artifact dùng chung cho **Shared types: Topic, Lesson, Quiz** tại package hoặc seed module phù hợp.
- [ ] Đảm bảo export/import rõ ràng để consumer dùng được mà không cần truy cập file nội bộ.
- [ ] Giữ enum, DTO hoặc seed data đồng bộ với schema và API contract hiện có.
- [ ] Chạy typecheck hoặc seed smoke check tương ứng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: `TopicDTO`, `LessonDTO`, `QuizAttemptDTO`.

### Acceptance Criteria
- [ ] `TopicDTO`
- [ ] `LessonDTO`
- [ ] `QuizAttemptDTO`

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #56 for `T-C02`. Current source-of-truth status: **DONE**. Closed at: 2026-05-30T17:37:45Z. Local log: `issues/by-github-id/#056-T-C02-Shared types- Topic, Lesson, Quiz.md`.
