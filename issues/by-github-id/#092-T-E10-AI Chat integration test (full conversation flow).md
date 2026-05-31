# T-E10: AI Chat integration test (full conversation flow)

## GitHub Link

- Issue: [#92](https://github.com/khovan123/philo-mind/issues/92)
- State: open
- Track: E - AI & Chat System
- Type: testing
- Priority: medium
- Milestone: Week 7
- Assignees: @VinhHoang03
- Updated at: 2026-05-31T15:40:03Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #92 / `T-E10`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field | Value |
| --- | --- |
| GitHub issue | #92 |
| Task ID | T-E10 |
| Title | AI Chat integration test (full conversation flow) |
| State | open |
| Local log path | `issues/by-github-id/#092-T-E10-AI Chat integration test (full conversation flow).md` |

## Issue Body

# T-E10: AI Chat integration test (full conversation flow)

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #92 |
| Track | E: AI & Chat System |
| Nhóm | E-Frontend |
| Loại việc | testing |
| Priority | medium |
| Owner gợi ý | Backend+AI Dev |
| Assignee hiện tại | @VinhHoang03 |
| Estimate | 2h |
| Milestone | Week 7 |
| Dependencies | `T-E07` |

## 3. Requirement cụ thể

- Test phải chạy bằng command repo/package tương ứng và không yêu cầu secret thật.
- Scope test bao phủ: Start session → send 3 messages → verify streaming.
- Fixture phải deterministic; mock network/Prisma/external service khi flow không cần integration thật.
- Output mong muốn là suite fail khi chức năng vỡ và pass ổn định trong CI.


## 4. Flow tích hợp

- Test suite phải chạy sau khi dependency `T-E07` có contract ổn định.
- Flow kiểm thử nên mô phỏng hành vi người dùng/API thật thay vì chỉ snapshot implementation detail.
- CI phải fail khi critical path bị regression.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #92.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy test suite và thấy test fail nếu flow chính bị phá vỡ.
- Test mô phỏng input/output hoặc thao tác người dùng thật ở mức phù hợp.
- Test log/CI output đủ rõ để biết lỗi nằm ở validation, API contract, UI render hay navigation.

## 6. Acceptance Criteria chi tiết

- [ ] Start session → send 3 messages → verify streaming: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **AI Chat integration test (full conversation flow)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Start session → send 3 messages → verify streaming.

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #92 for `T-E10`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#092-T-E10-AI Chat integration test (full conversation flow).md`.
