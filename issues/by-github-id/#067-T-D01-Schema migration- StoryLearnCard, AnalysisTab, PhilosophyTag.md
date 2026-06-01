# T-D01: Schema migration: StoryLearnCard, AnalysisTab, PhilosophyTag

## GitHub Link

- Issue: [#67](https://github.com/khovan123/philo-mind/issues/67)
- State: closed
- Track: D - Story Mode Engine
- Type: fullstack
- Updated at: 2026-05-31T15:53:42Z

## T-D01: Schema migration: StoryLearnCard, AnalysisTab, PhilosophyTag

### Mục tiêu

Hoàn thành **Schema migration: StoryLearnCard, AnalysisTab, PhilosophyTag** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| Track             | D: Story Mode Engine          |
| Nhóm              | D-Backend                     |
| Owner gợi ý       | Fullstack Dev                 |
| Estimate          | 2h                            |
| Thời điểm dự kiến | Week 3                        |
| Dependencies      | Không có dependency bắt buộc. |

### Dependency Notes

Task có thể bắt đầu ngay. Nếu phát hiện dependency ngầm, cập nhật issue trước khi tiếp tục.

### Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Schema migration: StoryLearnCard, AnalysisTab, PhilosophyTag**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: New models + enum, clean migration.

### Acceptance Criteria

- [ ] New models + enum
- [ ] clean migration

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #67 / `T-D01`, beyond implementation process notes.

### User-facing outcome

Người học đi qua story mode nhiều bước: hiểu bối cảnh, học khái niệm, chọn quyết định, xem hệ quả, so sánh cộng đồng và phản tư.

### Inputs

- storyId
- sessionId
- choiceId
- reasoning
- timeSpentSeconds

### Expected output

- Backend expose API dưới `/api/v1/stories`, frontend gọi API đó từ route `/story/[id]/learn`.
- Người dùng hoàn thành được flow end-to-end từ màn hình vào form/action tới response thành công/lỗi rõ ràng.
- API contract và UI state thống nhất: field nào backend trả thì frontend render trực tiếp field đó.
- Nếu dependency chưa xong, có adapter/mock cùng shape và ghi rõ điểm thay bằng API thật.

### Success state

- User thao tác trên `/story/[id]/learn`, thấy dữ liệu/render đúng, CTA chính chuyển sang bước kế tiếp hoặc cập nhật UI ngay.

### Empty/error/loading states

- Loading: hiển thị skeleton/spinner và disable CTA gây duplicate submit.
- Empty: hiển thị thông báo ngắn + CTA hợp lý thay vì màn hình trắng.
- Error: hiển thị message có thể hành động, cho retry hoặc quay lại flow an toàn.

### Navigation and interaction

- Story list -> intro -> learn -> dilemma/choose -> result -> knowledge -> reflect.
- Back/continue giữ `storyId` và `sessionId`.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #67 and mention `T-D01`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #67 for `T-D01`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T09:51:43Z. Local log: `issues/by-github-id/#067-T-D01-Schema migration- StoryLearnCard, AnalysisTab, PhilosophyTag.md`.
