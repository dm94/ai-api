import Cerebras from "@cerebras/cerebras_cloud_sdk";
import type { AIService, ChatMessage } from "../types";

interface ChatCompletionChunk {
  choices: {
    delta?: {
      content?: string | null;
    };
  }[];
}

const cerebras = process.env.CEREBRAS_API_KEY ? new Cerebras() : null;

export const cerebrasService: AIService = {
  name: "Cerebras",
  async chat(messages: ChatMessage[]) {
    if (!cerebras) {
      throw new Error("Cerebras API key is not configured");
    }

    const stream = await cerebras.chat.completions.create({
      messages: messages as unknown as [],
      model: process.env.CEREBRAS_MODEL ?? "zai-glm-4.6",
      stream: true,
      max_completion_tokens: 40960,
      temperature: 0.6,
      top_p: 0.95,
    });

    return (async function* () {
      for await (const chunk of stream) {
        yield (chunk as unknown as ChatCompletionChunk).choices[0]?.delta?.content ?? "";
      }
    })();
  },
};
