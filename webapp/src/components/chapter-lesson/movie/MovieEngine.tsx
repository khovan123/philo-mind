import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, Text } from "react-native";
import { VNScriptNode, VNSayNode, VNSceneNode, VNChoiceNode } from "./MovieTypes";
import { MovieStage } from "./MovieStage";
import { MovieDialogue, MovieDialogueRef } from "./MovieDialogue";
import { MovieChoices } from "./MovieChoices";
import { MovieHUD } from "./MovieHUD";

interface MovieEngineProps {
  script: VNScriptNode[];
  onEnd: (stats: { thienCam: number; uyTin: number; correctN: number }) => void;
  onChoiceSelected?: (optionIndex: number) => void;
}

export function MovieEngine({ script, onEnd, onChoiceSelected }: MovieEngineProps) {
  const dialogueRef = useRef<MovieDialogueRef>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [injectedReply, setInjectedReply] = useState<VNSayNode | null>(null);

  // State for HUD
  const [thienCam, setThienCam] = useState(50);
  const [uyTin, setUyTin] = useState(50);
  const [correctN, setCorrectN] = useState(0);
  const [currentBg, setCurrentBg] = useState<VNSceneNode["bg"]>("hoithao");
  const [currentActName, setCurrentActName] = useState("");

  const totalQ = React.useMemo(() => {
    let count = 0;
    script.forEach((node) => {
      if (node.t === "choice" && node.opts.some((o) => o.correct)) {
        count++;
      }
    });
    return count;
  }, [script]);

  const currentNode = script[currentIndex];

  // If we have an injected reply, we show it instead of the current node
  const activeNode = injectedReply || currentNode;

  const handleNext = () => {
    if (injectedReply) {
      setInjectedReply(null);
      advanceScript();
      return;
    }

    // For 'end' node, we do nothing on tap, wait for the user to press continue or replay
    if (activeNode.t === "end") {
      return;
    }

    advanceScript();
  };

  useEffect(() => {
    if (!injectedReply && activeNode && (activeNode.t === "scene" || activeNode.t === "act")) {
      if (activeNode.t === "scene") {
        setCurrentBg(activeNode.bg);
        setCurrentActName(activeNode.name);
      }

      const timeout = setTimeout(() => {
        const nextIdx = currentIndex + 1;
        if (nextIdx >= script.length) {
          onEnd({ thienCam, uyTin, correctN });
        } else {
          setCurrentIndex(nextIdx);
        }
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [activeNode, currentIndex, injectedReply, onEnd, script]);

  const advanceScript = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= script.length) {
      onEnd({ thienCam, uyTin, correctN });
    } else {
      setCurrentIndex(nextIdx);
    }
  };

  const handleChoice = (optIndex: number) => {
    if (activeNode.t !== "choice") return;

    const choiceNode = activeNode as VNChoiceNode;
    const opt = choiceNode.opts[optIndex];

    const isQ = choiceNode.opts.some((x) => x.correct);
    if (isQ) {
      if (opt.correct) {
        setUyTin((prev) => Math.min(100, Math.max(0, prev + 10)));
        setThienCam((prev) => Math.min(100, Math.max(0, prev + 4)));
        setCorrectN((prev) => prev + 1);
      } else {
        setUyTin((prev) => Math.min(100, Math.max(0, prev - 5)));
      }
    }

    if (opt.dc) {
      setThienCam((prev) => Math.min(100, Math.max(0, prev + opt.dc!)));
    }

    if (onChoiceSelected) {
      onChoiceSelected(optIndex);
    }

    if (opt.reply) {
      setInjectedReply(opt.reply);
    } else {
      advanceScript();
    }
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setInjectedReply(null);
    setUyTin(50);
    setThienCam(50);
    setCorrectN(0);
  };

  if (!activeNode) return null;

  let stageChar = null;
  let stageMood = undefined;
  if (activeNode.t === "say" || activeNode.t === "choice") {
    stageChar = activeNode.who;
    stageMood = activeNode.mood;
  }

  let endTitle = "";
  let endRes = "";
  let endNote = "";
  if (activeNode.t === "end") {
    if (uyTin >= 85) {
      endTitle = "Báo cáo viên chính";
      endRes = "Bạn được mời đứng tên báo cáo tại hội thảo";
      endNote =
        "Giáo sư Lâm gật đầu hài lòng: cậu không chỉ thuộc bài, cậu hiểu mạch tư duy của cả chương.";
    } else if (uyTin >= 60) {
      endTitle = "Đồng tác giả";
      endRes = "Bạn được ghi tên đồng tác giả";
      endNote = "Một kết quả vững vàng. Vài chỗ còn lăn tăn, nhưng nền tảng Chương 1 đã chắc.";
    } else {
      endTitle = "Trợ lý tập sự";
      endRes = "Bạn cần ôn lại trước khi đứng tên";
      endNote =
        "Giáo sư vỗ vai: “Cứ chơi lại, lần sau sẽ khác.” Khung chương đã có, chỉ cần nắm kỹ hơn.";
    }
  }

  return (
    <View style={{ flex: 1, width: "100%", backgroundColor: "#101018", overflow: "hidden" }}>
      {/* Invisible Pressable Layer for progressing dialogue */}
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      >
        <MovieStage sceneBg={currentBg} characterId={stageChar} mood={stageMood} />
      </View>

      {/* Invisible layer to capture taps on the stage (above stage, below HUD/Dialogue) */}
      {activeNode.t === "say" && (
        <Pressable
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 140 }}
          onPress={() => dialogueRef.current?.advanceOrSkip()}
        />
      )}

      {/* HUD Overlay */}
      {activeNode.t === "scene" || activeNode.t === "act" || activeNode.t === "end" ? null : (
        <MovieHUD actName={currentActName} thienCam={thienCam} uyTin={uyTin} />
      )}

      {/* Dialogue Overlay */}
      {(activeNode.t === "say" || activeNode.t === "choice") && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            minHeight: 140,
            paddingTop: 32,
            backgroundColor: "rgba(10,12,9,0.85)",
          }}
        >
          <MovieDialogue
            ref={dialogueRef}
            who={activeNode.who}
            text={activeNode.t === "choice" ? activeNode.q : activeNode.text}
            onNext={activeNode.t === "choice" ? () => {} : handleNext}
          />
        </View>
      )}

      {/* Choices Overlay */}
      {activeNode.t === "choice" && (
        <MovieChoices options={activeNode.opts} onSelect={handleChoice} />
      )}

      {/* End Screen */}
      {activeNode.t === "end" && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#fbbf24",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Kết thúc chương
          </Text>
          <Text style={{ fontSize: 20, color: "white", textAlign: "center", marginBottom: 5 }}>
            {endTitle}
          </Text>
          <Text style={{ fontSize: 16, color: "#aaa", textAlign: "center", marginBottom: 20 }}>
            {endRes}
          </Text>

          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: 15,
              borderRadius: 10,
              width: "100%",
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>
              Câu đúng: {correctN}/{totalQ}
            </Text>
            <Text style={{ color: "white", fontSize: 16, marginBottom: 5 }}>
              Uy tín: <Text style={{ color: "#fbbf24" }}>{uyTin}</Text>
            </Text>
            <Text style={{ color: "white", fontSize: 16, marginBottom: 10 }}>
              Thiện cảm: <Text style={{ color: "#fbbf24" }}>{thienCam}</Text>
            </Text>

            <Text style={{ color: "#e5e7eb", fontSize: 14, fontStyle: "italic", lineHeight: 20 }}>
              {endNote}
            </Text>
          </View>

          <Pressable
            onPress={() => onEnd({ thienCam, uyTin, correctN })}
            style={({ pressed }) => ({
              backgroundColor: "#3b82f6",
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 20,
              opacity: pressed ? 0.8 : 1,
              marginBottom: 15,
              width: "100%",
            })}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>
              Tiếp tục
            </Text>
          </Pressable>

          <Pressable
            onPress={handleReplay}
            style={({ pressed }) => ({
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#6b7280",
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 20,
              opacity: pressed ? 0.8 : 1,
              width: "100%",
            })}
          >
            <Text
              style={{ color: "#9ca3af", fontSize: 16, fontWeight: "bold", textAlign: "center" }}
            >
              Chơi lại
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
