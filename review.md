Mình đã xem file project_features_and_flows.md. Nhận xét tổng thể: file này rất tốt để làm bản tổng quan chức năng hệ thống, nhưng nếu dùng trực tiếp cho hướng hiện tại của bạn — PhiloMind học Triết học Mác - Lênin, lấy Chương 1 làm trọng tâm thiết kế — thì cần chỉnh lại khá nhiều để tránh bị lệch sang “app triết học tổng quát”. File hiện tại đang chia hệ thống thành 4 trụ cột lớn: Core Learning, Story Mode Engine, AI & Community Debate, Reflection & Gamification; cách chia này hợp lý và có tính BA tốt.

1. Điểm mạnh của file
   File có cấu trúc rõ, dễ trình bày với mentor hoặc team. Phần Kim tự tháp Minto đặt mục tiêu cốt lõi là giúp người dùng thấu hiểu bản thân và thế giới qua triết học tương tác, sau đó chia ra các nhóm Core Learning, Story Mode, AI/Debate, Reflection/Gamification. Đây là cách trình bày ổn vì cho thấy hệ thống không chỉ là app đọc bài, mà có nhiều lớp trải nghiệm học tập.
   Danh sách 40 màn hình khá đầy đủ, bao phủ nhiều phân hệ: xác thực, Home, Explore, Lesson, Short Lesson, Quiz, Story Mode, AI Character Chat, Scenario, Debate, Reflection, Mindmap, Bookmark, MiniGame và Settings. Nếu mục tiêu là trình bày “toàn bộ khả năng mở rộng của hệ thống”, danh sách này dùng được.
   Luồng nghiệp vụ cũng dễ hiểu. Đặc biệt, file đã có 3 flow chính: Core Learning Flow, Story Mode E2E Flow, và AI Chat & Community Debate Flow. Điều này giúp người đọc hiểu hệ thống vận hành thế nào, không chỉ nhìn danh sách màn hình rời rạc.

---

2. Vấn đề lớn nhất: file vẫn đang hơi lệch so với hướng hiện tại
   Hiện tại bạn đã đổi hướng rất rõ sang:
   PhiloMind — học Triết học Mác - Lênin theo chương, có Story Mode, Learn, Mindmap, Debate, Reflection.
   Nhưng file này vẫn viết theo hướng triết học tổng quát / lịch sử / triết gia AI / moral dilemma nhiều hơn. Ví dụ Story Mode đang lấy ví dụ “Chiếc Tàu của Theseus”, AI Character Gallery có Socrates, Nietzsche, Kant, Confucius, Marx; Scenario có AI Ethics, Privacy, Biotechnology. Những phần này hay, nhưng nếu dùng làm đồ án về Triết học Mác - Lênin, nó sẽ làm mentor thấy hệ thống bị quá rộng và chưa bám học phần.
   Bạn nên chỉnh định vị trong file thành:
   PhiloMind là ứng dụng học Triết học Mác - Lênin thông qua học nhanh, sơ đồ tư duy, nhập vai theo tình huống tư duy, tranh luận có cấu trúc và phản tư cá nhân.
   Không nên viết quá rộng là “triết học, lịch sử, triết gia AI” ngay ở MVP.

---

3. Story Mode 7 bước hiện tại chưa khớp với hướng bạn vừa phát triển
   Trong file, Story Mode đang là 7 bước:
   Intro → Learn → Dilemma → Choose → Consequence → Knowledge → Reflect.
   Flow này ổn về mặt tổng quát, nhưng so với hướng mới của bạn về Episode 1.1: Đêm nhật thực ở Aletheia, nó còn hơi đơn giản và chưa thể hiện rõ các yếu tố mạnh mà mình đã bàn:
   • chọn vai trò nhập vai,
   • khám phá địa điểm,
   • gặp NPC,
   • thu thập manh mối,
   • mini game phân loại,
   • xây lập luận trước hội đồng,
   • mở khóa kiến thức,
   • quiz nhanh,
   • gợi ý replay vai trò khác.
   Vì vậy, mình khuyên đổi Story Mode trong file từ “7 bước tuyến tính” thành:
   Story Mode theo mô hình điều tra tư duy
   Luồng nên là:
1. Story Detail / Episode Entry
1. Cinematic Opening
1. Role Selection
1. Role Intro
1. Exploration Map
1. NPC Encounter
1. Mini Game / Clue Challenge
1. Evidence Board
1. Build Argument
1. Argument Result
1. Knowledge Unlock
1. Quick Quiz
1. Episode Complete
   Như vậy file sẽ khớp với hướng nhập vai thật sự hơn.

---

4. Nhóm Learn hiện tại còn thiếu cấu trúc mới
   Trong file đang có:
   • Full Lesson Screen
   • Short Lesson Swipe Screen
   • Quiz Gameplay Screen
   Nhưng nhóm Learn mà bạn vừa chốt chi tiết hơn gồm:
   • Learn Home
   • Chapter List
   • Chapter Detail
   • Lesson Detail
   • Short-form Learning Feed
   • Flashcard
   • Quiz
   • Quiz Result
   • Study Plan
   • Saved Learning Items
   File nên cập nhật lại để thể hiện Learn không chỉ là “đọc bài + quiz”, mà là nơi:
   học nhanh → hệ thống hóa → ôn thi → xem lỗi sai → lưu nội dung.
   Đặc biệt với Chương 1, nên có các màn mẫu:
   • Chapter Detail — Chương 1
   • Lesson Detail — Vấn đề cơ bản của triết học
   • Flashcard — Duy vật / Duy tâm / Biện chứng / Siêu hình
   • Quiz Result — gợi ý học lại theo lỗi sai
   Nếu giữ file hiện tại, nhóm Learn còn hơi thiếu tính “ôn thi” — trong khi đây là nhu cầu rất quan trọng của sinh viên.

---

5. Mindmap hiện tại quá ít, nên tách thành nhóm riêng
   Trong file chỉ có Mindmap Visualization Screen ở phần mở rộng. Màn này mô tả bản đồ tư duy dạng SVG, zoom/pan và chạm vào node để mở chi tiết.
   Nhưng theo hướng bạn đang làm, Knowledge Graph / Mindmap là một nhóm quan trọng riêng, không nên chỉ là một màn phụ.
   Nên tách thành nhóm:
   Knowledge Graph / Mindmap
   Gồm:
1. Mindmap Home
1. Chapter Mindmap
1. Concept Mindmap
1. Concept Detail
1. Concept Comparison
1. Fullscreen Mindmap Mode
1. Mindmap Quiz Mode nếu có thời gian
   Với Chương 1, cần có mindmap mẫu:
   Chương 1 → Nguồn gốc triết học → Vấn đề cơ bản → Duy vật/Duy tâm → Biện chứng/Siêu hình → Vai trò Triết học Mác - Lênin.
   Đây là phần rất quan trọng để app không chỉ là story/game, mà vẫn có tính học thuật và ôn thi rõ.

---

6. Debate hiện tại hơi đơn giản
   File hiện tại có:
   • Debate List Screen
   • Debate Detail Screen
   • Debate Argue Screen
   Debate Detail đang chia hai phe Ủng hộ / Phản đối. Cách này dễ hiểu, nhưng với Triết học Mác - Lênin thì hơi đơn giản vì nhiều chủ đề không chỉ có 2 phe.
   Ví dụ:
   Vật chất hay ý thức quyết định thế giới?
   Không nên chỉ có Ủng hộ / Phản đối. Nên có các lập trường:
   • Vật chất quyết định ý thức
   • Ý thức quyết định thế giới
   • Cần phân tích thêm
   • Không thể biết chắc
   Vì vậy, nhóm Debate nên đổi thành:
1. Debate Home
1. Debate Topic Detail
1. Join Position Screen
1. Create Argument Screen
1. Debate Thread Screen
1. Counter Argument Screen
1. Debate Result / Insight Screen
   Debate của PhiloMind nên là tranh luận có cấu trúc học thuật, không phải forum bình luận tự do.

---

7. AI Character Chat nên để Phase 2, không nên làm MVP chính
   File đưa AI Character Gallery và AI Chat Conversation thành một phân hệ riêng. Ý tưởng này hay, nhưng nếu bạn đang làm đồ án hoặc thiết kế UI theo hướng chắc chắn, mình khuyên để Phase 2.
   Lý do:
   • AI Chat dễ làm mentor hỏi về độ chính xác học thuật.
   • Cần kiểm soát hallucination.
   • Cần prompt, guardrail, dữ liệu giáo trình.
   • Dễ làm scope phình rất lớn.
   MVP nên ưu tiên:
   • Story Mode Chương 1
   • Learn
   • Mindmap
   • Debate cơ bản
   • Reflection
   • Quiz / Flashcard
   AI Character Chat có thể ghi là tính năng mở rộng sau MVP.

---

8. MiniGame hiện tại chưa khớp với Triết học Mác - Lênin
   File có MiniGame Matching, GuessWho, Logic Syllogism. Những game này vui, nhưng hơi thiên về triết học phương Tây tổng quát như Aristotle, đoán triết gia, câu nói nổi tiếng.
   Với hướng Triết học Mác - Lênin, mini game nên đổi thành:
   • Ghép khái niệm với định nghĩa.
   • Phân loại ví dụ: duy vật / duy tâm.
   • Phân loại cách nhìn: biện chứng / siêu hình.
   • Kéo node vào đúng nhánh mindmap.
   • Xây lập luận bằng thẻ: quan điểm → bằng chứng → giới hạn.
   • Chọn manh mối thuộc nguồn gốc nhận thức hay nguồn gốc xã hội.
   Như vậy MiniGame phục vụ trực tiếp cho học phần, không bị cảm giác “game triết học chung chung”.

---

9. Nên chỉnh lại danh sách 40 màn hình
   Danh sách 40 màn hiện tại khá đầy, nhưng chưa đúng thứ tự ưu tiên hiện tại. Mình đề xuất bạn chia lại như sau:
   MVP nên có
1. Splash
1. Welcome / Onboarding
1. Sign In
1. Sign Up
1. Home
1. Learn Home
1. Chapter List
1. Chapter Detail — Chương 1
1. Lesson Detail
1. Flashcard
1. Quiz
1. Quiz Result
1. Story Library
1. Story Detail
1. Role Selection
1. Cinematic Opening
1. Exploration Map
1. NPC Encounter
1. Mini Game Challenge
1. Evidence Board
1. Build Argument
1. Knowledge Unlock
1. Episode Complete
1. Mindmap Home
1. Chapter Mindmap
1. Concept Mindmap
1. Concept Detail
1. Concept Comparison
1. Debate Home
1. Debate Topic Detail
1. Join Position
1. Create Argument
1. Debate Thread
1. Reflection Journal
1. Reflection Writing
1. Profile
1. Badge Collection
1. Saved Items
1. Notification
1. Settings
   Các màn như AI Character Chat, Modern Scenario, GuessWho, Multi-perspective Viewer có thể chuyển sang Phase 2.

---

10. Chốt nhận xét
    File hiện tại rất tốt làm bản tổng quan cấp cao, nhưng chưa phải bản cuối cho hướng PhiloMind Triết học Mác - Lênin.
    Bạn nên chỉnh theo 5 hướng chính:
1. Đổi định vị từ triết học tổng quát sang Triết học Mác - Lênin theo chương học.
1. Thay Story Mode 7 bước tuyến tính bằng Story Mode điều tra tư duy có vai trò, NPC, manh mối, mini game và build argument.
1. Tách Learn thành nhóm học nhanh/ôn thi rõ hơn.
1. Đưa Mindmap thành phân hệ chính, không chỉ là màn phụ.
1. Để AI Character Chat và một số mini game tổng quát sang Phase 2.
   Nếu chỉnh như vậy, tài liệu sẽ khớp hơn với toàn bộ hướng UI/UX mà bạn đang xây: học nhanh để thi + nhập vai sâu + mindmap hệ thống + debate học thuật.
