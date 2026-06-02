# T-I03: Database migration CI (Prisma migrate + seed in pipeline)

## GitHub Link

- Issue: [#114](https://github.com/khovan123/philo-mind/issues/114)
- State: done
- Track: I - DevOps & Deploy
- Type: devops
- Priority: medium
- Milestone: Week 7
- Assignees: @khovan123
- Updated at: 2026-06-01T05:30:16Z
- Closed at: 2026-05-31T02:42:52Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #114 / `T-I03`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #114 |
| Task ID | T-I03 |
| Title | Database migration CI (Prisma migrate + seed in pipeline) |
| State | done |
| Local log path | `issues/by-github-id/#114-T-I03-Database migration CI (Prisma migrate + seed in pipeline).md` |

## Issue Body

## T-I03: Database migration CI (Prisma migrate + seed in pipeline)

### Mục tiêu
Hoàn thành **Database migration CI (Prisma migrate + seed in pipeline)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | I: DevOps & Deployment |
| Nhóm | I-CI/CD |
| Owner gợi ý | DevOps / Lead Dev |
| Estimate | 2h |
| Thời điểm dự kiến | Week 7 |
| Dependencies | `T-A22` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Triển khai cấu hình **Database migration CI (Prisma migrate + seed in pipeline)** theo convention hiện có của repo.
- [ ] Document các biến môi trường, prerequisite và lệnh chạy cần thiết; không commit secret.
- [ ] Thêm fail-fast check hoặc health check để lỗi cấu hình hiển thị rõ.
- [ ] Chạy smoke test trong môi trường local hoặc CI tương ứng và ghi lại kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Auto-migrate on deploy, rollback script.

### Acceptance Criteria
- [ ] Auto-migrate on deploy
- [ ] rollback script

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #114 / `T-I03`, beyond implementation process notes.

### User-facing outcome

Developer và app có contract/dữ liệu nền ổn định để các màn hình/API dùng chung không đoán field hoặc thiếu nội dung demo.

### Inputs

- env vars
- config files
- CI/deploy command
- service credentials via secrets

### Expected output

- Developer/CI/deploy có command hoặc config chạy được, tái lập được và có output quan sát được.
- Environment/config không chứa secret thật, có ví dụ rõ cho local và production.
- Failure mode có log đủ để biết thiếu env, lỗi build, lỗi migration hay lỗi service health.
- Kết quả cuối được liên kết với GitHub issue và có bằng chứng chạy thành công.

### Success state

- Command/build/deploy chạy thành công và có log/URL/status chứng minh kết quả.

### Empty/error/loading states

- Mô tả rõ trạng thái rỗng, lỗi và retry/recovery tương ứng.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #114 and mention `T-I03`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #114 for `T-I03`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T02:42:52Z. Local log: `issues/by-github-id/#114-T-I03-Database migration CI (Prisma migrate + seed in pipeline).md`.
