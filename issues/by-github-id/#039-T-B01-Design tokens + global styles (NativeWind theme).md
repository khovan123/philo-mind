# T-B01: Design tokens + global styles (NativeWind theme)

## GitHub Link

- Issue: [#39](https://github.com/khovan123/philo-mind/issues/39)
- State: closed
- Track: B - Frontend Shell
- Type: frontend
- Updated at: 2026-05-31T15:53:15Z

## T-B01: Design tokens + global styles (NativeWind theme)

### Mục tiêu
Hoàn thành **Design tokens + global styles (NativeWind theme)** theo contract và convention hiện có của PhiloMind, tạo đầu ra có thể review và tích hợp độc lập.

### Thông tin triển khai
| Thuộc tính | Giá trị |
| --- | --- |
| Track | B: Frontend Shell |
| Nhóm | B-Foundation |
| Owner gợi ý | Frontend Dev |
| Estimate | 3h |
| Thời điểm dự kiến | Week 1-2 |
| Dependencies | Không có dependency bắt buộc. |

### Dependency Notes
Task có thể bắt đầu ngay. Nếu phát hiện dependency ngầm, cập nhật issue trước khi tiếp tục.

### Checklist triển khai
- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Design tokens + global styles (NativeWind theme)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Colors, typography, spacing from DESIGN.md.

### Acceptance Criteria
- [ ] Colors
- [ ] typography
- [ ] spacing from DESIGN.md

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #39 / `T-B01`, beyond implementation process notes.

### User-facing outcome

Người dùng có thể tạo tài khoản, đăng nhập, duy trì phiên, làm mới token và đăng xuất/khôi phục mật khẩu mà không mất dữ liệu học tập cá nhân.

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
- PR description must link issue #39 and mention `T-B01`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-06-01: BMAD sprint-status sync checked GitHub issue #39 for `T-B01`. Current source-of-truth status: **DONE**. Closed at: 2026-05-30T03:40:26Z. Local log: `issues/by-github-id/#039-T-B01-Design tokens + global styles (NativeWind theme).md`.

