# T-B04: Login screen UI (email/pass + validation + loading)

## GitHub Link

- Issue: [#42](https://github.com/khovan123/philo-mind/issues/42)
- State: done
- Track: B - Frontend Shell
- Type: frontend
- Priority: high
- Milestone: Week 2
- Assignees: @thuhataplamdev
- Updated at: 2026-06-01T05:31:30Z
- Closed at: 2026-05-31T20:56:19Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #42 / `T-B04`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #42 |
| Task ID | T-B04 |
| Title | Login screen UI (email/pass + validation + loading) |
| State | done |
| Local log path | `issues/by-github-id/#042-T-B04-Login screen UI (email-pass + validation + loading).md` |

## Issue Body

# T-B04: Login screen UI (email/pass + validation + loading)

## 1. Mục đích sản phẩm

Chức năng này dùng để xác thực người dùng để họ có thể đăng ký, đăng nhập, giữ phiên, refresh token và truy cập các tính năng cá nhân hóa của PhiloMind.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #42 |
| Track | B: Frontend Shell |
| Nhóm | B-Foundation |
| Loại việc | frontend |
| Priority | high |
| Owner gợi ý | Frontend Dev |
| Assignee hiện tại | @thuhataplamdev |
| Estimate | 3h |
| Milestone | Week 2 |
| Dependencies | `T-B02` |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/login` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua RTK Query API slice + Redux Toolkit store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Người dùng nhập email/password, bấm "Đăng nhập"; lỗi validation hiển thị ngay dưới input; submit thành công lưu token rồi điều hướng vào Home.
- CTA "Tạo tài khoản" phải điều hướng sang Register; link quên mật khẩu nếu chưa có backend thì để disabled/placeholder rõ ràng.

### UI/navigation contract đề xuất

| Tình huống | Người dùng thao tác | Kết quả bắt buộc |
| --- | --- | --- |
| Mở màn hình | User vào `/login` từ tab/card/link phù hợp | Render màn hình chính của Login screen UI (email/pass + validation + loading) |
| Submit login | Nhập email/password -> bấm "Đăng nhập" | Gọi auth store/API, lưu token, điều hướng `/(tabs)/home` |
| Mở đăng ký | Bấm "Tạo tài khoản" | Điều hướng `/register` |


## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-B02`.
- User mở màn hình qua route `/login`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #42.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/login` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] Glassmorphism: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] keyboard-aware: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Login screen UI (email/pass + validation + loading)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Glassmorphism, keyboard-aware.

## 8. Kiểm chứng bắt buộc

- [ ] Chạy lint/typecheck/test phù hợp với package bị thay đổi.
- [ ] Ghi rõ command đã chạy và kết quả trong PR.
- [ ] Kiểm tra không commit secret, file `.env` thật hoặc artifact local.
- [ ] Nếu thay đổi contract dùng chung, cập nhật consumer hoặc ghi rõ follow-up dependency.
- [ ] Với API: ghi sample request/response thực tế hoặc test assertion tương đương.
- [ ] Với UI: ghi route, thao tác click/chạm, màn hình mở ra và trạng thái sau thao tác.

## 9. Definition of Done

- [ ] Code/config đã commit trên branch riêng và mở PR liên kết issue này.
- [ ] PR mô tả phạm vi thay đổi, cách kiểm chứng và rủi ro còn lại.
- [ ] CI xanh hoặc PR ghi rõ blocker có thể tái hiện.
- [ ] Không còn TODO thuộc trực tiếp scope issue này.
- [ ] Nếu thay đổi contract dùng chung, đã cập nhật consumer hoặc tạo follow-up issue rõ ràng.

## 10. Ghi chú triển khai

- Tech stack: Express 5 + Prisma 7 + PostgreSQL cho backend; Expo 56 + React Native + Expo Router + Redux Toolkit + Redux Persist cho frontend.
- API base chuẩn: `/api/v1`.
- Response chuẩn: `{ success, data, meta? }` hoặc `{ success: false, error: { code, message, details? } }`.
- Tài liệu tham chiếu: `docs/project-context.md`, `docs/architecture.md`, `docs/task-breakdown.md`.

---

_Updated by BMAD PM requirements pass on 2026-05-31. Nội dung này thay thế mô tả task ngắn trước đó bằng requirement cụ thể hơn cho dev/review._

## Feature Output Contract

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #42 / `T-B04`, beyond implementation process notes.

### User-facing outcome

Người dùng có thể tạo tài khoản, đăng nhập, duy trì phiên, làm mới token và đăng xuất/khôi phục mật khẩu mà không mất dữ liệu học tập cá nhân.

### Inputs

- email
- password
- submit action
- auth API response

### Expected output

- Một màn hình/flow tại `/login` render được trạng thái loading, empty, error và success.
- Các CTA chính có hành động cụ thể: submit, mở detail, chuyển bước, quay lại list, hoặc mở link ngoài/nội bộ đúng route.
- State sau thao tác được cập nhật trong store/API cache để màn hình kế tiếp hiển thị đúng dữ liệu mới.
- Layout usable trên mobile, keyboard-aware khi có form, không có màn hình trắng hoặc nút bấm không phản hồi.

### Success state

- User thao tác trên `/login`, thấy dữ liệu/render đúng, CTA chính chuyển sang bước kế tiếp hoặc cập nhật UI ngay.

### Empty/error/loading states

- Loading: hiển thị skeleton/spinner và disable CTA gây duplicate submit.
- Empty: hiển thị thông báo ngắn + CTA hợp lý thay vì màn hình trắng.
- Error: hiển thị message có thể hành động, cho retry hoặc quay lại flow an toàn.

### Navigation and interaction

- "Đăng nhập" -> `/(tabs)/home` khi success.
- "Tạo tài khoản" -> `/register`.
- "Quên mật khẩu" -> `/forgot-password`.
### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #42 and mention `T-B04`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #42 for `T-B04`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#042-T-B04-Login screen UI (email-pass + validation + loading).md`.
