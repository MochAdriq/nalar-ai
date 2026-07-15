import { NextRequest, NextResponse } from 'next/server';
import { ai, GEMMA_MODEL } from '@/lib/gemma';
import {
  buildSystemPrompt,
  parseEureka,
  parseMisconceptions,
  parseJailbreakBlocked,
  cleanResponseContent,
} from '@/lib/prompts';
import { ChatRequest, ChatResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, hintLevel } = body;

    if (!messages || !hintLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: messages, hintLevel' },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(hintLevel);

    // Build conversation history for Gemma
    const conversationHistory = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.content }],
      }));

    const response = await ai.models.generateContent({
      model: GEMMA_MODEL,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,
      },
      contents: conversationHistory,
    });

    const rawContent = response.text || '';

    // Parse response for Eureka moment, misconceptions, and jailbreak defense
    const { cleanContent, isEureka, eurekaSummary } = parseEureka(rawContent);
    const misconceptions = parseMisconceptions(rawContent);
    const jailbreakBlocked = parseJailbreakBlocked(rawContent);
    const finalContent = cleanResponseContent(rawContent);

    const chatResponse: ChatResponse = {
      content: finalContent,
      isEureka,
      eurekaSummary: eurekaSummary
        ? {
            misconception: eurekaSummary.misconception,
            conceptMastered: eurekaSummary.conceptMastered,
            keyTakeaway: eurekaSummary.keyTakeaway,
          }
        : undefined,
      misconceptions,
      jailbreakBlocked,
    };

    return NextResponse.json(chatResponse);
  } catch (error: unknown) {
    console.error('Chat API Error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
