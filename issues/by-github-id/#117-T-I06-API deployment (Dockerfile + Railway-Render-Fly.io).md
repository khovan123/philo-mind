# T-I06: API deployment (Dockerfile + Railway/Render/Fly.io)

## GitHub Link

- Issue: [#117](https://github.com/khovan123/philo-mind/issues/117)
- State: closed
- Track: I - DevOps & Deploy
- Type: devops
- Updated at: 2026-05-31T15:54:30Z

## T-I06: API deployment (Dockerfile + Railway/Render/Fly.io)

### Mục tiêu
Hoàn thành **API deployment (Dockerfile + Railway/Render/Fly.io)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | I: DevOps & Deployment |
| Nhóm | I-CI/CD |
| Owner gợi ý | DevOps / Lead Dev |
| Estimate | 3h |
| Thời điểm dự kiến | Week 8 |
| Dependencies | `T-I01` |

### Dependency Notes
Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai
- [ ] Triển khai cấu hình **API deployment (Dockerfile + Railway/Render/Fly.io)** theo convention hiện có của repo.
- [ ] Document các biến môi trường, prerequisite và lệnh chạy cần thiết; không commit secret.
- [ ] Thêm fail-fast check hoặc health check để lỗi cấu hình hiển thị rõ.
- [ ] Chạy smoke test trong môi trường local hoặc CI tương ứng và ghi lại kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Multi-stage build, health endpoint, env injection.

### Acceptance Criteria
- [ ] Multi-stage build
- [ ] health endpoint
- [ ] env injection

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #117 / `T-I06`, beyond implementation process notes.

### User-facing outcome

Người học trò chuyện với nhân vật triết học AI theo ngữ cảnh học tập, có phản hồi an toàn, streaming và lịch sử hội thoại.

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
- PR description must link issue #117 and mention `T-I06`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-06-01: BMAD sprint-status sync checked GitHub issue #117 for `T-I06`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T04:23:45Z. Local log: `issues/by-github-id/#117-T-I06-API deployment (Dockerfile + Railway-Render-Fly.io).md`.

