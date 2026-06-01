# T-C12: Seed: TopicPerspective data (5 perspectives x 10 topics)

## 1. Mục đích sản phẩm

Chức năng này dùng để giúp người học duyệt, tìm kiếm và mở đúng chủ đề triết học theo danh mục, độ khó và nhu cầu học hiện tại.

Nó không chỉ là một checklist code. Đầu ra cần là một phần sản phẩm có thể được người dùng hoặc developer khác dùng, test và tích hợp với các issue liên quan.

## 2. Bối cảnh và phạm vi

| Thuộc tính        | Giá trị                       |
| ----------------- | ----------------------------- |
| GitHub issue      | #66                           |
| Track             | C: Shared Types & Seed        |
| Nhóm              | All                           |
| Loại việc         | seed-data                     |
| Priority          | medium                        |
| Owner gợi ý       | Any Dev                       |
| Assignee hiện tại | @Thienhoang78                 |
| Estimate          | 2h                            |
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
- Issue này phải được triển khai trên branch riêng và PR phải link trực tiếp tới issue #66.
- Nếu phát hiện dependency chưa sẵn sàng, PR phải ghi rõ mock/contract tạm và điều kiện để chuyển sang integration thật.

## 5. Hành vi người dùng hoặc API cần đạt

- Developer chạy seed runner và dữ liệu xuất hiện trong database đúng quan hệ.
- App/API có thể dùng ngay dữ liệu seed để demo flow học tập.
- Chạy lại seed không tạo dữ liệu trùng hoặc phá quan hệ đã có.

## 6. Acceptance Criteria chi tiết

- [ ] Tech: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] ethical: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] economic: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] social: có bằng chứng kiểm chứng rõ ràng trong PR.
- [ ] philosophical: có bằng chứng kiểm chứng rõ ràng trong PR.

## 7. Checklist triển khai

- [ ] Triển khai artifact dùng chung cho **Seed: TopicPerspective data (5 perspectives × 10 topics)** tại package hoặc seed module phù hợp.
- [ ] Đảm bảo export/import rõ ràng để consumer dùng được mà không cần truy cập file nội bộ.
- [ ] Giữ enum, DTO hoặc seed data đồng bộ với schema và API contract hiện có.
- [ ] Chạy typecheck hoặc seed smoke check tương ứng.
- [ ] Đối chiếu kết quả với yêu cầu cốt lõi: Tech, ethical, economic, social, philosophical.

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
