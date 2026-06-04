export interface AiChatPromptCharacter {
  id: string;
  name: string;
  promptInstruction: string;
  worldview?: string | null;
}

export interface AiChatMessageContext {
  senderType: "USER" | "AI";
  message: string;
}

function buildCharacterInstruction(character: AiChatPromptCharacter) {
  const pieces = [`You are ${character.name}.`, character.promptInstruction];

  if (character.worldview) {
    pieces.push(`Worldview: ${character.worldview}`);
  }

  return pieces.filter(Boolean).join(" ");
}

export function buildChatPrompt(
  character: AiChatPromptCharacter,
  history: AiChatMessageContext[],
  userMessage: string,
) {
  const lines = [buildCharacterInstruction(character), ""];

  for (const item of history) {
    if (item.senderType === "USER") {
      lines.push(`User: ${item.message}`);
    } else {
      lines.push(`Assistant: ${item.message}`);
    }
  }

  lines.push(`User: ${userMessage}`);
  lines.push("Assistant:");

  return lines.join("\n");
}
