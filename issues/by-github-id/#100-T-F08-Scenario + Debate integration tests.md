# T-F08: Scenario + Debate integration tests

## GitHub Link

- Issue: [#100](https://github.com/khovan123/philo-mind/issues/100)
- State: open
- Track: F - Scenario & Debate
- Type: testing
- Priority: low
- Milestone: Week 7
- Assignees: @Ngoclee123
- Updated at: 2026-06-01T05:30:31Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #100 / `T-F08`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field          | Value                                                                   |
| -------------- | ----------------------------------------------------------------------- |
| GitHub issue   | #100                                                                    |
| Task ID        | T-F08                                                                   |
| Title          | Scenario + Debate integration tests                                     |
| State          | open                                                                    |
| Local log path | `issues/by-github-id/#100-T-F08-Scenario + Debate integration tests.md` |

## Issue Body

# T-F08: Scenario + Debate integration tests

## 1. Mục đích sản phẩm

Chức năng này dùng để giúp người học phân tích tình huống đời thực từ nhiều góc nhìn, tranh luận và nhìn lại lập trường của mình.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị              |
| ----------------- | -------------------- |
| GitHub issue      | #100                 |
| Track             | F: Scenario & Debate |
| Nhóm              | F-Debate             |
| Loại việc         | testing              |
| Priority          | low                  |
| Owner gợi ý       | Fullstack Dev        |
| Assignee hiện tại | @Ngoclee123          |
| Estimate          | 2h                   |
| Milestone         | Week 7               |
| Dependencies      | `T-F04`, `T-F07`     |

## 3. Requirement cụ thể

- Test phải chạy bằng command repo/package tương ứng và không yêu cầu secret thật.
- Scope test bao phủ: Full flow verification.
- Fixture phải deterministic; mock network/Prisma/external service khi flow không cần integration thật.
- Output mong muốn là suite fail khi chức năng vỡ và pass ổn định trong CI.

## 4. Flow tích hợp

- Test suite phải chạy sau khi dependency `T-F04`, `T-F07` có contract ổn định.
- Flow kiểm thử nên mô phỏng hành vi người dùng/API thật thay vì chỉ snapshot implementation detail.
- CI phải fail khi critical path bị regression.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #100.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy test suite và thấy test fail nếu flow chính bị phá vỡ.
- Test mô phỏng input/output hoặc thao tác người dùng thật ở mức phù hợp.
- Test log/CI output đủ rõ để biết lỗi nằm ở validation, API contract, UI render hay navigation.

## 6. Acceptance Criteria chi tiết

- [ ] Full flow verification: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Bổ sung test suite cho **Scenario + Debate integration tests** theo runner hiện có của repo.
- [ ] Bao phủ happy path, validation failure và edge case quan trọng được nêu trong acceptance criteria.
- [ ] Giữ fixture deterministic; không phụ thuộc network hoặc secret ngoài nếu không cần thiết.
- [ ] Chạy test suite liên quan và ghi command cùng kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Full flow verification.

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #100 / `T-F08`, beyond implementation process notes.

### User-facing outcome

Người học phân tích tình huống đời thực hoặc tranh luận qua nhiều góc nhìn, lập luận, vote/comment và nhìn lại lập trường.

### Inputs

- scenarioId
- initialPosition
- selected perspective/framework
- reflection text

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
- PR description must link issue #100 and mention `T-F08`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #100 for `T-F08`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#100-T-F08-Scenario + Debate integration tests.md`.
