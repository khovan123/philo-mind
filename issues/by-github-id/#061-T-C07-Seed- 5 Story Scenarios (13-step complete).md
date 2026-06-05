# T-C07: Seed: 5 Story Scenarios (13-step complete)

## GitHub Link

- Issue: [#61](https://github.com/khovan123/philo-mind/issues/61)
- State: done
- Track: C - Shared Types & Seed
- Type: seed-data
- Priority: medium
- Milestone: Week 3
- Assignees: @thuhataplamdev
- Updated at: 2026-06-04T04:35:40Z
- Closed at: 2026-06-04T04:35:40Z

## Current Sprint Status

- [x] Done on GitHub. Treat this task as complete unless reopened.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #61 / `T-C07`.

## Required Follow-up

- No implementation follow-up required from sprint-status unless QA reopens the issue.

## Source Snapshot

| Field          | Value                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| GitHub issue   | #61                                                                            |
| Task ID        | T-C07                                                                          |
| Title          | Seed: 5 Story Scenarios (13-step complete)                                     |
| State          | done                                                                           |
| Local log path | `issues/by-github-id/#061-T-C07-Seed- 5 Story Scenarios (13-step complete).md` |

## Issue Body

# T-C07: Seed: 5 Story Scenarios (7-step complete)

## 1. Mục đích sản phẩm

Chức năng này dùng để đưa người học đi qua story mode nhiều bước, từ bối cảnh, học khái niệm, ra quyết định, xem hệ quả đến phản tư.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| GitHub issue      | #61                           |
| Track             | C: Shared Types & Seed        |
| Nhóm              | All                           |
| Loại việc         | seed-data                     |
| Priority          | medium                        |
| Owner gợi ý       | Any Dev                       |
| Assignee hiện tại | @Thienhoang78                 |
| Estimate          | 5h                            |
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
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #61.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy seed runner và dữ liệu xuất hiện trong database đúng quan hệ.
- App/API có thể dùng ngay dữ liệu seed để demo flow học tập.
- Chạy lại seed không tạo dữ liệu trùng hoặc phá quan hệ đã có.

## 6. Acceptance Criteria chi tiết

- [ ] Learn cards: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] choices: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] consequences: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] analysis tabs: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Triển khai artifact dùng chung cho **Seed: 5 Story Scenarios (7-step complete)** tại package hoặc seed module phù hợp.
- [ ] Đảm bảo export/import rõ ràng để consumer dùng được mà không cần truy cập file nội bộ.
- [ ] Giữ enum, DTO hoặc seed data đồng bộ với schema và API contract hiện có.
- [ ] Chạy typecheck hoặc seed smoke check tương ứng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Learn cards, choices, consequences, analysis tabs.

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

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.

## Status Log

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #61 for `T-C07`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#061-T-C07-Seed- 5 Story Scenarios (13-step complete).md`.
