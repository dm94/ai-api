import { groqService } from "./groq";
import { cerebrasService } from "./cerebras";
import { openRouterService } from "./openrouter";
import type { AIService } from "../types";

const services: AIService[] = [];

if (process.env.GROQ_API_KEY) {
  services.push(groqService);
}

if (process.env.CEREBRAS_API_KEY) {
  services.push(cerebrasService);
}

if (process.env.OPENROUTER_API_KEY) {
  services.push(openRouterService);
}

if (services.length === 0) {
  console.warn("No AI services configured. Please check your API keys.");
}

let currentServiceIndex = 0;

export function getNextService(): AIService {
  const service = services[currentServiceIndex];
  currentServiceIndex = (currentServiceIndex + 1) % services.length;
  return service;
}
