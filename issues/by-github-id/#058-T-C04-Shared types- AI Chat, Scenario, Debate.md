# T-C04: Shared types: AI Chat, Scenario, Debate

## GitHub Link

- Issue: [#58](https://github.com/khovan123/philo-mind/issues/58)
- State: open
- Track: C - Shared Types & Seed
- Type: seed-data
- Updated at: 2026-05-31T15:53:33Z

# T-C04: Shared types: AI Chat, Scenario, Debate

## 1. Mục đích sản phẩm

Chức năng này dùng để cho phép người học trò chuyện với nhân vật triết học AI theo ngữ cảnh, có streaming và giới hạn an toàn.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| GitHub issue      | #58                           |
| Track             | C: Shared Types & Seed        |
| Nhóm              | All                           |
| Loại việc         | seed-data                     |
| Priority          | high                          |
| Owner gợi ý       | Any Dev                       |
| Assignee hiện tại | @Thienhoang78                 |
| Estimate          | 2h                            |
| Milestone         | Week 1                        |
| Dependencies      | Không có dependency bắt buộc. |

## 3. Requirement cụ thể

- Seed data phải chạy deterministic qua seed runner hiện có và không phụ thuộc API key/network.
- Input là file/constant dữ liệu nguồn; output là records hợp lệ trong Prisma schema với slug/id ổn định để test dùng lại.
- Nội dung user-facing ưu tiên tiếng Việt, đủ title, description/content, metadata, relationship tới topic/lesson/story liên quan.
- Sau khi seed lại nhiều lần không tạo duplicate ngoài ý muốn; dùng upsert hoặc cleanup strategy rõ ràng.

## 4. Flow tích hợp

- Dependency trước khi tích hợp: Không có dependency bắt buộc..
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #58.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy seed runner và dữ liệu xuất hiện trong database đúng quan hệ.
- App/API có thể dùng ngay dữ liệu seed để demo flow học tập.
- Chạy lại seed không tạo dữ liệu trùng hoặc phá quan hệ đã có.

## 6. Acceptance Criteria chi tiết

- [ ] `AiCharacterDTO`: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] `ScenarioDTO`: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] `DebateDTO`: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Triển khai artifact dùng chung cho **Shared types: AI Chat, Scenario, Debate** tại package hoặc seed module phù hợp.
- [ ] Đảm bảo export/import rõ ràng để consumer dùng được mà không cần truy cập file nội bộ.
- [ ] Giữ enum, DTO hoặc seed data đồng bộ với schema và API contract hiện có.
- [ ] Chạy typecheck hoặc seed smoke check tương ứng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: `AiCharacterDTO`, `ScenarioDTO`, `DebateDTO`.

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #58 / `T-C04`, beyond implementation process notes.

### User-facing outcome

Người học trò chuyện với nhân vật triết học AI theo ngữ cảnh học tập, có phản hồi an toàn, streaming và lịch sử hội thoại.

### Inputs

- characterId
- sessionId
- message content
- conversation context

### Expected output

- Seed runner tạo được record cha/con đúng thứ tự và id/slug ổn định cho demo/test.
- Nội dung user-facing có tiếng Việt đủ title, mô tả, body markdown hoặc metadata cần render.
- Chạy lại seed không tạo duplicate hoặc phá quan hệ hiện có.
- Các issue frontend/backend liên quan có thể dùng dữ liệu seed để kiểm thử flow thật.

### Success state

- Seed chạy xong và database có dữ liệu đúng quan hệ, app có thể mở demo content.

### Empty/error/loading states

- Mô tả rõ trạng thái rỗng, lỗi và retry/recovery tương ứng.

### Evidence required in PR

- Screenshot, API sample, test output, seed log, or CI/deploy log that proves the expected output above exists.
- PR description must link issue #58 and mention `T-C04`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #58 for `T-C04`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#058-T-C04-Shared types- AI Chat, Scenario, Debate.md`.
