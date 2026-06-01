# T-I05: EAS Build config (iOS + Android preview + production)

## GitHub Link

- Issue: [#116](https://github.com/khovan123/philo-mind/issues/116)
- State: closed
- Track: I - DevOps & Deploy
- Type: devops
- Updated at: 2026-05-31T15:54:29Z

## T-I05: EAS Build config (iOS + Android preview + production)

### Mục tiêu

Hoàn thành **EAS Build config (iOS + Android preview + production)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| Track             | I: DevOps & Deployment        |
| Nhóm              | I-CI/CD                       |
| Owner gợi ý       | DevOps / Lead Dev             |
| Estimate          | 3h                            |
| Thời điểm dự kiến | Week 8                        |
| Dependencies      | Không có dependency bắt buộc. |

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

## Feature Output Contract

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #116 / `T-I05`, beyond implementation process notes.

### User-facing outcome

Đầu ra là một phần tính năng hoàn chỉnh cho EAS Build config (iOS + Android preview + production), có hành vi quan sát được qua UI, API hoặc test.

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
- PR description must link issue #116 and mention `T-I05`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #116 for `T-I05`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T07:51:19Z. Local log: `issues/by-github-id/#116-T-I05-EAS Build config (iOS + Android preview + production).md`.
