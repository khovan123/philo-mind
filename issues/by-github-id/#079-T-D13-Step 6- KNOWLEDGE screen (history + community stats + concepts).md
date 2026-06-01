# T-D13: Step 6: KNOWLEDGE screen (history + community stats + concepts)

## GitHub Link

- Issue: [#79](https://github.com/khovan123/philo-mind/issues/79)
- State: open
- Track: D - Story Mode Engine
- Type: frontend
- Updated at: 2026-05-31T15:53:53Z

# T-D13: Step 6: KNOWLEDGE screen (history + community stats + concepts)

## 1. Mục đích sản phẩm

Chức năng này dùng để đưa người học đi qua story mode nhiều bước, từ bối cảnh, học khái niệm, ra quyết định, xem hệ quả đến phản tư.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #79 |
| Track | D: Story Mode Engine |
| Nhóm | D-Frontend |
| Loại việc | frontend |
| Priority | medium |
| Owner gợi ý | Fullstack Dev |
| Assignee hiện tại | @dklinh05 |
| Estimate | 4h |
| Milestone | Week 6 |
| Dependencies | `T-D07` |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/story/[id]/knowledge` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua API client/Zustand store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Card/CTA story phải điều hướng đúng chuỗi: list -> intro -> learn -> dilemma/choose -> result -> knowledge -> reflect -> list/profile progress.
- Các nút tiếp tục/quay lại phải giữ sessionId/current story trong store để không mất tiến trình giữa các bước.

### UI/navigation contract đề xuất

| Tình huống | Người dùng thao tác | Kết quả bắt buộc |
| --- | --- | --- |
| Mở màn hình | User vào `/story/[id]/knowledge` từ tab/card/link phù hợp | Render màn hình chính của Step 6: KNOWLEDGE screen (history + community stats + concepts) |
| Bắt đầu/tiếp tục | Bấm story card hoặc CTA tiếp tục | Điều hướng đúng step kế tiếp, giữ storyId/sessionId |
| Qua bước kế tiếp | Bấm CTA chính của step | Điều hướng theo chain story mode: list -> intro -> learn -> choose -> result -> knowledge -> reflect |


## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-D07`.
- User mở màn hình qua route `/story/[id]/knowledge`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #79.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/story/[id]/knowledge` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] Animated bar chart: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] replay comparison: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Step 6: KNOWLEDGE screen (history + community stats + concepts)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Animated bar chart, replay comparison.

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

- Tech stack: Express 5 + Prisma 7 + PostgreSQL cho backend; Expo 56 + React Native + Expo Router + Zustand cho frontend.
- API base chuẩn: `/api/v1`.
- Response chuẩn: `{ success, data, meta? }` hoặc `{ success: false, error: { code, message, details? } }`.
- Tài liệu tham chiếu: `docs/project-context.md`, `docs/architecture.md`, `docs/task-breakdown.md`.

---

_Updated by BMAD PM requirements pass on 2026-05-31. Nội dung này thay thế mô tả task ngắn trước đó bằng requirement cụ thể hơn cho dev/review._

## Feature Output Contract

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #79 / `T-D13`, beyond implementation process notes.

### User-facing outcome

Người học đi qua story mode nhiều bước: hiểu bối cảnh, học khái niệm, chọn quyết định, xem hệ quả, so sánh cộng đồng và phản tư.

### Inputs

- storyId
- sessionId
- choiceId
- reasoning
- timeSpentSeconds

### Expected output

- Một màn hình/flow tại `/story/[id]/knowledge` render được trạng thái loading, empty, error và success.
- Các CTA chính có hành động cụ thể: submit, mở detail, chuyển bước, quay lại list, hoặc mở link ngoài/nội bộ đúng route.
- State sau thao tác được cập nhật trong store/API cache để màn hình kế tiếp hiển thị đúng dữ liệu mới.
- Layout usable trên mobile, keyboard-aware khi có form, không có màn hình trắng hoặc nút bấm không phản hồi.

### Success state

- User thao tác trên `/story/[id]/knowledge`, thấy dữ liệu/render đúng, CTA chính chuyển sang bước kế tiếp hoặc cập nhật UI ngay.

### Empty/error/loading states

- Loading: hiển thị skeleton/spinner và disable CTA gây duplicate submit.
- Empty: hiển thị thông báo ngắn + CTA hợp lý thay vì màn hình trắng.
- Error: hiển thị message có thể hành động, cho retry hoặc quay lại flow an toàn.

### Navigation and interaction

- Story list -> intro -> learn -> dilemma/choose -> result -> knowledge -> reflect.
- Back/continue giữ `storyId` và `sessionId`.
### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #79 and mention `T-D13`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-06-01: BMAD sprint-status sync checked GitHub issue #79 for `T-D13`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#079-T-D13-Step 6- KNOWLEDGE screen (history + community stats + concepts).md`.

