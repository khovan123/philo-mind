# Tài Liệu Kỹ Thuật: Hệ Thống Tìm Kiếm Lai (Hybrid Search V1)

Tài liệu này mô tả chi tiết kiến trúc, quy trình xử lý dữ liệu và thuật toán được sử dụng để nâng cấp công cụ tìm kiếm trên ứng dụng PhiloMind thành **Hybrid Search V1**: kết hợp **PostgreSQL Full-Text Search (FTS)** với **Semantic Search bằng Vector Embeddings**, sau đó hợp nhất thứ hạng bằng **Reciprocal Rank Fusion (RRF)**.

---

## 1. Tổng Quan Kiến Trúc

Hệ thống hoạt động theo mô hình **PostgreSQL FTS + pgvector Semantic Search**:

- **Lưu trữ:** Embedding được lưu trong PostgreSQL dưới hai dạng: cột `embedding Float[]` để giữ dữ liệu gốc/backfill và cột `embedding_vec halfvec(3072)` để truy vấn semantic bằng pgvector.
- **FTS:** PostgreSQL tạo materialized view `search_documents`, lưu `fts_vector`, và đánh index GIN để tìm keyword/thuật ngữ chính xác.
- **Semantic:** PostgreSQL/pgvector chạy cosine similarity trực tiếp trên `embedding_vec` với HNSW index (`halfvec_cosine_ops`); backend không load toàn bộ vector vào RAM.
- **Sinh Vector:** Sử dụng mô hình **`gemini-embedding-001`** của Google thông qua Gemini API.
- **Reranking:** Kết quả FTS và Semantic được hợp nhất bằng RRF, tránh phải so sánh trực tiếp `ts_rank_cd` với cosine score vì hai loại điểm không cùng thang đo.

```mermaid
graph TD
    subgraph Giai đoạn chuẩn bị (Seed/Backfill)
        A[Nội dung chữ gốc] -->|Gemini API: gemini-embedding-001| B[Mảng số thực Vector 3072 chiều]
        B -->|Float[] + halfvec(3072)| C[(PostgreSQL Database)]
    end

    subgraph Giai đoạn Runtime
        C -->|halfvec + HNSW| D[pgvector Semantic Index]
        C -->|Materialized View + GIN| I[PostgreSQL FTS: search_documents]
    end

    subgraph Giai đoạn Tìm kiếm (Query)
        E[Từ khóa tìm kiếm của User] -->|Gemini API| F[Vector từ khóa]
        F -->|embedding_vec <=> query| G[PostgreSQL pgvector Rank]
        E -->|websearch_to_tsquery simple| J[PostgreSQL FTS Rank]
        G -->|Semantic top K| K[RRF Fusion]
        J -->|FTS top K| K
        K -->|Xếp hạng lai| H[Kết quả gửi về Frontend]
    end
```

---

## 2. Cách Thực Hiện Embedding (Sinh Vector)

Quá trình sinh Vector được thực hiện trong `ai.service.ts`.

### Cấu trúc hóa nội dung trước khi nhúng (Embedding):

Để AI hiểu rõ ngữ cảnh, chúng ta không chỉ gửi tiêu đề bài học mà gộp chung tất cả ngữ cảnh liên quan thành một chuỗi văn bản mô tả đầy đủ:

- **Đối với Bài học (ChapterNode):**
  `"Lesson: [Tiêu đề]. Muc: [Mục]. Chapter: [Tên chương]. Content: [Nội dung tóm tắt các thẻ lý thuyết]"`
- **Đối với Video (Movie):**
  `"Interactive Movie Video: [Tiêu đề]. Muc: [Mục]"`
- **Đối với Trắc nghiệm (Quiz):**
  `"Quiz Trắc nghiệm: [Tiêu đề]. Questions: [Nội dung các câu hỏi + giải thích]"`

### Hàm tạo Vector:

```typescript
async getEmbedding(text: string): Promise<number[]> {
  try {
    // Sử dụng model gemini-embedding-001
    const model = this.client.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await this.withTimeout(model.embedContent(text));
    const embedding = result.embedding?.values;

    if (!embedding) {
      throw new AiError("EMPTY_EMBEDDING", "Gemini returned empty embedding", 502);
    }
    return embedding; // Trả về mảng số thực đại diện cho ngữ nghĩa
  } catch (error) {
    // Xử lý lỗi...
  }
}
```

---

## 3. Cách Truy Vấn Dữ Liệu (Query)

Khi người dùng nhập từ khóa tìm kiếm (ví dụ: _"bóc lột"_), quy trình xử lý diễn ra như sau:

### Bước 1: Tạo Vector từ khóa

Hệ thống chuyển đổi từ khóa tìm kiếm thành một Vector từ khóa duy nhất bằng cách gọi lại hàm `getEmbedding(query)`.

### Bước 2: Chạy Semantic Search

Để tìm ra các tài liệu có ngữ nghĩa gần với từ khóa nhất, backend gửi vector truy vấn vào PostgreSQL và dùng pgvector cosine distance:

```sql
1 - (embedding_vec <=> query_embedding) AS semanticScore
```

`<=>` là cosine distance của pgvector; điểm semantic càng cao thì càng giống. Các bảng nguồn (`chapter_nodes`, `movies`, `quizzes`) có HNSW index trên `embedding_vec halfvec(3072)`.

### Bước 3: Chạy PostgreSQL FTS

Backend truy vấn materialized view `search_documents` bằng `websearch_to_tsquery('simple', query)` và xếp hạng bằng `ts_rank_cd`.

Nguồn dữ liệu FTS gồm:

- Bài học (`chapter_nodes`) + chương + theory cards trong JSON.
- Video tương tác (`movies`) + script JSON.
- Quiz (`quizzes`) + câu hỏi và giải thích.

### Bước 4: Lọc kết quả và Xếp hạng từng nguồn

- **Ngưỡng lọc (Threshold):** Chỉ giữ lại các tài liệu có điểm tương quan lớn hơn `0.3` để tránh hiển thị nội dung rác.
- **Lọc theo tab (Type Filter):** Lọc theo phân loại mà người dùng chọn (Tất cả / Bài học / Video / Quiz).
- **Top K:** Mỗi nguồn trả về tối đa 50 kết quả.

### Bước 5: Hợp nhất bằng RRF

RRF tính lại điểm dựa trên thứ hạng của mỗi item trong từng danh sách:

```typescript
score = semanticWeight / (rrfK + semanticRank) + ftsWeight / (rrfK + ftsRank);
```

Thông số hiện tại:

- `rrfK = 60`
- `semanticWeight = 1`
- `ftsWeight = 1.15`

FTS được nhỉnh hơn một chút để ưu tiên thuật ngữ học thuật, mục bài, và exact keyword.

---

## 4. Cơ Chế Dự Phòng (Fallback)

Trong trường hợp có sự cố mạng hoặc lỗi API Gemini khi người dùng đang tìm kiếm, hệ thống vẫn dùng được FTS. Nếu cả semantic lẫn FTS đều không trả kết quả, backend chuyển sang cơ chế **Keyword Match**:

- Sử dụng hàm `String.includes` thường trên trường dữ liệu tìm kiếm đã chuẩn bị sẵn để đảm bảo người dùng vẫn nhận được kết quả phù hợp thô và ứng dụng không bao giờ bị crash.
