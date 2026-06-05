# T-C02: Shared types: Topic, Lesson, Quiz

## GitHub Link

- Issue: [#56](https://github.com/khovan123/philo-mind/issues/56)
- State: done
- Track: C - Shared Types & Seed
- Type: seed-data
- Priority: high
- Milestone: Week 1
- Assignees: @Thienhoang78
- Updated at: 2026-06-01T05:31:16Z
- Closed at: 2026-05-30T17:37:45Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #56 / `T-C02`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field          | Value                                                                 |
| -------------- | --------------------------------------------------------------------- |
| GitHub issue   | #56                                                                   |
| Task ID        | T-C02                                                                 |
| Title          | Shared types: Topic, Lesson, Quiz                                     |
| State          | done                                                                  |
| Local log path | `issues/by-github-id/#056-T-C02-Shared types- Topic, Lesson, Quiz.md` |

## Issue Body

## T-C02: Shared types: Topic, Lesson, Quiz

### Mục tiêu

Hoàn thành **Shared types: Topic, Lesson, Quiz** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| Track             | C: Shared Types & Seed Data   |
| Nhóm              | All                           |
| Owner gợi ý       | Any Dev                       |
| Estimate          | 2h                            |
| Thời điểm dự kiến | Week 1                        |
| Dependencies      | Không có dependency bắt buộc. |

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

## Feature Output Contract

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #56 / `T-C02`, beyond implementation process notes.

### User-facing outcome

Người học duyệt và mở đúng chủ đề triết học theo danh mục, độ khó, tìm kiếm và nội dung liên quan.

### Inputs

- page/limit
- search keyword
- category
- difficulty
- topicId when opening detail

### Expected output

- Seed runner tạo được record cha/con đúng thứ tự và id/slug ổn định cho demo/test.
- Nội dung user-facing có tiếng Việt đủ title, mô tả, body markdown hoặc metadata cần render.
- Chạy lại seed không tạo duplicate hoặc phá quan hệ hiện có.
- Các issue frontend/backend liên quan có thể dùng dữ liệu seed để kiểm thử flow thật.

### Success state

- Seed chạy xong và database có dữ liệu đúng quan hệ, app có thể mở demo content.

### Empty/error/loading states

- Mô tả rõ trạng thái rỗng, lỗi và retry/recovery tương ứng.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #56 and mention `T-C02`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #56 for `T-C02`. Current source-of-truth status: **DONE**. Closed at: 2026-05-30T17:37:45Z. Local log: `issues/by-github-id/#056-T-C02-Shared types- Topic, Lesson, Quiz.md`.
