# T-B10: Explore screen (topic grid + search + category filter)

## GitHub Link

- Issue: [#48](https://github.com/khovan123/philo-mind/issues/48)
- State: open
- Track: B - Frontend Shell
- Type: frontend
- Priority: medium
- Milestone: Week 3
- Assignees: @anhthungye
- Updated at: 2026-05-31T15:39:21Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #48 / `T-B10`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #48 |
| Task ID | T-B10 |
| Title | Explore screen (topic grid + search + category filter) |
| State | open |
| Local log path | `issues/by-github-id/#048-T-B10-Explore screen (topic grid + search + category filter).md` |

## Issue Body

# T-B10: Explore screen (topic grid + search + category filter)

## 1. Mục đích sản phẩm

Chức năng này dùng để giúp người học duyệt, tìm kiếm và mở đúng chủ đề triết học theo danh mục, độ khó và nhu cầu học hiện tại.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #48 |
| Track | B: Frontend Shell |
| Nhóm | B-Main Screens |
| Loại việc | frontend |
| Priority | medium |
| Owner gợi ý | Frontend Dev |
| Assignee hiện tại | @anhthungye |
| Estimate | 4h |
| Milestone | Week 3 |
| Dependencies | `T-B02` |

## 3. Requirement cụ thể

- Screen/route đề xuất: `/(tabs)/explore` theo Expo Router.
- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua API client/Zustand store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.
- Các action chính phải có CTA rõ ràng; click vào item liên quan điều hướng tới detail hoặc flow kế tiếp thay vì chỉ render card tĩnh.
- UI phải thể hiện trực tiếp các AC: Debounced search; skeleton loading.

### UI/navigation contract đề xuất

| Tình huống | Người dùng thao tác | Kết quả bắt buộc |
| --- | --- | --- |
| Mở màn hình | User vào `/(tabs)/explore` từ tab/card/link phù hợp | Render màn hình chính của Explore screen (topic grid + search + category filter) |
| Tìm kiếm/filter | Nhập keyword/chọn category/difficulty | Cập nhật topic grid, giữ query state |
| Mở topic | Bấm topic card | Điều hướng topic/lesson list hoặc detail đã định trong app |


## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-B02`.
- User mở màn hình qua route `/(tabs)/explore`; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #48.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại `/(tabs)/explore` từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] Debounced search: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] skeleton loading: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **Explore screen (topic grid + search + category filter)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Debounced search, skeleton loading.

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #48 for `T-B10`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#048-T-B10-Explore screen (topic grid + search + category filter).md`.
