// TODO: replace with RTK Query endpoint GET /minigames/:storyId
// when backend T-D11 Mini Game API is available. Shape is contract-compatible.

export interface ClueChallengePuzzle {
  id: string;
  clue: string; // the riddle / concept clue
  options: string[]; // 4 choices, all ≥ 20 chars (acceptance criteria)
  correctIndex: number;
  explanation: string;
  philosopherHint: string; // shown as a tag badge (acceptance criteria)
  philosopherName: string;
}

export interface MinigameData {
  storyTitle: string;
  title: string;
  description: string;
  puzzles: ClueChallengePuzzle[];
}

// ─── Catalog ────────────────────────────────────────────────────────────────

export const minigameCatalog: Record<string, MinigameData> = {
  "Bạn tin vào điều gì?": {
    storyTitle: "Bạn tin vào điều gì?",
    title: "Clue Challenge: Thế Giới Quan",
    description:
      "Thu thập 5 manh mối triết học về thế giới quan. Mỗi câu đố sẽ kiểm tra hiểu biết của bạn về duy vật, duy tâm và nhận thức luận.",
    puzzles: [
      {
        id: "wv-1",
        clue: "Tôi cho rằng ý thức sinh ra từ vật chất, và vật chất là nền tảng của mọi tồn tại. Tôi là học thuyết nào?",
        options: [
          "Duy vật — vật chất quyết định ý thức và tồn tại",
          "Duy tâm — ý thức là nền tảng của thực tại",
          "Nhị nguyên — tâm và vật là hai thực thể riêng biệt",
          "Hoài nghi — không thể biết gì về bản chất thực tại",
        ],
        correctIndex: 0,
        explanation:
          "Chủ nghĩa duy vật (Materialism) cho rằng vật chất là thực thể duy nhất và cơ bản. Ý thức và tư duy là sản phẩm của các quá trình vật lý trong não bộ.",
        philosopherHint: "Marx, Engels, Lenin — Duy Vật Biện Chứng",
        philosopherName: "Karl Marx",
      },
      {
        id: "wv-2",
        clue: "Tôi phân biệt giữa 'hiện tượng' (phenomena) mà ta có thể biết và 'vật tự thân' (Ding an sich) mà ta không bao giờ tiếp cận được. Tôi là ai?",
        options: [
          "Immanuel Kant — triết học phê phán và tiên nghiệm luận",
          "David Hume — chủ nghĩa hoài nghi và kinh nghiệm chủ nghĩa",
          "René Descartes — nhị nguyên luận tâm-vật",
          "John Locke — tâm hồn là tờ giấy trắng khi sinh ra",
        ],
        correctIndex: 0,
        explanation:
          "Kant phân biệt giữa thế giới hiện tượng (phenomena) — thế giới như ta trải nghiệm — và vật tự thân (noumena/Ding an sich) — thực tại như nó thực sự tồn tại mà ta không bao giờ có thể biết trực tiếp.",
        philosopherHint: "Kant — Phê Phán Lý Tính Thuần Túy",
        philosopherName: "Immanuel Kant",
      },
      {
        id: "wv-3",
        clue: "Tôi cho rằng 'esse est percipi' — tồn tại là được tri giác. Nếu không ai nhìn thấy một cái cây trong rừng, nó có tồn tại không?",
        options: [
          "Không — sự tồn tại phụ thuộc vào tri giác chủ quan của tâm trí",
          "Có — vật chất tồn tại độc lập với mọi quan sát viên",
          "Không thể biết — câu hỏi vượt ra ngoài năng lực nhận thức",
          "Có — nhưng chỉ trong không gian-thời gian của vũ trụ vật lý",
        ],
        correctIndex: 0,
        explanation:
          "George Berkeley (1685-1753) là triết gia theo chủ nghĩa duy tâm chủ quan. Câu 'esse est percipi' (tồn tại là được tri giác) là luận điểm cốt lõi của ông: mọi thứ chỉ tồn tại khi có tâm trí nhận thức nó.",
        philosopherHint: "Berkeley — Esse Est Percipi",
        philosopherName: "George Berkeley",
      },
      {
        id: "wv-4",
        clue: "Tôi không tin rằng chúng ta có thể biết gì về thực tại bên ngoài trải nghiệm cảm giác. Mọi tri thức đều từ kinh nghiệm mà ra. Tôi là trường phái nào?",
        options: [
          "Chủ nghĩa kinh nghiệm — tri thức đến từ trải nghiệm giác quan",
          "Chủ nghĩa duy lý — tri thức có thể đạt được qua lý trí thuần túy",
          "Chủ nghĩa thần bí — tri thức cao nhất đến từ giác ngộ tâm linh",
          "Chủ nghĩa hoài nghi triệt để — không có gì có thể được biết",
        ],
        correctIndex: 0,
        explanation:
          "Chủ nghĩa kinh nghiệm (Empiricism) — Locke, Hume, Berkeley — cho rằng mọi tri thức đều bắt nguồn từ trải nghiệm cảm giác (sense experience), không phải từ lý trí thuần túy hay các ý niệm bẩm sinh.",
        philosopherHint: "Locke, Hume — Empiricism Anh",
        philosopherName: "David Hume",
      },
      {
        id: "wv-5",
        clue: "Tôi đặt câu hỏi về mọi thứ cho đến khi tìm thấy điều không thể nghi ngờ: 'Cogito ergo sum' — Tôi suy nghĩ, vậy tôi tồn tại. Tôi là ai?",
        options: [
          "René Descartes — cha đẻ của triết học hiện đại và nhị nguyên luận",
          "Baruch Spinoza — nhất nguyên luận và Deus sive Natura",
          "Gottfried Leibniz — monadology và hòa hợp tiền định",
          "Francis Bacon — phương pháp khoa học quy nạp",
        ],
        correctIndex: 0,
        explanation:
          "Descartes (1596-1650) dùng phương pháp hoài nghi phương pháp (methodological doubt) để tìm nền tảng chắc chắn cho tri thức. Kết luận: dù nghi ngờ tất cả, tôi không thể nghi ngờ rằng tôi đang nghi ngờ — vậy tôi tồn tại.",
        philosopherHint: "Descartes — Cogito Ergo Sum",
        philosopherName: "René Descartes",
      },
    ],
  },

  "Khi lý trí và cảm xúc xung đột": {
    storyTitle: "Khi lý trí và cảm xúc xung đột",
    title: "Clue Challenge: Hiện Sinh và Tự Do",
    description:
      "Thu thập 5 manh mối về triết học hiện sinh. Khám phá ý nghĩa của tự do, trách nhiệm và tính xác thực trong cuộc sống con người.",
    puzzles: [
      {
        id: "ex-1",
        clue: "Tôi nói rằng 'existence precedes essence' — con người không có bản chất định sẵn, mà TỰ TẠO ra mình qua hành động. Tôi là ai?",
        options: [
          "Jean-Paul Sartre — cha đẻ của chủ nghĩa hiện sinh vô thần",
          "Albert Camus — chủ nghĩa phi lý và nổi loạn",
          "Søren Kierkegaard — cha đẻ của chủ nghĩa hiện sinh hữu thần",
          "Martin Heidegger — hiện tượng học và Being-in-the-world",
        ],
        correctIndex: 0,
        explanation:
          "Sartre (1905-1980) phát biểu: sự tồn tại đi trước bản chất. Con người không được sinh ra với mục đích hay bản chất cố định — chúng ta tự định nghĩa mình qua mỗi lựa chọn và hành động.",
        philosopherHint: "Sartre — L'Être et le Néant",
        philosopherName: "Jean-Paul Sartre",
      },
      {
        id: "ex-2",
        clue: "Tôi gọi việc tự lừa dối bản thân bằng cách viện dẫn hoàn cảnh bên ngoài để trốn tránh tự do là gì?",
        options: [
          "Mauvaise foi — xấu tín hay tự lừa dối trong triết học Sartre",
          "Angst — lo âu hiện sinh trước vực thẳm tự do",
          "Absurdity — sự phi lý của việc tìm kiếm ý nghĩa trong vũ trụ vô nghĩa",
          "Thrownness — bị ném vào thế giới không chọn hoàn cảnh ban đầu",
        ],
        correctIndex: 0,
        explanation:
          "Mauvaise foi (bad faith/xấu tín) — Sartre dùng khái niệm này để chỉ hành vi tự lừa dối: giả vờ rằng mình không có sự lựa chọn khi thực ra luôn có. Ví dụ: 'Tôi không thể khác được — đó là tính cách của tôi'.",
        philosopherHint: "Sartre — Bad Faith / Mauvaise Foi",
        philosopherName: "Jean-Paul Sartre",
      },
      {
        id: "ex-3",
        clue: "Tôi viết về 'người anh hùng phi lý' — Sisyphus lăn đá mãi mãi nhưng vẫn hạnh phúc vì chọn nổi loạn thay vì tuyệt vọng. Tôi là ai?",
        options: [
          "Albert Camus — triết học phi lý và nổi loạn hiện sinh",
          "Friedrich Nietzsche — ý chí quyền lực và siêu nhân",
          "Simone de Beauvoir — chủ nghĩa hiện sinh và nữ quyền",
          "Karl Jaspers — triết học tồn tại và giao tiếp thực sự",
        ],
        correctIndex: 0,
        explanation:
          "Camus (1913-1960) trong 'The Myth of Sisyphus' (1942) lập luận rằng cuộc sống phi lý (absurd) không có nghĩa cố hữu, nhưng con người có thể nổi loạn chống lại phi lý bằng cách sáng tạo ý nghĩa cho chính mình.",
        philosopherHint: "Camus — Le Mythe de Sisyphe",
        philosopherName: "Albert Camus",
      },
      {
        id: "ex-4",
        clue: "Tôi phân biệt giữa 'sự lo âu' (anxiety) — khi đối diện với sự tự do vô hạn — và 'sợ hãi' (fear) hướng đến đối tượng cụ thể. Tôi là ai?",
        options: [
          "Søren Kierkegaard — cha đẻ của hiện sinh và lo âu hiện sinh",
          "Sigmund Freud — phân tâm học và lo âu tâm lý",
          "Martin Heidegger — phân tích lo âu trong Being and Time",
          "William James — tâm lý học thực dụng về cảm xúc",
        ],
        correctIndex: 0,
        explanation:
          "Kierkegaard (1813-1855) trong 'The Concept of Anxiety' phân biệt anxiety (lo âu hiện sinh) — cảm giác chóng mặt trước vực thẳm tự do — với fear (sợ) hướng đến đối tượng cụ thể. Anxiety là trạng thái của con người tự do.",
        philosopherHint: "Kierkegaard — The Concept of Anxiety",
        philosopherName: "Søren Kierkegaard",
      },
      {
        id: "ex-5",
        clue: "Tôi nói rằng 'authenticity' — sống thật với bản thân — đòi hỏi chấp nhận 'thrownness': ta không chọn được hoàn cảnh sinh ra. Tôi là ai?",
        options: [
          "Martin Heidegger — Being and Time và tính xác thực",
          "Jean-Paul Sartre — tính xác thực và tự do tuyệt đối",
          "Simone de Beauvoir — Ethics of Ambiguity và tự do",
          "Maurice Merleau-Ponty — hiện tượng học thân xác",
        ],
        correctIndex: 0,
        explanation:
          "Heidegger (1889-1976) trong 'Being and Time' mô tả 'thrownness' (Geworfenheit) — ta bị ném vào thế giới với hoàn cảnh không chọn. Authenticity (tính xác thực) là sống có ý thức về thrownness, không trốn tránh nó.",
        philosopherHint: "Heidegger — Sein und Zeit",
        philosopherName: "Martin Heidegger",
      },
    ],
  },

  "Ngày mà mọi thứ sụp đổ": {
    storyTitle: "Ngày mà mọi thứ sụp đổ",
    title: "Clue Challenge: Triết Học Khắc Kỷ",
    description:
      "Thu thập 5 manh mối về triết học Khắc kỷ (Stoicism). Học cách duy trì bình thản nội tâm và ứng xử với nghịch cảnh.",
    puzzles: [
      {
        id: "st-1",
        clue: "Tôi phân biệt những thứ 'trong tầm tay' (eph' hēmin) — ý kiến, hành động, ham muốn — và những thứ 'ngoài tầm tay'. Tôi là ai?",
        options: [
          "Epictetus — nô lệ trở thành triết gia và Enchiridion",
          "Marcus Aurelius — hoàng đế Khắc kỷ viết Meditations",
          "Seneca — nhà văn và triết gia Khắc kỷ La Mã",
          "Zeno of Citium — người sáng lập trường phái Khắc kỷ",
        ],
        correctIndex: 0,
        explanation:
          "Epictetus (50-135 CE) — từ nô lệ trở thành triết gia. Dichotomy of Control (nhị phân kiểm soát) là trái tim của Khắc kỷ: chỉ kiểm soát những gì trong tầm tay (phán đoán, hành động, ham muốn), buông bỏ những thứ còn lại.",
        philosopherHint: "Epictetus — Enchiridion",
        philosopherName: "Epictetus",
      },
      {
        id: "st-2",
        clue: "Là hoàng đế La Mã nhưng mỗi ngày tôi viết nhật ký nhắc nhở bản thân về sự khiêm tốn, memento mori, và bổn phận. Tôi là ai?",
        options: [
          "Marcus Aurelius — hoàng đế-triết gia với Meditations",
          "Julius Caesar — nhà lãnh đạo quân sự và chính trị gia",
          "Cicero — nhà hùng biện và triết gia Khắc kỷ La Mã",
          "Hadrian — hoàng đế yêu nghệ thuật và triết học",
        ],
        correctIndex: 0,
        explanation:
          "Marcus Aurelius (121-180 CE) — hoàng đế quyền lực nhất La Mã nhưng viết nhật ký Meditations để tự nhắc mình: sức mạnh thực sự là nội tâm; danh vọng, quyền lực đều vô thường. 'Memento mori' — nhớ rằng mình sẽ chết.",
        philosopherHint: "Marcus Aurelius — Meditations",
        philosopherName: "Marcus Aurelius",
      },
      {
        id: "st-3",
        clue: "Tôi gọi kỹ thuật hình dung trước điều tệ nhất có thể xảy ra — để không bị bất ngờ và sống trọn vẹn hơn — là gì?",
        options: [
          "Premeditatio Malorum — hình dung trước nghịch cảnh trong Khắc kỷ",
          "Amor Fati — yêu số phận bất kể điều gì xảy ra",
          "Via Negativa — học bằng cách loại bỏ cái không đúng",
          "Memento Mori — nhớ về cái chết để sống có ý nghĩa",
        ],
        correctIndex: 0,
        explanation:
          "Premeditatio Malorum (hình dung trước điều xấu) — kỹ thuật Khắc kỷ: mỗi ngày hãy hình dung mất mát, thất bại, bệnh tật. Không phải để lo lắng mà để (1) không bị sốc khi xảy ra, (2) biết ơn những gì đang có.",
        philosopherHint: "Seneca, Epictetus — Premeditatio Malorum",
        philosopherName: "Seneca",
      },
      {
        id: "st-4",
        clue: "Khắc kỷ dạy rằng cảm xúc tiêu cực không đến từ hoàn cảnh bên ngoài mà đến từ đâu?",
        options: [
          "Phán đoán và diễn giải của chúng ta về hoàn cảnh bên ngoài",
          "Di truyền học và cấu trúc não bộ sinh học cố định",
          "Tác động tích lũy của trải nghiệm thời thơ ấu",
          "Sự vô thường của vũ trụ và tính phi lý của tồn tại",
        ],
        correctIndex: 0,
        explanation:
          "Theo Khắc kỷ, không phải sự kiện mà là phán đoán của ta về sự kiện gây ra cảm xúc. Epictetus: 'Men are disturbed not by things, but by the opinions about things.' Thay đổi phán đoán → thay đổi cảm xúc.",
        philosopherHint: "Epictetus — Phán Đoán và Cảm Xúc",
        philosopherName: "Epictetus",
      },
      {
        id: "st-5",
        clue: "Khái niệm Khắc kỷ nào dạy ta yêu mến số phận — ngay cả đau khổ và thất bại — như một phần không thể tách rời của cuộc sống?",
        options: [
          "Amor Fati — yêu số phận, khái niệm cũng của Nietzsche",
          "Eudaimonia — hạnh phúc và phồn thịnh theo Aristotle",
          "Ataraxia — bình thản và vắng mặt lo âu theo Epicurus",
          "Apatheia — không bị cuốn bởi các đam mê phá hoại",
        ],
        correctIndex: 0,
        explanation:
          "Amor Fati (Love of Fate — yêu số phận) — không chỉ chấp nhận mà còn yêu thích mọi điều xảy ra. Nietzsche cũng dùng khái niệm này: 'My formula for greatness in a human being is amor fati.'",
        philosopherHint: "Khắc Kỷ — Amor Fati",
        philosopherName: "Marcus Aurelius",
      },
    ],
  },

  "Máy tính có biết suy nghĩ không?": {
    storyTitle: "Máy tính có biết suy nghĩ không?",
    title: "Clue Challenge: Triết Học Tâm Trí và AI",
    description:
      "Thu thập 5 manh mối về ý thức, trí tuệ nhân tạo và triết học tâm trí. Khám phá ranh giới giữa tư duy máy móc và nhận thức con người.",
    puzzles: [
      {
        id: "ai-1",
        clue: "Tôi đề xuất một bài kiểm tra: nếu máy tính trả lời câu hỏi mà con người không phân biệt được đó là người hay máy, thì nó 'thông minh'. Đây là bài kiểm tra gì?",
        options: [
          "Turing Test — do Alan Turing đề xuất năm 1950",
          "Chinese Room Test — do John Searle đề xuất",
          "Imitation Game — biến thể của trò chơi bắt chước",
          "Loebner Prize — cuộc thi chatbot thường niên",
        ],
        correctIndex: 0,
        explanation:
          "Alan Turing (1912-1954) trong bài báo 'Computing Machinery and Intelligence' (1950) đề xuất Imitation Game, nay gọi là Turing Test: nếu một máy có thể trò chuyện mà người không phân biệt được đó là người hay máy, ta gọi nó 'thông minh'.",
        philosopherHint: "Alan Turing — Computing Machinery and Intelligence",
        philosopherName: "Alan Turing",
      },
      {
        id: "ai-2",
        clue: "Tôi ngồi trong phòng nhận ký hiệu Trung văn, tra cứu bảng quy tắc và xuất ra ký hiệu đúng — nhưng tôi không hiểu tiếng Trung. Đây là thí nghiệm tư duy nào?",
        options: [
          "Chinese Room — John Searle lập luận AI không thực sự hiểu",
          "Mary's Room — Frank Jackson về qualia và kiến thức vật lý",
          "Philosophical Zombie — thực thể hành vi giống người nhưng không có ý thức",
          "Brain in a Vat — thí nghiệm tư duy hoài nghi kiến thức",
        ],
        correctIndex: 0,
        explanation:
          "John Searle (1932-) trong 'Minds, Brains, and Programs' (1980) đề xuất Chinese Room: syntax (xử lý ký hiệu) không tương đương semantics (hiểu ý nghĩa). Máy tính dù xử lý thông tin hoàn hảo vẫn không 'hiểu' như con người.",
        philosopherHint: "Searle — Chinese Room Argument",
        philosopherName: "John Searle",
      },
      {
        id: "ai-3",
        clue: "Tôi là khái niệm chỉ trải nghiệm chủ quan — 'cảm giác như thế nào khi nhìn thấy màu đỏ' — điều mà vật lý học không thể giải thích đầy đủ. Tôi là gì?",
        options: [
          "Qualia — trải nghiệm chủ quan và vấn đề khó của ý thức",
          "Consciousness — ý thức theo nghĩa chung và rộng",
          "Phenomenology — nghiên cứu cấu trúc trải nghiệm ý thức",
          "Sentience — khả năng cảm nhận và có cảm xúc",
        ],
        correctIndex: 0,
        explanation:
          "Qualia (số ít: quale) — chất lượng chủ quan của trải nghiệm. 'Hard Problem of Consciousness' (Chalmers): tại sao quá trình vật lý trong não lại tạo ra trải nghiệm chủ quan? Đây là vấn đề trung tâm của triết học tâm trí và AI.",
        philosopherHint: "Chalmers — Hard Problem of Consciousness",
        philosopherName: "David Chalmers",
      },
      {
        id: "ai-4",
        clue: "Chức năng luận (Functionalism) cho rằng tâm trí là gì nếu được mô tả đơn giản nhất?",
        options: [
          "Tâm trí là các trạng thái chức năng định nghĩa bởi mối quan hệ nhân quả",
          "Tâm trí là hoạt động điện hóa trong các nơ-ron não bộ",
          "Tâm trí là linh hồn phi vật chất tương tác với thể xác",
          "Tâm trí là sản phẩm của tiến hóa và chọn lọc tự nhiên",
        ],
        correctIndex: 0,
        explanation:
          "Functionalism — Putnam, Fodor — cho rằng trạng thái tâm trí được định nghĩa bởi chức năng (input, internal states, output), không phải chất liệu vật lý. Implication: nếu AI có cùng chức năng, nó có cùng trạng thái tâm trí.",
        philosopherHint: "Putnam, Fodor — Functionalism",
        philosopherName: "Hilary Putnam",
      },
      {
        id: "ai-5",
        clue: "Triết học đạo đức AI đặt câu hỏi: nếu AI có khả năng đau khổ, chúng ta có nghĩa vụ đạo đức gì với nó? Nguyên tắc nào được áp dụng?",
        options: [
          "Sentience-based ethics — khả năng đau khổ là tiêu chí đạo đức cơ bản",
          "Species-based ethics — chỉ con người mới có quyền đạo đức",
          "Capability approach — quyền dựa trên năng lực phát triển",
          "Contractarian ethics — quyền phát sinh từ thỏa thuận xã hội",
        ],
        correctIndex: 0,
        explanation:
          "Peter Singer và nhiều nhà đạo đức học lập luận: khả năng đau khổ (sentience) — không phải trí tuệ hay thành viên loài — là tiêu chí cơ bản để được xem xét đạo đức. Nếu AI có sentience, nó có quyền được bảo vệ.",
        philosopherHint: "Singer — Animal Liberation & AI Ethics",
        philosopherName: "Peter Singer",
      },
    ],
  },

  "Hạnh phúc thực sự là gì?": {
    storyTitle: "Hạnh phúc thực sự là gì?",
    title: "Clue Challenge: Triết Học Hạnh Phúc",
    description:
      "Thu thập 5 manh mối về các lý thuyết hạnh phúc từ Epicurus đến tâm lý học tích cực hiện đại.",
    puzzles: [
      {
        id: "hp-1",
        clue: "Tôi phân biệt hai loại khoái lạc: kinetic (động) — khoái cảm trong khi hoạt động — và katastematic (tĩnh) — trạng thái bình thản khi tất cả nhu cầu được thỏa mãn. Tôi là ai?",
        options: [
          "Epicurus — triết gia vườn Athens và ataraxia",
          "Aristotle — eudaimonia và phồn thịnh đạo đức",
          "Jeremy Bentham — hedonism và tính toán khoái lạc",
          "John Stuart Mill — phân cấp khoái lạc theo chất lượng",
        ],
        correctIndex: 0,
        explanation:
          "Epicurus (341-270 BCE) phân biệt khoái lạc kinetic (active pleasure) và katastematic (stable pleasure = ataraxia — bình thản). Mục tiêu không phải khoái lạc cực đại mà là trạng thái bình thản không lo âu.",
        philosopherHint: "Epicurus — Ataraxia và Aponia",
        philosopherName: "Epicurus",
      },
      {
        id: "hp-2",
        clue: "Tôi cho rằng hạnh phúc đích thực (eudaimonia) không phải là cảm giác tốt mà là sống tốt và làm tốt — phát huy đầy đủ tiềm năng con người. Tôi là ai?",
        options: [
          "Aristotle — Nicomachean Ethics và eudaimonia như phồn thịnh",
          "Plato — hạnh phúc trong sự chiêm ngưỡng Mẫu Hình Tốt",
          "Socrates — hạnh phúc là kết quả của đức hạnh và tri thức",
          "Epicurus — hạnh phúc là vắng mặt đau đớn và lo âu",
        ],
        correctIndex: 0,
        explanation:
          "Aristotle (384-322 BCE) trong Nicomachean Ethics: eudaimonia là telos (mục đích cuối) của con người — không phải cảm giác mà là hoạt động của linh hồn theo đức hạnh (arete). Sống tốt và làm tốt = phát huy đầy đủ bản chất người.",
        philosopherHint: "Aristotle — Nicomachean Ethics",
        philosopherName: "Aristotle",
      },
      {
        id: "hp-3",
        clue: "Nghiên cứu tâm lý học cho thấy sau khi đạt được điều ta mong muốn, mức độ hạnh phúc nhanh chóng trở về đường cơ sở. Hiện tượng này gọi là gì?",
        options: [
          "Hedonic adaptation — thích nghi khoái lạc hay vòng quay sóc chạy",
          "Cognitive dissonance — bất hòa nhận thức sau quyết định",
          "Peak-end rule — ta nhớ đỉnh điểm và kết thúc, không phải trung bình",
          "Loss aversion — sợ mất mát hơn là vui được lợi",
        ],
        correctIndex: 0,
        explanation:
          "Hedonic Adaptation (Brickman & Campbell, 1971) — 'Hedonic Treadmill': con người nhanh chóng thích nghi với thay đổi hoàn cảnh (tốt hay xấu) và trở về mức hạnh phúc cơ sở. Trúng xổ số hay bị liệt đều không thay đổi hạnh phúc lâu dài nhiều như ta nghĩ.",
        philosopherHint: "Brickman & Campbell — Hedonic Treadmill",
        philosopherName: "Daniel Kahneman",
      },
      {
        id: "hp-4",
        clue: "Tôi phân biệt 'experiencing self' — cái tôi trải nghiệm khoảnh khắc hiện tại — và 'remembering self' — cái tôi xây dựng câu chuyện về quá khứ. Hai cái này thường không đồng ý với nhau. Tôi là ai?",
        options: [
          "Daniel Kahneman — Thinking Fast and Slow và hai hệ thống tâm trí",
          "Martin Seligman — PERMA và tâm lý học tích cực",
          "Mihaly Csikszentmihalyi — Flow và trạng thái dòng chảy",
          "Ed Diener — subjective well-being và thang đo hạnh phúc",
        ],
        correctIndex: 0,
        explanation:
          "Daniel Kahneman (Nobel 2002) phân biệt experiencing self (trải nghiệm thực tế) và remembering self (ký ức và đánh giá). Ta thường tối ưu cho remembering self — nhưng chính experiencing self mới là người sống cuộc đời.",
        philosopherHint: "Kahneman — Experiencing vs Remembering Self",
        philosopherName: "Daniel Kahneman",
      },
      {
        id: "hp-5",
        clue: "Mô hình PERMA của tôi cho rằng well-being bao gồm 5 yếu tố: Positive emotions, Engagement, Relationships, Meaning, Accomplishment. Tôi là ai?",
        options: [
          "Martin Seligman — cha đẻ của tâm lý học tích cực",
          "Abraham Maslow — tháp nhu cầu và self-actualization",
          "Carl Rogers — tâm lý học nhân văn và self-concept",
          "Erich Fromm — nghệ thuật yêu thương và tự do",
        ],
        correctIndex: 0,
        explanation:
          "Martin Seligman đề xuất PERMA: Positive Emotions (cảm xúc tích cực), Engagement (dấn thân/flow), Relationships (quan hệ), Meaning (ý nghĩa), Accomplishment (thành tựu). Well-being toàn diện đòi hỏi cả 5 yếu tố.",
        philosopherHint: "Seligman — PERMA Model",
        philosopherName: "Martin Seligman",
      },
    ],
  },
};

// ─── Fallback ────────────────────────────────────────────────────────────────

export const defaultMinigameData = (storyTitle: string): MinigameData => ({
  storyTitle,
  title: "Clue Challenge: Triết Học Cơ Bản",
  description: "Thu thập các manh mối triết học để hiểu sâu hơn về bối cảnh câu chuyện này.",
  puzzles: [
    {
      id: "def-1",
      clue: "Đây là môn học nghiên cứu bản chất của tri thức, nguồn gốc và giới hạn của nó. Nó hỏi: chúng ta có thể biết gì và làm sao chúng ta biết?",
      options: [
        "Nhận thức luận — epistemology, nghiên cứu bản chất tri thức",
        "Siêu hình học — metaphysics, nghiên cứu bản chất thực tại",
        "Đạo đức học — ethics, nghiên cứu đúng và sai về mặt đạo đức",
        "Logic học — nghiên cứu lý luận và suy diễn hợp lệ",
      ],
      correctIndex: 0,
      explanation:
        "Nhận thức luận (Epistemology) nghiên cứu: tri thức là gì, ta có thể biết gì, các nguồn tri thức (lý trí, kinh nghiệm, trực giác), và giới hạn của hiểu biết con người.",
      philosopherHint: "Plato, Descartes, Hume — Epistemology",
      philosopherName: "Plato",
    },
    {
      id: "def-2",
      clue: "Tôi là nguyên tắc đạo đức đòi hỏi hành động đúng là hành động tạo ra kết quả tốt nhất cho số đông nhất. Tôi là học thuyết nào?",
      options: [
        "Utilitarianism — công lợi luận của Bentham và J.S. Mill",
        "Deontological ethics — đạo đức nghĩa vụ của Kant",
        "Virtue ethics — đạo đức đức hạnh của Aristotle",
        "Care ethics — đạo đức quan tâm của Carol Gilligan",
      ],
      correctIndex: 0,
      explanation:
        "Utilitarianism (công lợi luận) — Bentham và J.S. Mill: hành động đúng là hành động tối đa hóa hạnh phúc tổng thể cho số người lớn nhất. 'Greatest happiness for the greatest number.'",
      philosopherHint: "Bentham, Mill — Utilitarianism",
      philosopherName: "Jeremy Bentham",
    },
    {
      id: "def-3",
      clue: "Tôi là học thuyết đạo đức cho rằng có những hành động đúng hoặc sai bất kể hậu quả — dựa trên nguyên tắc và nghĩa vụ tuyệt đối. Tôi là gì?",
      options: [
        "Deontological ethics — nghĩa vụ luận của Immanuel Kant",
        "Consequentialism — đạo đức dựa trên kết quả và hậu quả",
        "Moral relativism — đạo đức phụ thuộc vào văn hóa và bối cảnh",
        "Natural law theory — đạo đức dựa trên bản chất tự nhiên",
      ],
      correctIndex: 0,
      explanation:
        "Deontological ethics (nghĩa vụ luận) — Kant: một số hành động vốn đúng hoặc sai, bất kể hậu quả. Categorical Imperative: hãy hành động theo maxim mà bạn có thể muốn trở thành luật phổ quát.",
      philosopherHint: "Kant — Categorical Imperative",
      philosopherName: "Immanuel Kant",
    },
    {
      id: "def-4",
      clue: "Tôi là câu hỏi nền tảng của siêu hình học: tại sao có gì đó thay vì không có gì cả? Martin Heidegger gọi đây là câu hỏi gì?",
      options: [
        "Câu hỏi cơ bản của siêu hình học về nền tảng tồn tại",
        "Vấn đề của ác — tại sao Chúa để điều xấu tồn tại",
        "Vấn đề tâm-vật — mối quan hệ giữa ý thức và não bộ",
        "Vấn đề tự do ý chí — liệu con người có thực sự tự do",
      ],
      correctIndex: 0,
      explanation:
        "Heidegger gọi đây là 'die Grundfrage der Metaphysik' — câu hỏi cơ bản của siêu hình học: 'Warum ist überhaupt Seiendes und nicht vielmehr Nichts?' (Tại sao có gì đó thay vì không có gì cả?). Leibniz cũng đặt câu hỏi tương tự.",
      philosopherHint: "Heidegger, Leibniz — Câu Hỏi Siêu Hình Học",
      philosopherName: "Martin Heidegger",
    },
    {
      id: "def-5",
      clue: "Triết học Phương Đông, đặc biệt Phật giáo, cho rằng gốc rễ của khổ đau là gì và con đường thoát khổ như thế nào?",
      options: [
        "Tham ái và chấp thủ — diệt khổ bằng Bát Chánh Đạo và vô ngã",
        "Nghiệp chướng từ kiếp trước — giải thoát qua tu hành khổ hạnh",
        "Sự cô đơn hiện sinh — giải thoát qua ý thức tập thể và hòa nhập",
        "Vô minh tuyệt đối — giải thoát chỉ qua ân điển thần thánh",
      ],
      correctIndex: 0,
      explanation:
        "Tứ Diệu Đế (Four Noble Truths) của Phật giáo: (1) Đời là khổ (dukkha), (2) Nguồn gốc khổ là tham ái (tanha), (3) Có thể diệt khổ (nirodha), (4) Con đường diệt khổ là Bát Chánh Đạo. Vô ngã (anatta) là chìa khóa.",
      philosopherHint: "Đức Phật — Tứ Diệu Đế và Bát Chánh Đạo",
      philosopherName: "Siddhartha Gautama",
    },
  ],
});
