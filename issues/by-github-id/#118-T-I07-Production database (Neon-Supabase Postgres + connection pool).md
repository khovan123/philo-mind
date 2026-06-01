# T-I07: Production database (Neon/Supabase Postgres + connection pool)

## GitHub Link

- Issue: [#118](https://github.com/khovan123/philo-mind/issues/118)
- State: closed
- Track: I - DevOps & Deploy
- Type: devops
- Updated at: 2026-05-31T15:54:31Z

## T-I07: Production database (Neon/Supabase Postgres + connection pool)

### Mục tiêu

Hoàn thành **Production database (Neon/Supabase Postgres + connection pool)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| Track             | I: DevOps & Deployment        |
| Nhóm              | I-CI/CD                       |
| Owner gợi ý       | DevOps / Lead Dev             |
| Estimate          | 2h                            |
| Thời điểm dự kiến | Week 8                        |
| Dependencies      | Không có dependency bắt buộc. |

### Dependency Notes

Task có thể bắt đầu ngay. Nếu phát hiện dependency ngầm, cập nhật issue trước khi tiếp tục.

### Checklist triển khai

- [ ] Triển khai cấu hình **Production database (Neon/Supabase Postgres + connection pool)** theo convention hiện có của repo.
- [ ] Document các biến môi trường, prerequisite và lệnh chạy cần thiết; không commit secret.
- [ ] Thêm fail-fast check hoặc health check để lỗi cấu hình hiển thị rõ.
- [ ] Chạy smoke test trong môi trường local hoặc CI tương ứng và ghi lại kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: SSL, pgbouncer, backup schedule.

### Acceptance Criteria

- [ ] SSL
- [ ] pgbouncer
- [ ] backup schedule

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #118 / `T-I07`, beyond implementation process notes.

### User-facing outcome

Đầu ra là một phần tính năng hoàn chỉnh cho Production database (Neon/Supabase Postgres + connection pool), có hành vi quan sát được qua UI, API hoặc test.

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
- PR description must link issue #118 and mention `T-I07`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #118 for `T-I07`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T04:46:31Z. Local log: `issues/by-github-id/#118-T-I07-Production database (Neon-Supabase Postgres + connection pool).md`.
