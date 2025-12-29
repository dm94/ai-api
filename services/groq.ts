import { Groq } from "groq-sdk";
import type { AIService, ChatMessage } from "../types";

const groq = process.env.GROQ_API_KEY ? new Groq() : null;

export const groqService: AIService = {
  name: "Groq",
  async chat(messages: ChatMessage[]) {
    if (!groq) {
      throw new Error("Groq API key is not configured");
    }

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: process.env.GROQ_MODEL ?? "moonshotai/kimi-k2-instruct-0905",
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 1,
      stream: true,
      stop: null,
    });

    return (async function* () {
      for await (const chunk of chatCompletion) {
        yield chunk.choices[0]?.delta?.content ?? "";
      }
    })();
  },
};
