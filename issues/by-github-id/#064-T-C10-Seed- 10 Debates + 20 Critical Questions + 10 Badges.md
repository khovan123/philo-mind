# T-C10: Seed: 10 Debates + 20 Critical Questions + 10 Badges

## GitHub Link

- Issue: [#64](https://github.com/khovan123/philo-mind/issues/64)
- State: done
- Track: C - Shared Types & Seed
- Type: seed-data
- Priority: medium
- Milestone: Week 3
- Assignees: @Thienhoang78
- Updated at: 2026-06-01T11:50:33Z
- Closed at: 2026-06-01T11:50:33Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #64 / `T-C10`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field          | Value                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------- |
| GitHub issue   | #64                                                                                      |
| Task ID        | T-C10                                                                                    |
| Title          | Seed: 10 Debates + 20 Critical Questions + 10 Badges                                     |
| State          | done                                                                                     |
| Local log path | `issues/by-github-id/#064-T-C10-Seed- 10 Debates + 20 Critical Questions + 10 Badges.md` |

## Issue Body

# T-C10: Seed: 10 Debates + 20 Critical Questions + 10 Badges

## 1. Mục đích sản phẩm

Chức năng này dùng để ghi nhận hoạt động học tập để hiển thị tiến độ, streak, badge và thống kê cá nhân.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| GitHub issue      | #64                           |
| Track             | C: Shared Types & Seed        |
| Nhóm              | All                           |
| Loại việc         | seed-data                     |
| Priority          | medium                        |
| Owner gợi ý       | Any Dev                       |
| Assignee hiện tại | @Thienhoang78                 |
| Estimate          | 3h                            |
| Milestone         | Week 3                        |
| Dependencies      | Không có dependency bắt buộc. |

## 3. Requirement cụ thể

- Seed data phải chạy deterministic qua seed runner hiện có và không phụ thuộc API key/network.
- Input là file/constant dữ liệu nguồn; output là records hợp lệ trong Prisma schema với slug/id ổn định để test dùng lại.
- Nội dung user-facing ưu tiên tiếng Việt, đủ title, description/content, metadata, relationship tới topic/lesson/story liên quan.
- Sau khi seed lại nhiều lần không tạo duplicate ngoài ý muốn; dùng upsert hoặc cleanup strategy rõ ràng.

## 4. Flow tích hợp

- Seed runner đọc dữ liệu theo thứ tự phụ thuộc, tạo records cha trước records con.
- Các issue backend/frontend dùng dữ liệu seed qua slug/id ổn định để demo và test.
- Nếu schema thiếu field cần thiết, ghi rõ migration dependency thay vì nhét dữ liệu vào field sai nghĩa.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #64.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy seed runner và dữ liệu xuất hiện trong database đúng quan hệ.
- App/API có thể dùng ngay dữ liệu seed để demo flow học tập.
- Chạy lại seed không tạo dữ liệu trùng hoặc phá quan hệ đã có.

## 6. Acceptance Criteria chi tiết

- [ ] Debate topics: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] question types: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] badge conditions: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Triển khai artifact dùng chung cho **Seed: 10 Debates + 20 Critical Questions + 10 Badges** tại package hoặc seed module phù hợp.
- [ ] Đảm bảo export/import rõ ràng để consumer dùng được mà không cần truy cập file nội bộ.
- [ ] Giữ enum, DTO hoặc seed data đồng bộ với schema và API contract hiện có.
- [ ] Chạy typecheck hoặc seed smoke check tương ứng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Debate topics, question types, badge conditions.

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

> Added by BMAD Advanced Elicitation on 2026-05-31. This section defines the concrete product output expected from issue #64 / `T-C10`, beyond implementation process notes.

### User-facing outcome

Người học phân tích tình huống đời thực hoặc tranh luận qua nhiều góc nhìn, lập luận, vote/comment và nhìn lại lập trường.

### Inputs

- debateId
- stance
- argument content
- vote value
- comment content

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
- PR description must link issue #64 and mention `T-C10`.
- If the final behavior differs from this contract, update the issue and local docs in the same PR.

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #64 for `T-C10`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#064-T-C10-Seed- 10 Debates + 20 Critical Questions + 10 Badges.md`.
