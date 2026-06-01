# T-J03: API integration tests (Supertest: auth + CRUD + errors)

## GitHub Link

- Issue: [#121](https://github.com/khovan123/philo-mind/issues/121)
- State: open
- Track: J - Testing
- Type: testing
- Updated at: 2026-05-31T15:54:34Z

# T-J03: API integration tests (Supertest: auth + CRUD + errors)

## 1. Mục đích sản phẩm

Chức năng này dùng để xác thực người dùng để họ có thể đăng ký, đăng nhập, giữ phiên, refresh token và truy cập các tính năng cá nhân hóa của PhiloMind.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính | Giá trị |
| --- | --- |
| GitHub issue | #121 |
| Track | J: Testing |
| Nhóm | All |
| Loại việc | testing |
| Priority | medium |
| Owner gợi ý | Any Dev |
| Assignee hiện tại | @NguyenDat204 |
| Estimate | 4h |
| Milestone | Week 7 |
| Dependencies | `T-A05` |

## 3. Requirement cụ thể

- Test phải chạy bằng command repo/package tương ứng và không yêu cầu secret thật.
- Scope test bao phủ: In-memory DB; 30+ endpoint tests.
- Fixture phải deterministic; mock network/Prisma/external service khi flow không cần integration thật.
- Output mong muốn là suite fail khi chức năng vỡ và pass ổn định trong CI.


## 4. Flow tích hợp

- Test suite phải chạy sau khi dependency `T-A05` có contract ổn định.
- Flow kiểm thử nên mô phỏng hành vi người dùng/API thật thay vì chỉ snapshot implementation detail.
- CI phải fail khi critical path bị regression.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #121.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy test suite và thấy test fail nếu flow chính bị phá vỡ.
- Test mô phỏng input/output hoặc thao tác người dùng thật ở mức phù hợp.
- Test log/CI output đủ rõ để biết lỗi nằm ở validation, API contract, UI render hay navigation.

## 6. Acceptance Criteria chi tiết

- [ ] In-memory DB: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] 30+ endpoint tests: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Bổ sung test suite cho **API integration tests (Supertest: auth + CRUD + errors)** theo runner hiện có của repo.
- [ ] Bao phủ happy path, validation failure và edge case quan trọng được nêu trong acceptance criteria.
- [ ] Giữ fixture deterministic; không phụ thuộc network hoặc secret ngoài nếu không cần thiết.
- [ ] Chạy test suite liên quan và ghi command cùng kết quả trong PR.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: In-memory DB, 30+ endpoint tests.

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #121 / `T-J03`, beyond implementation process notes.

### User-facing outcome

Người dùng có thể tạo tài khoản, đăng nhập, duy trì phiên, làm mới token và đăng xuất/khôi phục mật khẩu mà không mất dữ liệu học tập cá nhân.

### Inputs

- fixture data
- mocked services
- user/API actions under test

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
- PR description must link issue #121 and mention `T-J03`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-06-01: BMAD sprint-status sync checked GitHub issue #121 for `T-J03`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#121-T-J03-API integration tests (Supertest- auth + CRUD + errors).md`.

