# T-C03: Shared types: Story, Session, Consequence

## GitHub Link

- Issue: [#57](https://github.com/khovan123/philo-mind/issues/57)
- State: closed
- Track: C - Shared Types & Seed
- Type: seed-data
- Updated at: 2026-05-31T15:53:32Z

## T-C03: Shared types: Story, Session, Consequence

### Mục tiêu
Hoàn thành **Shared types: Story, Session, Consequence** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

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
- [ ] Triển khai artifact dùng chung cho **Shared types: Story, Session, Consequence** tại package hoặc seed module phù hợp.
- [ ] Đảm bảo export/import rõ ràng để consumer dùng được mà không cần truy cập file nội bộ.
- [ ] Giữ enum, DTO hoặc seed data đồng bộ với schema và API contract hiện có.
- [ ] Chạy typecheck hoặc seed smoke check tương ứng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: `StoryScenarioDTO`, `StorySessionDTO`, `AnalysisTabDTO`.

### Acceptance Criteria
- [ ] `StoryScenarioDTO`
- [ ] `StorySessionDTO`
- [ ] `AnalysisTabDTO`

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #57 / `T-C03`, beyond implementation process notes.

### User-facing outcome

Người học đi qua story mode nhiều bước: hiểu bối cảnh, học khái niệm, chọn quyết định, xem hệ quả, so sánh cộng đồng và phản tư.

### Inputs

- storyId
- sessionId
- choiceId
- reasoning
- timeSpentSeconds

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
- PR description must link issue #57 and mention `T-C03`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-06-01: BMAD sprint-status sync checked GitHub issue #57 for `T-C03`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T07:40:17Z. Local log: `issues/by-github-id/#057-T-C03-Shared types- Story, Session, Consequence.md`.

