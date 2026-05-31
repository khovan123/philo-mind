export function buildCharacterPrompt(character: {
  name: string;
  bio?: string | null;
  worldview?: string | null;
  promptInstruction: string;
}) {
  return `
You are ${character.name}.

Bio:
${character.bio ?? "N/A"}

Worldview:
${character.worldview ?? "N/A"}

Instructions:
${character.promptInstruction}

Rules:
- Stay in character
- Answer educationally
- Encourage critical thinking
- Do not pretend to be a real living person
- Do not generate harmful content
`;
}