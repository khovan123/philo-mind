# T-J04: Frontend component tests (RTL: Card, Quiz, Chat)

## GitHub Link

- Issue: [#122](https://github.com/khovan123/philo-mind/issues/122)
- State: open
- Track: J - Testing
- Type: testing
- Priority: medium
- Milestone: Week 7
- Assignees: @NguyenDat204
- Updated at: 2026-05-31T15:40:32Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #122 / `T-J04`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #122 |
| Task ID | T-J04 |
| Title | Frontend component tests (RTL: Card, Quiz, Chat) |
| State | open |
| Local log path | `issues/by-github-id/#122-T-J04-Frontend component tests (RTL- Card, Quiz, Chat).md` |

## Issue Body

# T-J04: Frontend component tests (RTL: Card, Quiz, Chat)

## 1. Mục đích sản phẩm

Chức năng này dùng để giúp người học đọc bài, trả lời quiz hoặc phản hồi micro-lesson và lưu lại tiến độ học.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #122 |
| Track | J: Testing |
| Nhóm | All |
| Loại việc | testing |
| Priority | medium |
| Owner gợi ý | Any Dev |
| Assignee hiện tại | @NguyenDat204 |
| Estimate | 4h |
| Milestone | Week 7 |
| Dependencies | `T-B02` |

## 3. Requirement cụ thể

- Test phải chạy bằng command repo/package tương ứng và không yêu cầu secret thật.
- Scope test bao phủ: Render; interaction; snapshot tests.
- Fixture phải deterministic; mock network/Prisma/external service khi flow không cần integration thật.
- Output mong muốn là suite fail khi chức năng vỡ và pass ổn định trong CI.


## 4. Flow tích hợp

- Test suite phải chạy sau khi dependency `T-B02` có contract ổn định.
- Flow kiểm thử nên mô phỏng hành vi người dùng/API thật thay vì chỉ snapshot implementation detail.
- CI phải fail khi critical path bị regression.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #122.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy test suite và thấy test fail nếu flow chính bị phá vỡ.
- Test mô phỏng input/output hoặc thao tác người dùng thật ở mức phù hợp.
- Test log/CI output đủ rõ để biết lỗi nằm ở validation, API contract, UI render hay navigation.

## 6. Acceptance Criteria chi tiết

- [ ] Render: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] interaction: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] snapshot tests: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Bổ sung test suite cho **Frontend component tests (RTL: Card, Quiz, Chat components)** theo runner hiện có của repo.
- [ ] Bao phủ happy path, validation failure và edge case quan trọng được nêu trong acceptance criteria.
- [ ] Giữ fixture deterministic; không phụ thuộc network hoặc secret ngoài nếu không cần thiết.
- [ ] Chạy test suite liên quan và ghi command cùng kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Render, interaction, snapshot tests.

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #122 for `T-J04`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#122-T-J04-Frontend component tests (RTL- Card, Quiz, Chat).md`.
