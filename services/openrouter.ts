import { OpenRouter } from '@openrouter/sdk';
import type { AIService, ChatMessage } from '../types';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const openRouterService: AIService = {
  name: 'OpenRouter',
  async chat(messages: ChatMessage[]) {
    const stream = await openRouter.chat.send({
      messages: messages as any,
      model: process.env.OPENROUTER_MODEL ?? 'google/gemini-2.0-flash-exp:free',
      stream: true,
      provider: {
        sort: 'throughput'
      }
    });

    return (async function* () {
      for await (const chunk of stream) {
        yield chunk.choices[0]?.delta?.content ?? ''
      }
    })()
  }
}
