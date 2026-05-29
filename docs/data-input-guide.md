# PhiloMind — Hướng Dẫn Soạn Dữ Liệu Nội Dung

> **Dành cho:** Team soạn nội dung (data team)
> **Không cần biết code.** Chỉ cần điền đúng mẫu, dev sẽ import vào hệ thống.

---

## 📌 Tổng quan: Cần soạn gì?

| # | Loại nội dung | Số lượng cần | File mẫu | Deadline |
|---|--------------|-------------|----------|----------|
| 1 | Chủ đề (Topics) | 10 | `data/01-topics.csv` | Tuần 2 |
| 2 | Bài học ngắn (Short Lessons) | 30 | `data/02-short-lessons.csv` | Tuần 2 |
| 3 | Bài học đầy đủ (Full Lessons) | 20 | `data/03-full-lessons/` | Tuần 2 |
| 4 | Câu hỏi quiz | 40 câu × 4 đáp án | `data/04-quizzes.csv` | Tuần 2 |
| 5 | Kịch bản Story Mode | 5 kịch bản | `data/05-stories/` | Tuần 3 |
| 6 | Nhân vật AI Chat | 5 nhân vật | `data/06-ai-characters.csv` | Tuần 3 |
| 7 | Kịch bản đời thực | 10 kịch bản | `data/07-scenarios.csv` | Tuần 3 |
| 8 | Đề tài tranh luận | 10 đề tài | `data/08-debates.csv` | Tuần 3 |
| 9 | Câu hỏi tư duy | 20 câu | `data/09-critical-questions.csv` | Tuần 3 |
| 10 | Huy hiệu | 10 huy hiệu | `data/10-badges.csv` | Tuần 3 |
| 11 | Mini Games | 5 games | `data/11-minigames/` | Tuần 3 |
| 12 | Bản đồ tư duy (Mindmap) | 10 chủ đề | `data/12-mindmaps/` | Tuần 3 |
| 13 | Đa góc nhìn | 50 phân tích | `data/13-perspectives.csv` | Tuần 3 |

---

## 1. Chủ đề (Topics)

**File:** `data/01-topics.csv`

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `tên_chủ_đề` | Tên ngắn gọn, hấp dẫn | Chủ nghĩa Khắc kỷ |
| `mô_tả` | 2-3 câu giới thiệu | Triết lý giúp bạn bình thản trước mọi biến cố, bắt nguồn từ Hy Lạp cổ đại |
| `phân_loại` | 1 trong: Đạo đức, Nhận thức, Siêu hình, Chính trị, Hiện sinh, Logic, Phương Đông, Mỹ học | Đạo đức |
| `độ_khó` | Dễ / Trung bình / Khó | Dễ |

**Cần 10 chủ đề**, phủ đều các phân loại.

---

## 2. Bài học ngắn (Short Lessons) — kiểu thẻ vuốt TikTok

**File:** `data/02-short-lessons.csv`

Mỗi bài gồm **5 phần**, mỗi phần là 1 thẻ vuốt:

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `chủ_đề` | Tên chủ đề (khớp với file 01) | Đạo đức học |
| `tiêu_đề` | Gây tò mò, ngắn | Trolley Problem 2.0 |
| `hook` | 1-2 câu gây sốc / tò mò. Khiến người đọc muốn xem tiếp | "Bạn đang lái tàu. Phía trước 5 người bị trói trên đường ray. Bạn có thể chuyển hướng — nhưng sẽ giết 1 người khác." |
| `insight` | Kiến thức cốt lõi. 2-3 câu giải thích triết học đằng sau | "Đây là bài toán nổi tiếng của Philippa Foot. Chủ nghĩa Thực dụng nói: cứu 5 > hy sinh 1. Nhưng..." |
| `conflict` | Góc nhìn đối lập, tạo mâu thuẫn | "Kant phản đối: dùng 1 người làm phương tiện là vi phạm phẩm giá con người, dù kết quả có tốt đến đâu." |
| `quan_điểm_A` | Ý kiến 1 (ngắn, rõ) | "Cứu số đông là hành động đúng đắn" |
| `quan_điểm_B` | Ý kiến 2 (đối lập) | "Không ai có quyền quyết định ai sống ai chết" |

**Cần 30 bài** (3 bài mỗi chủ đề). Mỗi bài tổng ~100-150 từ.

---

## 3. Bài học đầy đủ (Full Lessons)

**Thư mục:** `data/03-full-lessons/`
**Mỗi bài = 1 file markdown riêng**, đặt tên: `01-ten-bai.md`

### Mẫu file:

```markdown
---
chủ_đề: Chủ nghĩa Khắc kỷ
tiêu_đề: Marcus Aurelius và nghệ thuật chấp nhận
thời_gian_đọc: 8 phút
---

## Nội dung chính

Viết ở đây. 500-1000 từ.

- Dùng **in đậm** cho khái niệm quan trọng
- Có thể dùng heading ##, ###
- Kể câu chuyện, đừng viết kiểu giáo khoa

## Ví dụ thực tế

Một tình huống trong đời sống hàng ngày minh họa cho bài học.

Ví dụ: "Sáng thứ Hai, bạn bị kẹt xe 45 phút. Phản ứng thông thường: bực bội, bấm còi. Phản ứng Khắc kỷ: 'Tôi không kiểm soát được giao thông, nhưng tôi kiểm soát được phản ứng của mình.'"

## Câu hỏi tranh luận

Một câu hỏi mở để người đọc suy ngẫm.

Ví dụ: "Nhưng liệu chấp nhận mọi thứ có đồng nghĩa với đầu hàng? Khi nào thì nên đấu tranh thay vì chấp nhận?"
```

**Cần 20 bài** (2 bài mỗi chủ đề).

**Kèm theo mỗi bài, soạn 2-3 câu hỏi ôn tập** ở cuối file:

```markdown
## Câu hỏi ôn tập

1. (Tự luận) Bạn nghĩ gì về cách Marcus Aurelius đối mặt với khó khăn?
2. (Tình huống) Nếu bạn mất việc, bạn sẽ áp dụng triết lý Khắc kỷ thế nào?
```

---

## 4. Quiz (Câu hỏi trắc nghiệm)

**File:** `data/04-quizzes.csv`

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `bài_học` | Tên bài học tương ứng | Marcus Aurelius và nghệ thuật chấp nhận |
| `câu_hỏi` | Câu hỏi rõ ràng | Ai là người sáng lập Chủ nghĩa Khắc kỷ? |
| `đáp_án_A` | Lựa chọn A | Plato |
| `đáp_án_B` | Lựa chọn B | Zeno xứ Citium |
| `đáp_án_C` | Lựa chọn C | Aristotle |
| `đáp_án_D` | Lựa chọn D | Epicurus |
| `đáp_án_đúng` | A / B / C / D | B |
| `loại` | trắc_nghiệm / tình_huống / logic | trắc_nghiệm |

**Cần 40 câu** (4 câu mỗi quiz, 2 quiz mỗi chủ đề).

---

## 5. Kịch bản Story Mode (Trải nghiệm 7 bước)

**Thư mục:** `data/05-stories/`
**Mỗi story = 1 file**, đặt tên: `01-ten-story.md`

### Mẫu file:

```markdown
---
chủ_đề: Đạo đức học
tiêu_đề: Quyết định của bác sĩ
nhân_vật: Bạn là bác sĩ trưởng khoa cấp cứu
bối_cảnh_lịch_sử: Bệnh viện công, mùa dịch, thiếu giường ICU
độ_khó: Trung bình
---

## Tình huống

Mô tả bối cảnh 3-5 câu. Viết ngôi thứ 2 ("Bạn là...").

"Bạn là bác sĩ trưởng khoa. Đêm nay có 3 bệnh nhân nguy kịch nhưng chỉ còn 1 giường ICU: một em bé 5 tuổi, một nhà khoa học 45 tuổi đang nghiên cứu vaccine, và một cụ già 80 tuổi."

## Lựa chọn

### Lựa chọn 1: Ưu tiên em bé
- Gợi ý suy nghĩ: "Tại sao bạn cho rằng tuổi trẻ nên được ưu tiên?"

### Lựa chọn 2: Ưu tiên nhà khoa học
- Gợi ý suy nghĩ: "Giá trị xã hội có nên là tiêu chí cứu người?"

### Lựa chọn 3: Ưu tiên cụ già (đến trước)
- Gợi ý suy nghĩ: "Công bằng theo thứ tự có phải là công bằng thật sự?"

## Hậu quả

### Nếu chọn 1 (Em bé):
- **Kết quả:** "Em bé được cứu. Gia đình nhà khoa học khiếu nại..."
- **Phân tích đạo đức:** "Từ góc nhìn đạo đức quan tâm (care ethics)..."
- **Phân tích triết học:** "Theo thuyết Quyền tự nhiên..."
- **Phân tích chính trị - xã hội:** "Hệ thống y tế công..."
- **Bối cảnh lịch sử:** "Trong lịch sử y khoa, tiêu chí phân bổ..."

### Nếu chọn 2 (Nhà khoa học):
(tương tự 4 phân tích)

### Nếu chọn 3 (Cụ già):
(tương tự 4 phân tích)
```

**Cần 5 kịch bản**, mỗi cái có 2-3 lựa chọn + hậu quả chi tiết.

---

## 6. Nhân vật AI Chat

**File:** `data/06-ai-characters.csv`

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `tên` | Tên nhân vật | Socrates |
| `loại` | Triết gia cổ đại / Hiện đại / Hư cấu | Triết gia cổ đại |
| `tiểu_sử` | 3-5 câu giới thiệu (~100 từ) | Triết gia Hy Lạp, sống ở Athens thế kỷ 5 TCN. Nổi tiếng với phương pháp vấn đáp — không bao giờ đưa câu trả lời, chỉ hỏi ngược lại. Bị kết án tử hình vì "làm hư hỏng thanh niên"... |
| `thế_giới_quan` | Nhân vật này tin vào điều gì? (~50 từ) | Tin rằng cuộc sống không suy xét thì không đáng sống. Kiến thức thật sự bắt đầu từ việc thừa nhận mình không biết gì. |
| `cách_nói_chuyện` | Mô tả giọng điệu (~100 từ) | Luôn hỏi ngược lại. Không bao giờ đưa câu trả lời thẳng. Dùng ví dụ đời thường. Nhẹ nhàng nhưng sắc bén. Thường bắt đầu bằng "Thú vị đấy, nhưng bạn có nghĩ rằng...?" |
| `phạm_vi_kiến_thức` | Biết gì, không biết gì | Chuyên về đạo đức, nhận thức luận, logic. Không biết về khoa học hiện đại, công nghệ, chính trị đương đại. |

**Cần 5 nhân vật.** Gợi ý:
1. Socrates (vấn đáp)
2. Khổng Tử (phương Đông)
3. Simone de Beauvoir (hiện sinh / nữ quyền)
4. Marcus Aurelius (Khắc kỷ)
5. Peter Singer (đạo đức thực dụng hiện đại)

---

## 7. Kịch bản đời thực (Real-life Scenarios)

**File:** `data/07-scenarios.csv`

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `chủ_đề` | Tên chủ đề | Đạo đức học |
| `tiêu_đề` | Tình huống ngắn gọn | Đồng nghiệp gian lận |
| `tình_huống` | Mô tả chi tiết tình huống (~100 từ) | Bạn phát hiện đồng nghiệp thân nhất đang khai khống chi phí công tác. Số tiền không lớn nhưng rõ ràng là gian lận. Nếu báo cáo, anh ấy sẽ bị đuổi việc — gia đình anh ấy đang rất khó khăn... |
| `bối_cảnh` | Thông tin thêm | Công ty nhỏ 50 người, bạn làm 3 năm, đồng nghiệp này đã giúp bạn rất nhiều |
| `phân_tích_thực_dụng` | Góc nhìn chủ nghĩa thực dụng (~100 từ) | Xét tổng thể hạnh phúc: báo cáo gây hại lớn (mất việc, gia đình)... |
| `phân_tích_nghĩa_vụ` | Góc nhìn Kant (~100 từ) | Theo Kant, gian lận là sai bất kể hoàn cảnh... |
| `phân_tích_đức_hạnh` | Góc nhìn đạo đức đức hạnh (~100 từ) | Một người có đức hạnh sẽ... |
| `phân_tích_quan_tâm` | Góc nhìn đạo đức quan tâm (~100 từ) | Mối quan hệ giữa bạn và đồng nghiệp... |

**Cần 10 kịch bản** (1 mỗi chủ đề), mỗi cái có 4 góc phân tích.

---

## 8. Đề tài tranh luận (Debates)

**File:** `data/08-debates.csv`

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `chủ_đề` | Tên chủ đề | Đạo đức học |
| `tiêu_đề` | Câu hỏi tranh luận, gây chia rẽ | Có nên cho phép trợ tử (euthanasia)? |
| `mô_tả` | Bối cảnh cuộc tranh luận (~80 từ) | Euthanasia — quyền được chết nhân đạo — hiện hợp pháp ở Hà Lan, Bỉ, Canada. Những người ủng hộ cho rằng đây là quyền tự chủ... |

**Cần 10 đề tài.** Chọn chủ đề gây tranh cãi thật sự, có 2 phe rõ ràng.

---

## 9. Câu hỏi tư duy phản biện (Critical Questions)

**File:** `data/09-critical-questions.csv`

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `chủ_đề` | Tên chủ đề | Siêu hình học |
| `câu_hỏi` | Câu hỏi mở, kích thích suy nghĩ sâu | Nếu không có tự do ý chí, trách nhiệm đạo đức có tồn tại không? |
| `loại` | tự_luận / tình_huống_đạo_đức / logic | tình_huống_đạo_đức |

**Cần 20 câu** (2 mỗi chủ đề). Câu hỏi phải KHÔNG có đáp án đúng sai — chỉ kích thích suy nghĩ.

---

## 10. Huy hiệu (Badges)

**File:** `data/10-badges.csv`

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `tên` | Tên huy hiệu hay, hấp dẫn | Nhà tư duy phản biện |
| `mô_tả` | 1 câu mô tả cách đạt được | Viết 5 bài suy ngẫm (reflection) |
| `icon` | Emoji đại diện | 🧠 |
| `điều_kiện` | Viết rõ ràng để dev code | reflection_count >= 5 |

**Cần 10 huy hiệu.** Bao gồm: mới bắt đầu, đọc bài, viết suy ngẫm, chơi story, tranh luận, quiz, streak, v.v.

---

## 11. Mini Games

**Thư mục:** `data/11-minigames/`
**Mỗi game = 1 file**, đặt tên: `01-ten-game.md`

### Game 1: Ghép đôi (Matching)

```markdown
---
tên: Ai nói điều này?
loại: matching
mô_tả: Ghép câu nói nổi tiếng với triết gia đã nói
thời_gian: 60 giây
---

| Câu nói | Triết gia |
|---------|-----------|
| "Tôi tư duy, vậy tôi tồn tại" | Descartes |
| "Cái đẹp cứu rỗi thế giới" | Dostoevsky |
| "Con người bị kết án phải tự do" | Sartre |
| "Biết mình không biết gì là khởi đầu của trí tuệ" | Socrates |
| "Kẻ thù lớn nhất của kiến thức không phải vô tri, mà là ảo tưởng về kiến thức" | Stephen Hawking |
```

### Game 2: Đoán ai (Guess Who)

```markdown
---
tên: Triết gia bí ẩn
loại: guess-who
mô_tả: Đoán triết gia qua các gợi ý, càng ít gợi ý điểm càng cao
---

### Nhân vật 1:
- Gợi ý 1 (khó): Sinh ở Stagira, Hy Lạp
- Gợi ý 2: Thầy của Alexander Đại đế
- Gợi ý 3: Viết cuốn "Nicomachean Ethics"
- Gợi ý 4 (dễ): Học trò của Plato
- Đáp án: Aristotle
```

### Game 3: Câu đố logic

```markdown
---
tên: Logic train
loại: logic-puzzle
mô_tả: Xác định lập luận đúng hay sai
---

### Câu 1:
- Tiền đề 1: Mọi người đều sẽ chết
- Tiền đề 2: Socrates là người
- Kết luận: Socrates sẽ chết
- Đúng hay sai? ĐÚNG
- Giải thích: Đây là tam đoạn luận (syllogism) hợp lệ...
```

**Cần 5 games** (có thể lặp lại loại nhưng nội dung khác).

---

## 12. Bản đồ tư duy (Mindmap)

**Thư mục:** `data/12-mindmaps/`
**Mỗi chủ đề = 1 file**

```markdown
---
chủ_đề: Chủ nghĩa Khắc kỷ
---

## Các khái niệm (Nodes)

| Tên | Loại | Mô tả ngắn |
|-----|------|-------------|
| Chủ nghĩa Khắc kỷ | trường_phái | Trường phái triết học Hy Lạp |
| Zeno | triết_gia | Người sáng lập |
| Epictetus | triết_gia | Triết gia nô lệ |
| Marcus Aurelius | triết_gia | Hoàng đế - triết gia |
| Apatheia | khái_niệm | Trạng thái không bị chi phối bởi cảm xúc |
| Dichotomy of Control | khái_niệm | Phân biệt điều kiểm soát được và không |

## Các liên kết (Edges)

| Từ | Đến | Quan hệ |
|----|-----|---------|
| Zeno | Chủ nghĩa Khắc kỷ | sáng_lập |
| Marcus Aurelius | Chủ nghĩa Khắc kỷ | thuộc_về |
| Epictetus | Marcus Aurelius | ảnh_hưởng |
| Chủ nghĩa Khắc kỷ | Apatheia | bao_gồm |
| Chủ nghĩa Khắc kỷ | Dichotomy of Control | bao_gồm |
```

**Cần 10 mindmaps** (1 mỗi chủ đề), mỗi cái ~5-8 nodes.

---

## 13. Đa góc nhìn (Perspectives)

**File:** `data/13-perspectives.csv`

| Cột | Hướng dẫn | Ví dụ |
|-----|-----------|-------|
| `chủ_đề` | Tên chủ đề | Đạo đức học |
| `góc_nhìn` | 1 trong 5 loại bên dưới | thực_dụng |
| `nội_dung` | Phân tích 100-150 từ | "Từ góc nhìn thực dụng, đạo đức học đánh giá hành vi dựa trên kết quả..." |

**5 góc nhìn cho MỖI chủ đề:**
1. `thực_dụng` — Utilitarianism (kết quả tốt nhất cho số đông)
2. `nghĩa_vụ` — Deontology / Kant (nghĩa vụ đạo đức, bất chấp kết quả)
3. `đức_hạnh` — Virtue Ethics (phẩm chất con người)
4. `quan_tâm` — Care Ethics (mối quan hệ, đồng cảm)
5. `hiện_sinh` — Existentialism (tự do cá nhân, trách nhiệm)

**Cần 50 entries** (5 góc nhìn × 10 chủ đề).

---

## ⚠️ Quy tắc soạn nội dung

1. **Chính xác:** Không bịa thông tin lịch sử, không trích dẫn sai triết gia
2. **Dễ hiểu:** Viết cho người 16-25 tuổi, tránh thuật ngữ hàn lâm nặng
3. **Hấp dẫn:** Kể chuyện, đặt câu hỏi, tạo mâu thuẫn — đừng viết như sách giáo khoa
4. **Đa chiều:** Mỗi chủ đề phải trình bày ≥ 2 quan điểm đối lập, không thiên vị
5. **Có ví dụ thực:** Luôn kèm ví dụ đời sống hàng ngày (không chỉ lý thuyết)

---

## 📂 Cấu trúc thư mục

```
data/
├── 01-topics.csv
├── 02-short-lessons.csv
├── 03-full-lessons/
│   ├── 01-marcus-aurelius-va-nghe-thuat-chap-nhan.md
│   ├── 02-plato-va-the-gioi-y-tuong.md
│   └── ...
├── 04-quizzes.csv
├── 05-stories/
│   ├── 01-quyet-dinh-cua-bac-si.md
│   └── ...
├── 06-ai-characters.csv
├── 07-scenarios.csv
├── 08-debates.csv
├── 09-critical-questions.csv
├── 10-badges.csv
├── 11-minigames/
│   ├── 01-ai-noi-dieu-nay.md
│   └── ...
├── 12-mindmaps/
│   ├── 01-chu-nghia-khac-ky.md
│   └── ...
└── 13-perspectives.csv
```
