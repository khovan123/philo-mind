import { VNScriptNode } from "./MovieTypes";
import type { ChapterNode } from "@/services/rtk-api/chapter.api";

export function buildHookMovieScript(node: ChapterNode): VNScriptNode[] {
  if (node.hook.type !== "choice") {
    return [
      { t: "scene", bg: "hoithao", act: 1, name: "Tình huống" },
      { t: "say", who: "lam", mood: "neutral", text: "Bài học này là một bài học đặc biệt không hỗ trợ tương tác." },
      { t: "end" }
    ];
  }

  const script: VNScriptNode[] = [];

  // Setup Scene
  script.push({ t: "scene", bg: "hoithao", act: 1, name: "Tình huống Khởi động" });

  // Present Situation
  if (node.hook.situation) {
    script.push({
      t: "say",
      who: "lam",
      mood: "neutral",
      text: node.hook.situation
    });
  }

  // Ask Question & Choices
  script.push({
    t: "choice",
    who: "lam",
    mood: "concern",
    q: node.hook.question || "Bạn chọn phương án nào?",
    opts: [
      {
        text: "Lựa chọn A",
        reply: {
          t: "say",
          who: "lam",
          mood: "happy",
          text: node.hook.feedbackA || "Đó là một góc nhìn thú vị."
        }
      },
      {
        text: "Lựa chọn B",
        reply: {
          t: "say",
          who: "lam",
          mood: "happy",
          text: node.hook.feedbackB || "Đó cũng là một góc nhìn đáng xem xét."
        }
      }
    ]
  });

  // End
  script.push({ t: "end" });

  return script;
}
