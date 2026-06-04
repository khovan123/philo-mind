# T-B14: Onboarding flow (welcome + how-it-works + interest picker)

## GitHub Link

- Issue: [#52](https://github.com/khovan123/philo-mind/issues/52)
- State: done
- Track: B - Frontend Shell
- Type: frontend
- Priority: medium
- Milestone: Week 4
- Assignees: @anhthungye
- Updated at: 2026-06-01T05:31:20Z
- Closed at: 2026-05-31T02:49:59Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #52 / `T-B14`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field          | Value                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------- |
| GitHub issue   | #52                                                                                            |
| Task ID        | T-B14                                                                                          |
| Title          | Onboarding flow (welcome + how-it-works + interest picker)                                     |
| State          | done                                                                                           |
| Local log path | `issues/by-github-id/#052-T-B14-Onboarding flow (welcome + how-it-works + interest picker).md` |

## Issue Body

## T-B14: Onboarding flow (welcome + how-it-works + interest picker)

### Mục tiêu

Hoàn thành **Onboarding flow (welcome + how-it-works + interest picker)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị           |
| ----------------- | ----------------- |
| Track             | B: Frontend Shell |
| Nhóm              | B-Main Screens    |
| Owner gợi ý       | Frontend Dev      |
| Estimate          | 4h                |
| Thời điểm dự kiến | Week 7            |
| Dependencies      | `T-B08`           |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Onboarding flow (welcome + how-it-works + interest picker)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: 3 steps, skip option, first-launch flag.

### Acceptance Criteria

- [ ] 3 steps
- [ ] skip option
- [ ] first-launch flag

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #52 / `T-B14`, beyond implementation process notes.

### User-facing outcome

Đầu ra là một phần tính năng hoàn chỉnh cho Onboarding flow (welcome + how-it-works + interest picker), có hành vi quan sát được qua UI, API hoặc test.

### Inputs

- request params/query/body or user action relevant to this issue

### Expected output

- Một màn hình/flow tại `/` render được trạng thái loading, empty, error và success.
- Các CTA chính có hành động cụ thể: submit, mở detail, chuyển bước, quay lại list, hoặc mở link ngoài/nội bộ đúng route.
- State sau thao tác được cập nhật trong store/API cache để màn hình kế tiếp hiển thị đúng dữ liệu mới.
- Layout usable trên mobile, keyboard-aware khi có form, không có màn hình trắng hoặc nút bấm không phản hồi.

### Success state

- User thao tác trên `/`, thấy dữ liệu/render đúng, CTA chính chuyển sang bước kế tiếp hoặc cập nhật UI ngay.

### Empty/error/loading states

- Loading: hiển thị skeleton/spinner và disable CTA gây duplicate submit.
- Empty: hiển thị thông báo ngắn + CTA hợp lý thay vì màn hình trắng.
- Error: hiển thị message có thể hành động, cho retry hoặc quay lại flow an toàn.

### Navigation and interaction

- Primary CTA trên `/` phải dẫn tới detail, submit hoặc bước kế tiếp rõ ràng.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #52 and mention `T-B14`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #52 for `T-B14`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T02:49:59Z. Local log: `issues/by-github-id/#052-T-B14-Onboarding flow (welcome + how-it-works + interest picker).md`.
