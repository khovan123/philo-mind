# T-C13: Refactor validation logic to shared library

## GitHub Link

- Issue: [#216](https://github.com/khovan123/philo-mind/issues/216)
- State: closed
- Track: C - Shared Types & Seed
- Type: fullstack
- Priority: medium
- Milestone: Unassigned
- Assignees: @thuhataplamdev
- Updated at: 2026-06-05T10:08:00Z

## Current Sprint Status

- [x] Closed on GitHub. This task is completed.

## Status Log

- 2026-06-05: Refactoring of validation logic to the shared library is completed. All validators migrated, exported from the shared library, and imported correctly in the backend and frontend services.
- 2026-05-31: Synced from GitHub issue state. This local file exists so the plan has an auditable log for issue #216 / `T-C13`.

## Required Follow-up

- None.

## Source Snapshot

| Field          | Value                                                                           |
| -------------- | ------------------------------------------------------------------------------- |
| GitHub issue   | #216                                                                            |
| Task ID        | T-C13                                                                           |
| Title          | Refactor validation logic to shared library                                     |
| State          | closed                                                                          |
| Local log path | `issues/by-github-id/#216-T-C13-Refactor validation logic to shared library.md` |

## Issue Body

## 1. Mục đích sản phẩm

Đưa toàn bộ logic validator dùng chung giữa Frontend (webapp) và Backend (services) vào package shared library (`libs/shared`) nhằm đồng bộ hóa quy tắc validation (email, mật khẩu, độ dài ký tự...) và các thông báo lỗi (error messages), tránh trùng lặp code (duplicate code) và giảm thiểu rủi ro lệch chuẩn logic giữa hai đầu.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| Track             | C: Shared Types & Seed        |
| Nhóm              | All                           |
| Loại việc         | refactor                      |
| Priority          | medium                        |
| Owner gợi ý       | @thuhataplamdev               |
| Assignee hiện tại | @thuhataplamdev               |
| Milestone         | Week 1                        |
| Dependencies      | Không có dependency bắt buộc. |

## 3. Requirement cụ thể

- Di chuyển/tái cấu trúc các Zod schemas hiện tại từ backend (`services/src/validators/*`) vào thư mục tương ứng trong package `libs/shared` (ví dụ: `libs/shared/src/validators/*`).
- Đảm bảo các thông báo lỗi (Vietnamese error messages) được giữ nguyên để giữ tính nhất quán UI/UX.
- Export các schemas và loại (types) được tạo ra (`z.infer<typeof schema>`) từ file entry-point `libs/shared/src/index.ts`.
- Cập nhật backend (Express services) sử dụng các shared schemas từ `libs/shared` (thay vì tự định nghĩa độc lập).
- Cập nhật frontend (React/Expo webapp) sử dụng chung các shared schemas này để validate form đầu vào trước khi submit API.

## 4. Flow tích hợp

- PR phải được tạo trên branch riêng và link trực tiếp tới issue này.
- Mọi thay đổi trong `libs/shared` phải được build lại thành công (`npm run build` hoặc script compile tương tự trong package libs) trước khi backend/frontend sử dụng.

## 5. Hành vi người dùng hoặc API cần đạt

- Các API endpoints của backend hoạt động bình thường, trả về lỗi validation tương tự như trước đây khi input không hợp lệ.
- Form validate phía frontend hoạt động trơn tru, hiển thị chính xác các thông báo lỗi tiếng Việt được định nghĩa từ shared library.

## 6. Acceptance Criteria chi tiết

- [x] Định nghĩa các shared schemas trong `libs/shared/src/validators` (Auth, Topics, Lessons, Story, v.v.).
- [x] Export hoàn toàn các schemas và các kiểu dữ liệu suy diễn tương ứng trong `libs/shared/src/index.ts`.
- [x] Build thành công shared library mà không gặp lỗi TypeScript/cú pháp.
- [x] Thay thế các import validators cũ trong backend (`services/src/validators/...`) bằng shared schemas.
- [x] Áp dụng shared schemas cho validation form ở frontend (`webapp/src/...`).

## 7. Checklist triển khai

- [x] Di chuyển các Zod schemas từ backend sang `libs/shared/src/validators`.
- [x] Cập nhật file build/compile và entry-point index.ts của `libs/shared`.
- [x] Cập nhật backend controller/middleware sử dụng shared schemas.
- [x] Cập nhật frontend forms sử dụng shared schemas.
- [x] Chạy lint/typecheck/tests ở cả backend, frontend và libs để kiểm chứng.

## 8. Kiểm chứng bắt buộc

- [x] Đảm bảo `npm run build` hoặc lệnh tương đương của shared library chạy thành công.
- [x] Kiểm tra backend không bị lỗi validation bằng cách gửi sample request không hợp lệ (ví dụ: sai format email, mật khẩu quá ngắn) và xem response trả về lỗi chuẩn.
- [x] Kiểm tra frontend form validation chặn input sai định dạng thành công và hiển thị đúng thông báo lỗi từ shared library.

## 9. Definition of Done

- [x] Code/config đã commit trên branch riêng và mở PR liên kết issue này.
- [x] PR mô tả phạm vi thay đổi, cách kiểm chứng và rủi ro còn lại.
- [x] CI xanh hoặc PR ghi rõ blocker có thể tái hiện.
- [x] Không còn TODO thuộc trực tiếp scope issue này.

## Status Log

- 2026-06-05: Completed validator refactoring to shared library. Checked all validation tests.
- 2026-05-31: BMAD sprint-status sync checked GitHub issue #216 for `T-C13`. Current source-of-truth status: **OPEN**. Local log: `issues/by-github-id/#216-T-C13-Refactor validation logic to shared library.md`.
