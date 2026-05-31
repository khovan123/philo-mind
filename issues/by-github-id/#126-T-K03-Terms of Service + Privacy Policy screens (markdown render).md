# T-K03: Terms of Service + Privacy Policy screens (markdown render)

## GitHub Link

- Issue: [#126](https://github.com/khovan123/philo-mind/issues/126)
- State: open
- Track: K - Admin & Settings
- Type: frontend
- Priority: low
- Milestone: Week 7
- Assignees: @NguyenDat204
- Updated at: 2026-05-31T15:40:37Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #126 / `T-K03`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #126 |
| Task ID | T-K03 |
| Title | Terms of Service + Privacy Policy screens (markdown render) |
| State | open |
| Local log path | `issues/by-github-id/#126-T-K03-Terms of Service + Privacy Policy screens (markdown render).md` |

## Issue Body

# T-K03: Terms of Service + Privacy Policy screens (markdown render)

## 1. Mục đích sản phẩm

Chức năng này dùng để cho người dùng quản lý hồ sơ, xem thành tựu và truy cập các màn hình pháp lý/cài đặt cần thiết.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #126 |
| Track | K: Admin & Settings |
| Nhóm | All |
| Loại việc | frontend |
| Priority | low |
| Owner gợi ý | Frontend Dev |
| Assignee hiện tại | @NguyenDat204 |
| Estimate | 1h |
| Milestone | Week 7 |
| Dependencies | `T-B02` |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/settings/legal` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua API client/Zustand store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Từ Settings/Profile, click "Terms of Service" hoặc "Privacy Policy" mở màn hình markdown tương ứng.
- Các link nội bộ trong markdown cần gắn href/route hợp lệ; link ngoài mở bằng browser/linking API.

### UI/navigation contract đề xuất

| Tình huống | Người dùng thao tác | Kết quả bắt buộc |
| --- | --- | --- |
| Mở màn hình | User vào `/settings/legal` từ tab/card/link phù hợp | Render màn hình chính của Terms of Service + Privacy Policy screens (markdown render) |
| Mở legal page | Profile/Settings -> bấm Terms hoặc Privacy | Render markdown legal content |
| Mở link | Bấm href nội bộ/ngoài | Nội bộ điều hướng trong app, link ngoài mở browser |


## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-B02`.
- User mở màn hình qua route `/settings/legal`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #126.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/settings/legal` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] Static content: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] required for App Store: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Terms of Service + Privacy Policy screens (markdown render)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Static content, required for App Store.

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

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #126 for `T-K03`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#126-T-K03-Terms of Service + Privacy Policy screens (markdown render).md`.
