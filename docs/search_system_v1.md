# Tài Liệu Kỹ Thuật: Hệ Thống Tìm Kiếm Ngữ Nghĩa (Semantic Search V1)

Tài liệu này mô tả chi tiết kiến trúc, quy trình xử lý dữ liệu và thuật toán được sử dụng để nâng cấp công cụ tìm kiếm trên ứng dụng PhiloMind từ tìm kiếm văn bản thông thường (Keyword Search) lên **Tìm kiếm ngữ nghĩa thông minh sử dụng Vector Embeddings (Semantic Search V1)**.

---

## 1. Tổng Quan Kiến Trúc

Hệ thống hoạt động theo mô hình **In-Memory Vector Cache kết hợp PostgreSQL Database**:
* **Lưu trữ:** Toàn bộ mảng Vector (Embedding) được tính toán sẵn và lưu trữ trực tiếp vào PostgreSQL thông qua cột `embedding Float[]` trong Prisma.
* **Tìm kiếm:** Khi khởi động Server, các vector này được load thẳng lên bộ nhớ RAM của Server (Node.js) để phục vụ việc so khớp toán học với tốc độ tức thời.
* **Sinh Vector:** Sử dụng mô hình **`gemini-embedding-001`** của Google thông qua Gemini API.

```mermaid
graph TD
    subgraph Giai đoạn chuẩn bị (Seed/Backfill)
        A[Nội dung chữ gốc] -->|Gemini API: gemini-embedding-001| B[Mảng số thực Vector 768 chiều]
        B -->|Lưu trữ| C[(PostgreSQL Database)]
    end

    subgraph Giai đoạn Runtime (Khởi động Server)
        C -->|Tải dữ liệu & Vector| D[RAM Cache: SearchCacheItem]
    end

    subgraph Giai đoạn Tìm kiếm (Query)
        E[Từ khóa tìm kiếm của User] -->|Gemini API| F[Vector từ khóa]
        F -->|So sánh Cosine Similarity| G[RAM Cache: SearchCacheItem]
        G -->|Lọc Threshold > 0.3 & Sắp xếp| H[Kết quả gửi về Frontend]
    end
```

---

## 2. Cách Thực Hiện Embedding (Sinh Vector)

Quá trình sinh Vector được thực hiện trong `ai.service.ts`.

### Cấu trúc hóa nội dung trước khi nhúng (Embedding):
Để AI hiểu rõ ngữ cảnh, chúng ta không chỉ gửi tiêu đề bài học mà gộp chung tất cả ngữ cảnh liên quan thành một chuỗi văn bản mô tả đầy đủ:
* **Đối với Bài học (ChapterNode):**
  `"Lesson: [Tiêu đề]. Muc: [Mục]. Chapter: [Tên chương]. Content: [Nội dung tóm tắt các thẻ lý thuyết]"`
* **Đối với Video (Movie):**
  `"Interactive Movie Video: [Tiêu đề]. Muc: [Mục]"`
* **Đối với Trắc nghiệm (Quiz):**
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

Khi người dùng nhập từ khóa tìm kiếm (ví dụ: *"bóc lột"*), quy trình xử lý diễn ra như sau:

### Bước 1: Tạo Vector từ khóa
Hệ thống chuyển đổi từ khóa tìm kiếm thành một Vector từ khóa duy nhất bằng cách gọi lại hàm `getEmbedding(query)`.

### Bước 2: So sánh Cosine Similarity
Để tìm ra các tài liệu có ngữ nghĩa gần với từ khóa nhất, ta tính toán **Cosine Similarity** (Độ tương quan Cosine) giữa Vector Từ Khóa ($A$) và các Vector Tài liệu ($B$) có sẵn trong RAM.

Công thức toán học:
$$\text{Cosine Similarity} = \frac{A \cdot B}{\|A\| \|B\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

Được triển khai trong mã nguồn tại `search.service.ts`:
```typescript
private cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return normA === 0 || normB === 0 ? 0 : dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

### Bước 3: Lọc kết quả và Xếp hạng
* **Ngưỡng lọc (Threshold):** Chỉ giữ lại các tài liệu có điểm tương quan lớn hơn `0.3` để tránh hiển thị nội dung rác.
* **Lọc theo tab (Type Filter):** Lọc theo phân loại mà người dùng chọn (Tất cả / Bài học / Video / Quiz).
* **Sắp xếp (Sort):** Sắp xếp kết quả có điểm số lớn nhất (giống nghĩa nhất) lên trên cùng.

---

## 4. Cơ Chế Dự Phòng (Fallback)

Trong trường hợp có sự cố mạng hoặc lỗi API Gemini khi người dùng đang tìm kiếm, hệ thống sẽ tự động chuyển sang cơ chế **Keyword Match**:
* Sử dụng hàm `String.includes` thường trên trường dữ liệu tìm kiếm đã chuẩn bị sẵn để đảm bảo người dùng vẫn nhận được kết quả phù hợp thô và ứng dụng không bao giờ bị crash.
