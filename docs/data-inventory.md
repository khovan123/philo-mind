# PhiloMind — Danh Mục Dữ Liệu Đầu Vào (Data Inventory)

> Tổng hợp toàn bộ data cần chuẩn bị trước khi production, phân loại theo **loại dữ liệu** và **người phụ trách seed** (Hoàng Nguyễn — T-C01→C12).

---

## 📊 Tổng quan

| Loại | Số bảng | Seed task | Ước lượng records | Ưu tiên |
|------|---------|-----------|-------------------|---------|
| 🏛️ Nội dung triết học | 6 | T-C05, T-C06 | ~100 | 🔴 Cao |
| 📖 Story Mode | 3 | T-C07 | ~50 | 🔴 Cao |
| 🤖 AI Characters | 1 | T-C08 | 5 | 🔴 Cao |
| 🌍 Kịch bản thực tế | 2 | T-C09 | ~50 | 🟡 Trung bình |
| 💬 Tranh luận | 2 | T-C10 | ~30 | 🟡 Trung bình |
| 🎮 MiniGame | 1 | T-C11 | 5 | 🟡 Trung bình |
| 🏆 Gamification | 1 | T-C10 | 10 | 🟢 Thấp |
| 🧠 Mindmap | 2 | — | ~50 | 🟢 Thấp |
| 🔄 Đa góc nhìn | 1 (virtual) | T-C12 | 50 | 🟡 Trung bình |

---

## 1. 🏛️ Nội dung triết học cốt lõi

### 1.1 Topics (Chủ đề) — `topics`

| Field | Type | Mô tả | Ví dụ |
|-------|------|--------|-------|
| `title` | varchar(200) | Tên chủ đề | "Chủ nghĩa Khắc kỷ" |
| `description` | text | Mô tả ngắn | "Triết lý sống..." |
| `category` | varchar(100) | Phân loại | "Ethics", "Epistemology", "Political" |
| `difficulty` | enum | EASY / MEDIUM / HARD | EASY |

> **Cần:** 10 topics, phủ đều các nhánh triết học
> 
> **Gợi ý categories:** Ethics, Epistemology, Metaphysics, Political Philosophy, Existentialism, Logic, Aesthetics, Eastern Philosophy

---

### 1.2 Full Lessons (Bài học đầy đủ) — `lessons`

| Field | Type | Mô tả | Ví dụ |
|-------|------|--------|-------|
| `topicId` | FK → topics | Thuộc chủ đề nào | Chủ nghĩa Khắc kỷ |
| `title` | varchar(200) | Tiêu đề bài học | "Marcus Aurelius và nghệ thuật chấp nhận" |
| `content` | text (markdown) | Nội dung chính | 500-1000 từ, có heading, bold |
| `realLifeExample` | text | Ví dụ thực tế | "Khi bạn bị kẹt xe..." |
| `conflict` | text | Mâu thuẫn/tranh luận | "Nhưng liệu chấp nhận có = đầu hàng?" |
| `estimatedMinutes` | int | Thời gian đọc | 5-15 |
| `status` | enum | DRAFT / PUBLISHED | PUBLISHED |

> **Cần:** 20 lessons (2 per topic), mỗi bài 500-1000 từ markdown

---

### 1.3 Lesson Questions (Câu hỏi kèm bài) — `lesson_questions`

| Field | Type | Mô tả | Ví dụ |
|-------|------|--------|-------|
| `lessonId` | FK → lessons | Thuộc bài nào | — |
| `question` | text | Câu hỏi | "Bạn nghĩ gì về...?" |
| `questionType` | enum | OPEN_TEXT / SINGLE_CHOICE / MORAL_DILEMMA | OPEN_TEXT |

> **Cần:** 2-3 questions per lesson ≈ **50 questions**

---

### 1.4 Short Lessons (Bài học ngắn kiểu TikTok) — `short_lessons`

| Field | Type | Mô tả | Ví dụ |
|-------|------|--------|-------|
| `topicId` | FK → topics | Thuộc chủ đề | — |
| `title` | varchar(200) | Tiêu đề | "Trolley Problem 2.0" |
| `hook` | text | Câu hook gây tò mò | "Bạn sẽ hy sinh 1 để cứu 5?" |
| `insight` | text | Kiến thức cốt lõi | "Utilitarianism cho rằng..." |
| `conflict` | text | Góc nhìn đối lập | "Nhưng Kant nói rằng..." |
| `stanceA` | text | Quan điểm A | "Cứu số đông là đúng" |
| `stanceB` | text | Quan điểm B | "Không ai có quyền quyết định" |
| `estimatedSeconds` | int | ~30-60s | 45 |

> **Cần:** 30 short lessons (3 per topic), mỗi cái ~100-200 từ

---

### 1.5 Quiz (Kiểm tra kiến thức) — `quizzes` + `quiz_questions` + `quiz_options`

**Quiz:**
| Field | Type | Ví dụ |
|-------|------|-------|
| `lessonId` | FK → lessons | — |
| `title` | varchar(200) | "Quiz: Chủ nghĩa Khắc kỷ" |
| `quizType` | varchar(100) | "review", "challenge" |

**QuizQuestion:**
| Field | Type | Ví dụ |
|-------|------|-------|
| `question` | text | "Ai là người sáng lập Khắc kỷ?" |
| `questionType` | enum | SINGLE_CHOICE |

**QuizOption:**
| Field | Type | Ví dụ |
|-------|------|-------|
| `optionText` | text | "Zeno xứ Citium" |
| `isCorrect` | boolean | true |

> **Cần:** 10 quizzes (1 per 2 lessons), mỗi quiz 4 questions, mỗi question 4 options = **40 questions + 160 options**

---

### 1.6 Critical Questions (Câu hỏi tư duy phản biện) — `critical_questions`

| Field | Type | Ví dụ |
|-------|------|-------|
| `topicId` | FK → topics | — |
| `question` | text | "Nếu không có tự do ý chí, trách nhiệm đạo đức có tồn tại không?" |
| `questionType` | enum | MORAL_DILEMMA, LOGIC, OPEN_TEXT |

> **Cần:** 20 critical questions (2 per topic)

---

## 2. 📖 Story Mode (Kịch bản tương tác 7 bước)

### 2.1 Story Scenarios — `story_scenarios`

| Field | Type | Ví dụ |
|-------|------|-------|
| `topicId` | FK → topics | Chủ nghĩa Khắc kỷ |
| `title` | varchar(200) | "Quyết định của Marcus Aurelius" |
| `description` | text | "Bạn là hoàng đế La Mã..." |
| `characterRole` | text | "Hoàng đế La Mã Marcus Aurelius" |
| `historicalContext` | text | "Thế kỷ 2 SCN, đế chế đang suy yếu..." |
| `difficulty` | enum | MEDIUM |

> **Cần:** 5 story scenarios (1 per 2 topics)

### 2.2 Story Choices — `story_choices`

| Field | Type | Ví dụ |
|-------|------|-------|
| `storyId` | FK → story_scenarios | — |
| `choiceText` | text | "Trừng phạt kẻ phản bội" |
| `reasoningPrompt` | text | "Giải thích tại sao bạn chọn cách này..." |

> **Cần:** 2-3 choices per story = **~12 choices**

### 2.3 Story Consequences — `story_consequences`

| Field | Type | Ví dụ |
|-------|------|-------|
| `choiceId` | FK → story_choices | — |
| `resultText` | text | "Bạn đã chọn tha thứ. Binh sĩ..." |
| `ethicalAnalysis` | text | "Góc nhìn đạo đức: Lòng nhân..." |
| `philosophicalAnalysis` | text | "Theo Khắc kỷ, đây là..." |
| `politicalEconomicAnalysis` | text | "Về mặt chính trị..." |
| `historicalImpact` | text | "Trong lịch sử thực tế..." |

> **Cần:** 1 consequence per choice = **~12 consequences**, mỗi cái có 4 loại phân tích

---

## 3. 🤖 AI Characters (Nhân vật AI để chat) — `ai_characters`

| Field | Type | Ví dụ |
|-------|------|-------|
| `name` | varchar(150) | "Socrates" |
| `type` | varchar(100) | "Philosopher", "Modern Thinker" |
| `bio` | text | "Triết gia Hy Lạp cổ đại, cha đẻ..." |
| `worldview` | text | "Tin rằng cuộc sống không suy xét..." |
| `promptInstruction` | text | System prompt cho Gemini API |

> **Cần:** 5 AI characters, mỗi cái cần:
> - Bio (~200 từ)
> - Worldview (~100 từ)
> - System prompt (~300-500 từ, chi tiết personality, speaking style, knowledge scope)

**Gợi ý nhân vật:**
1. **Socrates** — Phương pháp vấn đáp
2. **Confucius** — Triết học phương Đông
3. **Simone de Beauvoir** — Hiện sinh & nữ quyền
4. **Marcus Aurelius** — Khắc kỷ
5. **Peter Singer** — Đạo đức thực dụng hiện đại

---

## 4. 🌍 Kịch bản thực tế (Real-life Scenarios) — `real_life_scenarios`

### 4.1 Scenarios

| Field | Type | Ví dụ |
|-------|------|-------|
| `topicId` | FK → topics | Ethics |
| `title` | varchar(200) | "Đồng nghiệp gian lận" |
| `situation` | text | "Bạn phát hiện đồng nghiệp thân..." |
| `context` | text | "Công ty nhỏ, 50 nhân viên..." |

> **Cần:** 10 scenarios (1 per topic)

### 4.2 Scenario Analyses (Đa góc nhìn) — `scenario_analyses`

| Field | Type | Ví dụ |
|-------|------|-------|
| `scenarioId` | FK | — |
| `perspectiveType` | varchar(100) | "utilitarian", "deontological", "virtue_ethics", "care_ethics" |
| `analysisContent` | text | "Từ góc nhìn thực dụng, bạn nên..." |

> **Cần:** 4 perspectives per scenario = **40 analyses**, mỗi cái ~150-200 từ

---

## 5. 💬 Tranh luận (Debates) — `debates`

| Field | Type | Ví dụ |
|-------|------|-------|
| `topicId` | FK → topics | Ethics |
| `title` | varchar(200) | "Có nên phạt tử hình?" |
| `description` | text | "Cuộc tranh luận về..." |
| `status` | enum | OPEN |

> **Cần:** 10 debates (1 per topic), mỗi cái có title + description (~100 từ)

---

## 6. 🎮 MiniGames — `mini_games`

| Field | Type | Ví dụ |
|-------|------|-------|
| `title` | varchar(200) | "Ai nói điều này?" |
| `gameType` | varchar(100) | "matching", "guess-who", "logic-puzzle" |
| `description` | text | "Ghép câu nói nổi tiếng..." |
| `config` | JSON | Game-specific rules & data |

> **Cần:** 5 mini-games, mỗi cái cần:

### Config JSON structure mẫu:

```json
// matching game
{
  "type": "matching",
  "pairs": [
    { "left": "\"Tôi tư duy, vậy tôi tồn tại\"", "right": "Descartes" },
    { "left": "\"Cái đẹp cứu rỗi thế giới\"", "right": "Dostoevsky" }
  ],
  "timeLimit": 60
}

// guess-who game
{
  "type": "guess-who",
  "clues": [
    { "clue": "Sinh ra ở Athens, thế kỷ 5 TCN", "answer": "Socrates" },
    { "clue": "Người này bị kết án tử hình bằng thuốc độc", "answer": "Socrates" }
  ]
}

// logic-puzzle game
{
  "type": "logic-puzzle",
  "premises": ["Mọi người đều sẽ chết", "Socrates là người"],
  "conclusion": "Socrates sẽ chết",
  "isValid": true
}
```

---

## 7. 🏆 Badges (Huy hiệu) — `badges`

| Field | Type | Ví dụ |
|-------|------|-------|
| `name` | varchar(150) | "Nhà tư duy phản biện" |
| `description` | text | "Hoàn thành 5 bài reflection" |
| `iconUrl` | text | URL hoặc icon name |
| `conditionType` | varchar(100) | "reflection_count_5", "story_complete_3" |

> **Cần:** 10 badges

**Gợi ý badge system:**

| Badge | Condition | Icon |
|-------|-----------|------|
| Người mới | Hoàn thành onboarding | 🌱 |
| Nhà triết học tập sự | Đọc 5 lessons | 📚 |
| Tư duy phản biện | 5 reflections | 🧠 |
| Người kể chuyện | Hoàn thành 3 stories | 📖 |
| Nhà tranh luận | 5 debate arguments | 💬 |
| Đa góc nhìn | Xem 10 perspectives | 👁️ |
| Quiz Master | Score 100% 3 lần | 🏆 |
| Streaker | 7 ngày liên tiếp | 🔥 |
| Game Champion | Score #1 mini-game | 🎮 |
| Triết gia | Hoàn thành tất cả topics | 🎓 |

---

## 8. 🧠 Mindmap — `mindmap_nodes` + `mindmap_edges`

**Nodes:**
| Field | Type | Ví dụ |
|-------|------|-------|
| `topicId` | FK → topics | — |
| `title` | varchar(200) | "Chủ nghĩa Khắc kỷ" |
| `description` | text | "Trường phái..." |
| `nodeType` | varchar(100) | "concept", "philosopher", "school", "era" |

**Edges:**
| Field | Type | Ví dụ |
|-------|------|-------|
| `sourceNodeId` | FK → nodes | Socrates |
| `targetNodeId` | FK → nodes | Plato |
| `relationType` | varchar(100) | "influenced", "opposed", "belongs_to" |

> **Cần:** ~5 nodes + ~5 edges per topic = **~50 nodes, ~50 edges**

---

## 9. 🔄 Topic Perspectives — `scenario_analyses` (reused)

> Dùng bảng `ScenarioAnalysis` với `perspectiveType` cho multi-perspective viewer.

| perspectiveType | Mô tả |
|-----------------|--------|
| `utilitarian` | Chủ nghĩa thực dụng |
| `deontological` | Nghĩa vụ luận (Kant) |
| `virtue_ethics` | Đạo đức đức hạnh |
| `care_ethics` | Đạo đức quan tâm |
| `existentialist` | Hiện sinh |

> **Cần:** 5 perspectives × 10 topics = **50 analysis entries** (T-C12)

---

## 📦 Tổng kết số lượng Data

| # | Loại data | Số lượng | Ước lượng text | Phụ trách |
|---|-----------|----------|----------------|-----------|
| 1 | Topics | 10 | ~2,000 từ | Hoàng (T-C05) |
| 2 | Full Lessons | 20 | ~15,000 từ | Hoàng (T-C06) |
| 3 | Lesson Questions | 50 | ~2,500 từ | Hoàng (T-C06) |
| 4 | Short Lessons | 30 | ~4,500 từ | Hoàng (T-C05) |
| 5 | Quizzes | 10 | — | Hoàng (T-C06) |
| 6 | Quiz Questions + Options | 40 + 160 | ~4,000 từ | Hoàng (T-C06) |
| 7 | Critical Questions | 20 | ~1,000 từ | Hoàng (T-C10) |
| 8 | Story Scenarios | 5 | ~2,500 từ | Hoàng (T-C07) |
| 9 | Story Choices | 12 | ~600 từ | Hoàng (T-C07) |
| 10 | Story Consequences | 12 | ~4,800 từ | Hoàng (T-C07) |
| 11 | AI Characters | 5 | ~3,000 từ | Hoàng (T-C08) |
| 12 | Real-life Scenarios | 10 | ~2,000 từ | Hoàng (T-C09) |
| 13 | Scenario Analyses | 40 | ~7,000 từ | Hoàng (T-C09) |
| 14 | Debates | 10 | ~1,000 từ | Hoàng (T-C10) |
| 15 | Badges | 10 | ~500 từ | Hoàng (T-C10) |
| 16 | MiniGames | 5 | ~JSON configs | Hoàng (T-C11) |
| 17 | Topic Perspectives | 50 | ~7,500 từ | Hoàng (T-C12) |
| 18 | Mindmap Nodes | 50 | ~2,500 từ | Manual / AI |
| 19 | Mindmap Edges | 50 | — | Manual / AI |
| | **TỔNG** | **~599 records** | **~60,400 từ** | |

---

## ⚠️ Lưu ý quan trọng

> [!IMPORTANT]
> **Nội dung triết học phải chính xác.** Không được bịa thông tin lịch sử, trích dẫn sai triết gia, hoặc mô tả nhầm trường phái.

> [!TIP]
> **Có thể dùng AI (Gemini/GPT) để draft nội dung**, sau đó review thủ công bởi team member có kiến thức triết học.

> [!WARNING]
> **System prompts cho AI Characters cực kỳ quan trọng.** Prompt kém = chatbot trả lời nhảm. Cần test kỹ trước khi seed.

---

## 🗓️ Timeline Seed Data

```
W1: T-C01→C04  → Shared types (không cần data, chỉ TypeScript types)
W2: T-C05      → 10 Topics + 30 Short Lessons  ← CẦN DATA
    T-C06      → 20 Full Lessons + 40 Quiz Questions  ← CẦN DATA
W3: T-C07      → 5 Story Scenarios + Choices + Consequences  ← CẦN DATA
    T-C08      → 5 AI Characters + System Prompts  ← CẦN DATA
    T-C09      → 10 Real-life Scenarios + 40 Analyses  ← CẦN DATA
    T-C10      → 10 Debates + 20 Critical Questions + 10 Badges  ← CẦN DATA
    T-C11      → 5 MiniGames (JSON configs)  ← CẦN DATA
    T-C12      → 50 Topic Perspectives  ← CẦN DATA
```
