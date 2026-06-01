# T-E10: AI Chat integration test (full conversation flow)

## GitHub Link

- Issue: [#92](https://github.com/khovan123/philo-mind/issues/92)
- State: open
- Track: E - AI & Chat System
- Type: testing
- Updated at: 2026-05-31T15:54:06Z

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

## Feature Output Contract

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #92 / `T-E10`, beyond implementation process notes.

### User-facing outcome

Người học trò chuyện với nhân vật triết học AI theo ngữ cảnh học tập, có phản hồi an toàn, streaming và lịch sử hội thoại.

### Inputs

- characterId
- sessionId
- message content
- conversation context

### Expected output

- Test suite fail khi flow/contract chính bị phá và pass ổn định khi tính năng đúng.
- Test mô phỏng input/output hoặc thao tác người dùng thật thay vì chỉ kiểm implementation detail.
- Fixture deterministic, không cần secret thật hoặc network ngoài nếu không bắt buộc.
- CI/log chỉ ra lỗi nằm ở validation, API contract, UI render, navigation hay data persistence.

### Success state

- Command test chạy xanh, đồng thời test có assertion đủ mạnh để bắt regression.

### Empty/error/loading states

- Test phải có case failure có chủ đích, không chỉ happy path.
- Khi fixture thiếu/sai, lỗi test phải đọc được nguyên nhân.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #92 and mention `T-E10`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-06-01: BMAD sprint-status sync checked GitHub issue #92 for `T-E10`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#092-T-E10-AI Chat integration test (full conversation flow).md`.

