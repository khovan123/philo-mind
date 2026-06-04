# T-D11: Step 6 (NPC Encounter) & Step 7 (Mini Game)

## GitHub Link

- Issue: [#77](https://github.com/khovan123/philo-mind/issues/77)
- State: open
- Track: D - Story Mode Engine
- Type: frontend
- Priority: medium
- Milestone: Week 6
- Assignees: @dklinh05
- Updated at: 2026-06-02T16:21:54Z

## Current Sprint Status

- [ ] Open on GitHub. Treat this task as remaining work.

## Status Log

- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #77 / `T-D11`.

## Required Follow-up

- Keep implementation, PR, and review updates linked to this GitHub issue. If work starts, include the issue number and task ID in PR title/body.

## Source Snapshot

| Field          | Value                                                                           |
| -------------- | ------------------------------------------------------------------------------- |
| GitHub issue   | #77                                                                             |
| Task ID        | T-D11                                                                           |
| Title          | Step 6 (NPC Encounter) & Step 7 (Mini Game)                                     |
| State          | open                                                                            |
| Local log path | `issues/by-github-id/#077-T-D11-Step 6 (NPC Encounter) & Step 7 (Mini Game).md` |

## Issue Body

# T-D11: Step 6 (NPC Encounter) & Step 7 (Mini Game)

## 1. Mục đích sản phẩm

Chức năng này dùng để đưa người học đi qua story mode nhiều bước, từ bối cảnh, học khái niệm, ra quyết định, xem hệ quả đến phản tư.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị              |
| ----------------- | -------------------- |
| GitHub issue      | #77                  |
| Track             | D: Story Mode Engine |
| Nhóm              | D-Frontend           |
| Loại việc         | frontend             |
| Priority          | medium               |
| Owner gợi ý       | Fullstack Dev        |
| Assignee hiện tại | @dklinh05            |
| Estimate          | 5h                   |
| Milestone         | Week 6               |
| Dependencies      | `T-D10`              |

## 3. Requirement cụ thể

- Route đề xuất: `/story/[id]/encounter` và `/story/[id]/minigame`.
- NPC Encounter: Cuộc gặp gỡ với NPC, hiển thị bối cảnh đối thoại, các lựa chọn đối thoại mang tính đạo đức/triết học.
- Mini Game (Clue Challenge): Trò chơi giải đố nhỏ để thu thập manh mối (clues) hoặc khái niệm triết học liên quan đến bối cảnh.

- Màn hình phải có đủ loading, empty, error, success và disabled/submitting state.
- Dữ liệu lấy qua RTK Query API slice + Redux Toolkit store; chỉ dùng mock khi dependency backend chưa sẵn sàng và phải ghi rõ điểm thay bằng API thật.

## 4. Flow tích hợp

- Dependency trước khi nối API thật: `T-D10`.
- User mở màn hình qua route /story/[id] hoặc tương ứng; các CTA phải điều hướng tới màn hình chi tiết hoặc bước kế tiếp có data id/session id.
- Nếu backend chưa sẵn sàng, tạo adapter/mock cùng shape với API thật để khi issue dependency merge chỉ thay data source.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #77.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Người dùng có thể mở màn hình tại route tương ứng từ tab/card/link liên quan.
- Các CTA phải làm đúng hành động: mở detail, submit form, chuyển bước, quay lại danh sách hoặc mở link ngoài theo đúng ngữ cảnh.
- Trạng thái loading/empty/error phải có UI rõ ràng, không để màn hình trắng.
- Khi user thao tác thành công, state/store/API cache phải cập nhật để màn hình tiếp theo có dữ liệu đúng.

## 6. Acceptance Criteria chi tiết

- [ ] Tag badges: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] glow selection: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] min 20 chars: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Khảo sát screen/component dùng chung hiện có và tái sử dụng design tokens của repo.
- [ ] Triển khai đầy đủ UI flow **T-D11: Step 6 (NPC Encounter) & Step 7 (Mini Game)** gồm loading, empty, error và interaction state phù hợp.
- [ ] Nối navigation, store và API service thật; chỉ dùng mock khi dependency backend chưa sẵn sàng.
- [ ] Kiểm tra layout trên kích thước màn hình chính và thêm test/smoke check cho interaction quan trọng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Tag badges, glow selection, min 20 chars.

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

- 2026-05-31: BMAD sprint-status sync checked GitHub issue #77 for `T-D11`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#077-T-D11-Step 6 (NPC Encounter) & Step 7 (Mini Game).md`.
