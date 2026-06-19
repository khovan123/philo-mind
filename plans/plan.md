# PhiloMind — Audit & Execution Plan

> **Ngày:** 2026-06-17 · **Người lập:** Claude (Opus 4.8) + team subagents
> **Nguyên tắc:** Lấy nội dung **Chương 1** (`docs/Chapter1.md`) làm **trục triển khai chính**. Toàn bộ app build/kiểm thử quanh chương này trước; cấu trúc & nợ kỹ thuật phục vụ cho trục đó.

---

## 0. Tóm tắt điều hành

Codebase **không có gì "vỡ"** — chất lượng kỹ thuật cao, nhưng được build theo plan "triết học tổng quát" cũ. Đã **pivot sang Triết học Mác–Lênin, MVP chỉ Chương 1**. Việc cần làm: **đổ nội dung Chương 1 thật vào app theo đúng cấu trúc giáo trình**, rồi mới chỉnh cấu trúc UX và dọn nợ.

### Bằng chứng sức khỏe hệ thống (chạy 2026-06-16)

| Kiểm tra          | Lệnh                                         | Kết quả                 |
| ----------------- | -------------------------------------------- | ----------------------- |
| Backend typecheck | `npx tsc -p services/tsconfig.json --noEmit` | ✅ 0 lỗi                |
| Backend tests     | `npm run test -w services`                   | ✅ 546 pass / 38 suites |
| Backend lint      | `npm run lint -w services`                   | ✅ 0 error, 10 warning  |
| Frontend tests    | `npm run test -w webapp`                     | ✅ 102 pass / 4 suites  |
| Frontend lint     | `npm run lint -w webapp`                     | ✅ 0 error, 34 warning  |

### Quyết định đã chốt (2026-06-17)

1. AI Character Chat → **Phase 2** (ẩn khỏi tab chính, giữ code).
2. Phạm vi MVP → **chỉ Chương 1**.
3. Vận hành → **Atlas điều phối tự động**, báo cáo từng mốc.

---

## 1. TRỤC NỘI DUNG — Chương 1 (`docs/Chapter1.md`)

`Chapter1.md` là **nguồn nội dung canonical** cho cả app. Gồm **6 mục**, mỗi mục có **cùng một khuôn 4 phần** map thẳng vào feature & schema:

| Phần trong giáo trình                                                           | Feature app                       | Model / enum                                                                 |
| ------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| **Bài đọc chính** (hook + khái niệm + ví dụ thực tế)                            | Lesson / Short-lesson / Flashcard | `Lesson`, `ShortLesson`                                                      |
| **Quiz** (3 câu: trắc nghiệm · tình huống · logic)                              | Quiz                              | `Quiz`, `QuizQuestion`, `QuestionType.SINGLE_CHOICE / MORAL_DILEMMA / LOGIC` |
| **Tình huống đạo đức** (4 góc nhìn: thực dụng · nghĩa vụ · đức hạnh · quan tâm) | Scenario + perspectives           | `RealLifeScenario`, `ScenarioPerspective`                                    |
| **Tranh luận** (Quan điểm A/B) + **câu hỏi mở**                                 | Debate + Reflection               | `Debate`, `DebateArgument`, `CriticalQuestion`                               |

### 6 mục Chương 1 → 6 Topic (gom bằng `Topic.category = "Chương 1"`)

| #   | Mục   | Tiêu đề                                        | Trục tư duy chính                          |
| --- | ----- | ---------------------------------------------- | ------------------------------------------ |
| 1   | I.1   | Khái lược về Triết học                         | nguồn gốc nhận thức/xã hội, thế giới quan  |
| 2   | I.2   | Vấn đề cơ bản của Triết học                    | vật chất ↔ ý thức; khả năng nhận thức      |
| 3   | I.3   | Biện chứng và Siêu hình                        | tĩnh/cô lập ↔ vận động/liên hệ             |
| 4   | II.1  | Sự ra đời & phát triển của triết học Mác–Lênin | điều kiện KT-XH, KHTN, cách mạng triết học |
| 5   | II.2a | Đối tượng & chức năng của triết học Mác–Lênin  | thế giới quan + phương pháp luận           |
| 6   | II.2b | Vai trò trong đời sống & đổi mới ở Việt Nam    | lý luận → thực tiễn (Đổi mới 1986)         |

> **Lưu ý kiến trúc:** schema **không có model `Chapter`**. Dùng `Topic.category` để gom nhóm chương (không cần đổi schema). `Topic` đã liên kết sẵn lessons/shortLessons/scenarios/debates/criticalQuestions/mindmapNodes/perspectives → đủ cho toàn bộ mapping trên.

### Khối lượng nội dung mục tiêu Chương 1 (suy từ giáo trình)

- 6 bài đọc chính (Lesson) + flashcard khái niệm chủ chốt mỗi mục.
- ~18 câu quiz (6 mục × 3 loại) — đã có sẵn đáp án + giải thích trong giáo trình.
- 6 tình huống đạo đức, **mỗi tình huống 4 góc nhìn** (ScenarioPerspective).
- 6 cặp tranh luận A/B + các câu hỏi mở (CriticalQuestion / Reflection prompt).
- 1 mindmap Chương 1 (xương sống khái niệm) + ≥1 Story Episode nhập vai (đề xuất mục I.3 — đã có ví dụ "bác tài xế công nghệ").

---

## 2. PHASE 1 — Triển khai nội dung Chương 1 (ưu tiên cao nhất)

> ID `CH1-xx`. Agent: `atlas`(lead) `forge`(BE) `pixel`(FE) `muse`(AI/story) `sage`(UX/content) `verity`(QA).

- [x] **CH1-00 · atlas+sage** — Chốt mô hình dữ liệu chương: 6 mục = 6 Topic, `category="Chương 1"`; quy ước slug/thứ tự. **Verify:** ghi quy ước vào `docs/mvp-scope.md`.
- [x] **CH1-01 · sage+muse** — Chuẩn hóa `Chapter1.md` → **content spec canonical** (`data/chapter-01/` JSON/MD có cấu trúc): mỗi mục gồm 4 khối (reading / quiz[3] / scenario+4 perspectives / debate A,B + open questions), giữ nguyên đáp án + giải thích từ giáo trình. **Verify:** 6 mục × 4 khối đầy đủ, sage review đúng giáo trình.
- [x] **CH1-02 · forge+sage** — Map content spec → cấu trúc seed: Topic, Lesson, Quiz/QuizQuestion (đúng `QuestionType`), RealLifeScenario + 4 ScenarioPerspective (thực dụng/nghĩa vụ/đức hạnh/quan tâm), Debate (≥2 lập trường), CriticalQuestion (câu hỏi mở). **Verify:** bảng ánh xạ field-by-field được duyệt, không thiếu khối nào.
- [x] **CH1-03 · forge** — Viết/cập nhật seed files Chương 1, chạy `npm run seed` idempotent. **Verify:** seed pass; DB có 6 topic (category "Chương 1"), 6 lesson, ~18 quiz Q, 6 scenario × 4 perspective, 6 debate, các câu hỏi mở.
- [x] **CH1-04 · verity** — Test seed + API trả đúng nội dung Chương 1 (lesson/quiz/scenario/debate theo topic). **Verify:** test pass, bằng chứng đính kèm.
- [x] **CH1-05 · sage→pixel** — Learn flow tối thiểu cho Chương 1: Chapter List → "Chương 1" → Chapter Detail (6 mục) → Lesson Detail render bài đọc. Thay `(tabs)/learn.tsx` đang trỏ thẳng QuizList. **Verify:** điều hướng đủ nhánh, render nội dung thật từ API.
- [x] **CH1-06 · pixel** — Quiz Chương 1 chạy được cả 3 loại câu (trắc nghiệm/tình huống/logic) + màn Quiz Result hiển thị giải thích. **Verify:** làm hết 1 quiz mục bất kỳ, thấy đáp án + giải thích.
- [x] **CH1-07 · pixel** — Scenario screen hiển thị tình huống đạo đức + **4 góc nhìn** (swipe) + câu hỏi thảo luận, dùng dữ liệu Chương 1. **Verify:** mở 1 scenario, swipe đủ 4 góc nhìn.
- [x] **CH1-08 · pixel** — Debate screen hiển thị Quan điểm A/B + entry trả lời câu hỏi mở (reflection), dùng dữ liệu Chương 1. **Verify:** mở 1 debate Chương 1, thấy 2 lập trường + câu hỏi mở.
- [x] **CH1-09 · muse+sage** — Story Episode Chương 1 (đề xuất mục **I.3 Biện chứng/Siêu hình**) dùng investigation flow đã có. **Verify:** chơi xuyên 1 episode tới Episode Complete bằng nội dung Chương 1.
- [x] **CH1-10 · sage→pixel** — Mindmap Chương 1: Triết học → vấn đề cơ bản → duy vật/duy tâm → biện chứng/siêu hình → triết học Mác–Lênin → vai trò. **Verify:** mở mindmap Chương 1, tap node ra mô tả.

---

## 3. PHASE 2 — Cấu trúc UX & định hướng (sau khi nội dung Chương 1 lên)

- [x] **AUD-02 · sage+pixel** — Ẩn AI Chat khỏi tab chính (Phase 2), giữ code. **Verify:** bottom bar không còn tab Chat; test điều hướng pass.
- [x] **AUD-06 · sage→pixel** — Rút gọn bottom bar ≤5 tab; chuyển tab dư thành entry trong Home/Profile. **Verify:** ≤5 tab, mọi màn vẫn truy cập được.
- [x] **AUD-05 · muse+pixel** — Bổ sung bước **Evidence Board → Build Argument → Argument Result** vào story flow. **Verify:** 3 màn mới wired + state trong `story.slice.ts`, chạy E2E.
- [x] **AUD-08 · muse+forge** — Debate đa lập trường (vd vật chất quyết định / ý thức quyết định / cần phân tích / không thể biết) thay vì chỉ FOR-AGAINST. **Verify:** API + UI join-position; ≥1 debate Chương 1 đa lập trường; test BE.
- [x] **AUD-09 · muse+sage** — MiniGame phục vụ Chương 1: ghép khái niệm↔định nghĩa, phân loại duy vật/duy tâm, biện chứng/siêu hình, build-argument bằng thẻ. **Verify:** mỗi loại ≥1 bộ dữ liệu Chương 1, chơi & ghi điểm được.

---

## 4. PHASE 3 — Nợ kỹ thuật & đồng bộ (không chặn, xen kẽ)

- [ ] **AUD-13 · verity+atlas** — Đối chiếu coverage thực với Track J (#119–#123), bổ sung phần thiếu (E2E Maestro #123, frontend RTL), sync trạng thái GitHub + `sprint-status.md`.
- [ ] **AUD-14 · forge** — `T-C13` (#216): refactor validation sang `@philo-mind/shared`.
- [ ] **AUD-15 · forge+pixel** — Dọn 44 lint warning (`any`, biến không dùng). **Verify:** lint BE+FE 0 warning (hoặc còn lại có lý do).
- [ ] **AUD-16 · atlas** — Chốt nguồn dữ liệu canonical giữa `data/` và `data_real/`; xóa/đánh dấu bản dư. (Chương 1 dùng `data/chapter-01/` từ CH1-01.)
- [ ] **AUD-17 · atlas** — Cập nhật `docs/project-context.md` (tiến độ + hướng Mác–Lênin) khớp `sprint-status.md`.

---

## 5. Thứ tự chạy đề xuất

1. **CH1-00 → CH1-04**: chuẩn hóa nội dung + seed + test (atlas/sage/muse/forge/verity) — nền tảng cho mọi màn.
2. **CH1-05 → CH1-10**: wire UI Chương 1 song song theo feature (pixel chủ lực).
3. **Phase 2 (AUD)**: chỉnh IA/UX sau khi nội dung đã hiển thị đúng.
4. **Phase 3 (AUD)**: nợ kỹ thuật xen kẽ.

---

## 6. Quyết định nội dung đã chốt (2026-06-17)

1. ✅ **Đơn vị "mục"**: mỗi mục = **1 Topic**, gom bằng `category="Chương 1"`. (CH1-00)
2. ✅ **Story Episode đầu tiên**: mục **I.3 Biện chứng/Siêu hình** (ví dụ "bác tài xế công nghệ"). (CH1-09)
3. ⏳ **Còn mở**: phạm vi Flashcard — mọi mục hay chỉ khái niệm lưỡng phân? → Sage đề xuất ở CH1-01.
