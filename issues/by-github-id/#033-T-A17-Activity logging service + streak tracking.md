# T-A17: Activity logging service + streak tracking

## GitHub Link

- Issue: [#33](https://github.com/khovan123/philo-mind/issues/33)
- State: done
- Track: A - Backend Core
- Type: backend
- Priority: medium
- Milestone: Week 4
- Assignees: @NTA1210
- Updated at: 2026-06-03T10:50:31Z
- Closed at: 2026-06-03T10:50:31Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #33 / `T-A17`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field          | Value                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| GitHub issue   | #33                                                                            |
| Task ID        | T-A17                                                                          |
| Title          | Activity logging service + streak tracking                                     |
| State          | done                                                                           |
| Local log path | `issues/by-github-id/#033-T-A17-Activity logging service + streak tracking.md` |

## Issue Body

# T-A17: Activity logging service + streak tracking

## 1. Mục đích sản phẩm

Chức năng này dùng để ghi nhận hoạt động học tập để hiển thị tiến độ, streak, badge và thống kê cá nhân.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị         |
| ----------------- | --------------- |
| GitHub issue      | #33             |
| Track             | A: Backend Core |
| Nhóm              | A-Platform APIs |
| Loại việc         | backend         |
| Priority          | medium          |
| Owner gợi ý       | Backend Dev     |
| Assignee hiện tại | @NTA1210        |
| Estimate          | 3h              |
| Milestone         | Week 4          |
| Dependencies      | `T-A04`         |

## 3. Requirement cụ thể

- Endpoint base: `/api/v1/activity`. Nếu task cần nhiều action, dùng REST sub-route rõ nghĩa dưới base này.
- Input nhận từ `params`, `query`, `body` hoặc JWT user context; validate bằng schema trước khi vào service.
- Output thành công dùng dạng `{ success: true, data, meta? }`; lỗi dùng `{ success: false, error: { code, message, details? } }`.
- Các trường output tối thiểu phải đủ để frontend render trực tiếp các AC: 8 activity types; daily streak calc.
- Luồng tích hợp: route -> auth/role guard nếu cần -> validate -> controller -> service -> Prisma transaction/query -> response helper.

### API contract đề xuất

| Method | Endpoint                  | Input                                             | Output                                             |
| ------ | ------------------------- | ------------------------------------------------- | -------------------------------------------------- |
| POST   | `/api/v1/activity`        | body: { type, targetType?, targetId?, metadata? } | data: activity + recalculated streak               |
| GET    | `/api/v1/activity/me`     | query: { from, to, type? }                        | data: activity list + daily aggregates             |
| GET    | `/api/v1/activity/streak` | auth user                                         | data: currentStreak, longestStreak, lastActiveDate |

## 4. Flow tích hợp

- Dependency trước khi tích hợp: `T-A04`.
- Consumer chính là frontend API client/store hoặc test suite tương ứng; contract phải đủ ổn định để consumer không đoán field.
- Nếu endpoint cần quyền user/admin, flow phải bắt đầu từ JWT auth middleware và trả 401/403 nhất quán.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #33.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Client gọi endpoint dưới `/api/v1/activity` với input hợp lệ thì nhận response thành công đủ dữ liệu để render hoặc lưu state.
- Input thiếu/sai kiểu/không đủ quyền phải trả lỗi chuẩn, không crash server và không ghi dữ liệu dở dang.
- Service phải xử lý edge case chính: record không tồn tại, duplicate khi có unique constraint, pagination/filter rỗng, quyền user/admin.
- Output cần expose field trực tiếp phục vụ AC: 8 activity types, daily streak calc.

## 6. Acceptance Criteria chi tiết

- [ ] 8 activity types: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] daily streak calc: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát module hiện có và bám theo cấu trúc service/controller/routes/validator của repo.
- [ ] Triển khai đầy đủ scope **Activity logging service + streak tracking**; nối route hoặc middleware vào entrypoint thực tế.
- [ ] Bổ sung validation, xử lý lỗi và response format nhất quán với API hiện có.
- [ ] Thêm test hoặc smoke check cho happy path, lỗi đầu vào và quyền truy cập nếu có.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: 8 activity types, daily streak calc.

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #33 / `T-A17`, beyond implementation process notes.

### User-facing outcome

Người học nhận động lực quay lại app qua tiến độ, streak, badge, mini-game, thông báo và bảng xếp hạng.

### Inputs

- request params/query/body or user action relevant to this issue

### Expected output

- Một hoặc nhiều endpoint dưới `/api/v1/activity` hoạt động với request hợp lệ và trả response chuẩn `{ success, data, meta? }`.
- Validation trả lỗi rõ ràng khi thiếu field, sai kiểu, record không tồn tại hoặc user không đủ quyền.
- Dữ liệu được ghi/đọc qua Prisma đúng quan hệ schema, không tạo duplicate ngoài ý muốn và không trả field nhạy cảm.
- Frontend/test có thể dùng response ngay mà không phải đoán tên field hoặc tự tính business logic chính.

### Success state

- Client gọi `/api/v1/activity`, nhận HTTP 2xx với data đủ field để consumer render/lưu state.

### Empty/error/loading states

- 400 cho input sai shape hoặc thiếu field bắt buộc.
- 401/403 cho user chưa đăng nhập hoặc không đủ role.
- 404 cho record không tồn tại; 409 cho duplicate/constraint conflict khi phù hợp.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #33 and mention `T-A17`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #33 for `T-A17`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#033-T-A17-Activity logging service + streak tracking.md`.
