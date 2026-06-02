# T-C13: Refactor validation logic to shared library

## 1. Mục đích sản phẩm

Đưa toàn bộ logic validator dùng chung giữa Frontend (webapp) và Backend (services) vào package shared library (`libs/shared`) nhằm đồng bộ hóa quy tắc validation (email, mật khẩu, độ dài ký tự...) và các thông báo lỗi (error messages), tránh trùng lặp code (duplicate code) và giảm thiểu rủi ro lệch chuẩn logic giữa hai đầu.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| GitHub issue      | #216                          |
| Track             | C: Shared Types & Seed        |
| Nhóm              | All                           |
| Loại việc         | refactor                      |
| Priority          | medium                        |
| Owner gợi ý       | @thuhataplamdev               |
| Assignee hiện tại | @thuhataplamdev               |
| Estimate          | 3h                            |
| Milestone         | Week 1                        |
| Dependencies      | Không có dependency bắt buộc. |

## 3. Requirement cụ thể

- Di chuyển/tái cấu trúc các Zod schemas hiện tại từ backend (`services/src/validators/*`) vào thư mục tương ứng trong package `libs/shared` (ví dụ: `libs/shared/src/validators/*`).
- Đảm bảo các thông báo lỗi (Vietnamese error messages) được giữ nguyên để giữ tính nhất quán UI/UX.
- Export các schemas và loại (types) được tạo ra (`z.infer<typeof schema>`) từ file entry-point `libs/shared/src/index.ts`.
- Cập nhật backend (Express services) sử dụng các shared schemas từ `libs/shared` (thay vì tự định nghĩa độc lập).
- Cập nhật frontend (React/Expo webapp) sử dụng chung các shared schemas này để validate form đầu vào trước khi submit API.

## 4. Flow tích hợp

- Dependency trước khi tích hợp: Không có dependency bắt buộc.
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #216.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Các API endpoints của backend hoạt động bình thường, trả về lỗi validation tương tự như trước đây khi input không hợp lệ.
- Form validate phía frontend hoạt động trơn tru, hiển thị chính xác các thông báo lỗi tiếng Việt được định nghĩa từ shared library.

## 6. Acceptance Criteria chi tiết

- [ ] Định nghĩa các shared schemas trong `libs/shared/src/validators` (Auth, Topics, Lessons, Story, v.v.).
- [ ] Export hoàn toàn các schemas và các kiểu dữ liệu suy diễn tương ứng trong `libs/shared/src/index.ts`.
- [ ] Build thành công shared library mà không gặp lỗi TypeScript/cú pháp.
- [ ] Thay thế các import validators cũ trong backend (`services/src/validators/...`) bằng shared schemas.
- [ ] Áp dụng shared schemas cho validation form ở frontend (`webapp/src/...`).

## 7. Checklist triển khai

- [ ] Di chuyển các Zod schemas từ backend sang `libs/shared/src/validators`.
- [ ] Cập nhật file build/compile và entry-point index.ts của `libs/shared`.
- [ ] Cập nhật backend controller/middleware sử dụng shared schemas.
- [ ] Cập nhật frontend forms sử dụng shared schemas.
- [ ] Chạy lint/typecheck/tests ở cả backend, frontend và libs để kiểm chứng.

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

_Updated by BMAD PM requirements pass on 2026-06-01. Nội dung này thay thế mô tả task ngắn trước đó bằng requirement cụ thể hơn cho dev/review._

## Frontend State And Data Requirement

- Bat buoc dung **RTK Query** cho API calls, cache tags, loading/error state va reauth flow.
- Bat buoc dung **Redux Toolkit** cho global/client state, feature slices va typed selectors/actions.
- Bat buoc dung **Redux Persist** cho auth/session/token state can giu qua app restart.
- Khong tao data-fetching layer rieng bang interceptor tu quan; khong tao global store hook ngoai Redux Toolkit.
- Neu issue can mock data, mock phai nam sau RTK Query endpoint hoac Redux slice cung shape voi API that.
