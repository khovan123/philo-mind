# T-K04: Delete account API + confirmation flow

## GitHub Link

- Issue: [#127](https://github.com/khovan123/philo-mind/issues/127)
- State: closed
- Track: K - Admin & Settings
- Type: fullstack
- Updated at: 2026-05-31T15:54:40Z

## T-K04: Delete account API + confirmation flow

### Mục tiêu

Hoàn thành **Delete account API + confirmation flow** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai

| Thuộc tính        | Giá trị             |
| ----------------- | ------------------- |
| Track             | K: Admin & Settings |
| Nhóm              | All                 |
| Owner gợi ý       | Frontend Dev        |
| Estimate          | 2h                  |
| Thời điểm dự kiến | Week 7              |
| Dependencies      | `T-A04`             |

### Dependency Notes

Chỉ bắt đầu integration sau khi các dependency trên đã merge hoặc có contract/mock được thống nhất.

### Checklist triển khai

- [ ] Triển khai end-to-end scope **Delete account API + confirmation flow** theo cấu trúc hiện có của repo.
- [ ] Cập nhật API contract, frontend integration và state/error handling liên quan.
- [ ] Bổ sung migration hoặc type changes nếu feature yêu cầu.
- [ ] Chạy smoke test cho luồng người dùng hoàn chỉnh và ghi lại kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Soft delete, 30-day grace, confirmation modal.

### Acceptance Criteria

- [ ] Soft delete
- [ ] 30-day grace
- [ ] confirmation modal

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #127 / `T-K04`, beyond implementation process notes.

### User-facing outcome

Người dùng quản lý hồ sơ, cài đặt, pháp lý và quyền riêng tư/tài khoản của mình trong app.

### Inputs

- request params/query/body or user action relevant to this issue

### Expected output

- Backend expose API dưới `/api/v1/account`, frontend gọi API đó từ route `/delete-account`.
- Người dùng hoàn thành được flow end-to-end từ màn hình vào form/action tới response thành công/lỗi rõ ràng.
- API contract và UI state thống nhất: field nào backend trả thì frontend render trực tiếp field đó.
- Nếu dependency chưa xong, có adapter/mock cùng shape và ghi rõ điểm thay bằng API thật.

### Success state

- User thao tác trên `/delete-account`, thấy dữ liệu/render đúng, CTA chính chuyển sang bước kế tiếp hoặc cập nhật UI ngay.

### Empty/error/loading states

- Loading: hiển thị skeleton/spinner và disable CTA gây duplicate submit.
- Empty: hiển thị thông báo ngắn + CTA hợp lý thay vì màn hình trắng.
- Error: hiển thị message có thể hành động, cho retry hoặc quay lại flow an toàn.

### Navigation and interaction

- Primary CTA trên `/delete-account` phải dẫn tới detail, submit hoặc bước kế tiếp rõ ràng.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #127 and mention `T-K04`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #127 for `T-K04`. Current source-of-truth status: **DONE**. Closed at: 2026-05-31T11:57:39Z. Local log: `issues/by-github-id/#127-T-K04-Delete account API + confirmation flow.md`.
