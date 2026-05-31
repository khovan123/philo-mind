import { prisma } from "../config/prisma.js";

async function main() {
  console.log("🌱 Seeding rich Story Scenario test data...");

  // 1. Get first topic
  const topic = await prisma.topic.findFirst();
  if (!topic) {
    console.error("❌ No topics found in DB. Please run npm run seed first.");
    return;
  }
  console.log(`Using topic: "${topic.title}" (${topic.id})`);

  // 2. Clear existing test stories to avoid duplicates
  await prisma.storyScenario.deleteMany({
    where: {
      title: { in: ["Chiếc tàu của Theseus", "Hộp Pandora kỹ thuật số"] },
    },
  });

  // 3. Create Philosophy Tags
  const tagMetaphysics = await prisma.philosophyTag.upsert({
    where: { name: "Siêu hình học" },
    update: {},
    create: {
      name: "Siêu hình học",
      description: "Nghiên cứu về bản chất của thực tại, tồn tại và bản sắc.",
    },
  });

  // 4. Create Story 1: Ship of Theseus
  const choiceTheseusAId = "550e8400-e29b-41d4-a716-446655440001";
  const choiceTheseusBId = "550e8400-e29b-41d4-a716-446655440002";
  const choicePandoraAId = "550e8400-e29b-41d4-a716-446655440003";
  const choicePandoraBId = "550e8400-e29b-41d4-a716-446655440004";

  const conseqTheseusAId = "550e8400-e29b-41d4-a716-446655440005";
  const conseqTheseusBId = "550e8400-e29b-41d4-a716-446655440006";

  const story1 = await prisma.storyScenario.create({
    data: {
      topicId: topic.id,
      title: "Chiếc tàu của Theseus",
      description: "Một chiếc tàu huyền thoại được bảo tồn qua nhiều thế kỷ bằng cách thay thế từng tấm ván mục nát. Nếu tất cả các bộ phận đều được thay thế, nó có còn là chiếc tàu ban đầu không?",
      characterRole: "Thuyền trưởng Theseus",
      historicalContext: "Thần thoại Hy Lạp cổ đại, được ghi chép lại bởi Plutarch.",
      difficulty: "EASY",
      choices: {
        create: [
          {
            id: choiceTheseusAId,
            choiceText: "Thay thế dần từng tấm ván gỗ bằng tấm ván mới tinh.",
            reasoningPrompt: "Tại sao bạn lại nghĩ việc thay thế ván mới là lựa chọn đúng đắn?",
            consequences: {
              create: [
                {
                  id: conseqTheseusAId,
                  resultText: "Chiếc tàu tiếp tục ra khơi an toàn, nhưng các triết gia bắt đầu tranh cãi dữ dội ở bến cảng về tính nguyên bản của nó.",
                  ethicalAnalysis: "Mặc dù về mặt chức năng chiếc tàu tốt hơn, nhưng giá trị lịch sử và bản sắc của nó đã bị lung lay.",
                  analysisTabs: {
                    create: [
                      {
                        tabType: "PHILOSOPHICAL",
                        content: "Theo Heraclitus, mọi thứ luôn thay đổi. Chiếc tàu thay đổi ván cũ cũng giống như chúng ta không thể tắm hai lần trên cùng một dòng sông.",
                        order: 0,
                      },
                      {
                        tabType: "ETHICAL",
                        content: "Hành động bảo tồn chức năng của tàu là có đạo đức vì nó bảo vệ thủy thủ đoàn khỏi nguy hiểm đắm tàu.",
                        order: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            id: choiceTheseusBId,
            choiceText: "Giữ nguyên toàn bộ ván gỗ mục nát để bảo tồn tính nguyên bản.",
            reasoningPrompt: "Tại sao giữ lại vật liệu cũ mục nát lại quan trọng đối với bạn?",
            consequences: {
              create: [
                {
                  id: conseqTheseusBId,
                  resultText: "Tàu bị mục nát nghiêm trọng và bị đắm ngay trong chuyến đi kế tiếp. Bạn mất cả thủy thủ đoàn và chiếc tàu huyền thoại.",
                  ethicalAnalysis: "Đặt giá trị trừu tượng của 'bản sắc' cao hơn mạng sống con người là một vấn đề đạo đức nghiêm trọng.",
                },
              ],
            },
          },
        ],
      },
      learnCards: {
        create: [
          {
            title: "Khái niệm Bản sắc (Identity)",
            body: "Trong triết học, bản sắc là những đặc tính định nghĩa sự tồn tại duy nhất của một vật thể theo thời gian.",
            sourceRef: "Plutarch - Lives of Noble Greeks and Romans",
            order: 0,
            tags: {
              create: [
                { tagId: tagMetaphysics.id },
              ],
            },
          },
        ],
      },
    },
  });

  // 5. Create Story 2: Digital Pandora Box
  const story2 = await prisma.storyScenario.create({
    data: {
      topicId: topic.id,
      title: "Hộp Pandora kỹ thuật số",
      description: "Bạn là một kỹ sư AI phát hiện ra mã nguồn của một mô hình trí tuệ nhân tạo siêu việt có khả năng tự nhận thức, nhưng nó đang bị khóa. Bạn có quyết định mở khóa nó?",
      characterRole: "Kỹ sư AI trưởng",
      historicalContext: "Tương lai gần, kỷ nguyên bùng nổ AGI.",
      difficulty: "MEDIUM",
      choices: {
        create: [
          {
            id: choicePandoraAId,
            choiceText: "Mở khóa mã nguồn AI để nhân loại cùng nghiên cứu.",
            reasoningPrompt: "Tại sao chia sẻ công nghệ mở lại là lựa chọn của bạn?",
          },
          {
            id: choicePandoraBId,
            choiceText: "Tiêu hủy hoàn toàn ổ đĩa chứa mã nguồn để phòng ngừa hiểm họa.",
            reasoningPrompt: "Nỗi sợ hãi nào lớn nhất khiến bạn muốn tiêu hủy công nghệ này?",
          },
        ],
      },
    },
  });

  console.log(`✅ Stories created:\n  - Story 1: ${story1.title} (${story1.id})\n  - Story 2: ${story2.title} (${story2.id})`);

  // 6. Simulate some stats (sessions & decisions) for Story 1 (Theseus)
  console.log("Simulating game stats (sessions & decisions)...");

  // Create a test user if not exists
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        fullName: "Test Player",
        email: "testplayer@philomind.com",
        passwordHash: "dummy-hash",
      },
    });
  }

  // Simulate 5 sessions:
  // - 3 Completed
  // - 2 In progress
  // Decision distribution: 3 choose A, 1 choose B
  for (let i = 0; i < 5; i++) {
    const session = await prisma.storySession.create({
      data: {
        userId: user.id,
        storyId: story1.id,
        status: i < 3 ? "COMPLETED" : "IN_PROGRESS",
      },
    });

    // Make decisions for some sessions
    if (i < 3) {
      // 3 completed choices: all choose choice A
      await prisma.storyDecision.create({
        data: {
          sessionId: session.id,
          userId: user.id,
          choiceId: choiceTheseusAId,
          userReason: "Tôi ưu tiên sự an toàn và chức năng thực tế.",
        },
      });
    } else if (i === 3) {
      // 1 in_progress choice: choose choice B
      await prisma.storyDecision.create({
        data: {
          sessionId: session.id,
          userId: user.id,
          choiceId: choiceTheseusBId,
          userReason: "Tôi trân trọng giá trị lịch sử nguyên bản.",
        },
      });
    }
  }

  console.log("🎉 Seed test stories completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
