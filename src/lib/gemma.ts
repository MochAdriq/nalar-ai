import { GoogleGenAI } from '@google/genai';

export const GEMMA_MODEL = 'gemma-4-31b-it';

export function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  return new GoogleGenAI({ apiKey });
}

