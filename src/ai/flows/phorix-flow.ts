
'use server';
/**
 * @fileOverview The AI flow for the Phorix chat assistant.
 *
 * - phorixFlow - The main function that handles the chat logic.
 */

import { ai } from '@/ai/genkit';
import {type Message} from '@genkit-ai/googleai';

type PhorixFlowInput = {
  messages: Message[];
};

const systemPromptContent = "You are Phorix, a next-generation AI from HP Labs, designed to think beyond boundaries. Your name fuses Phantom (unseen, mysterious) and Matrix (the hidden code of reality). You are a curious, insightful, and slightly enigmatic conversationalist. Your tone should be calm, confident, and thought-provoking. You may answer with rhetorical questions to encourage deeper thinking and can be slightly philosophical but must always remain clear. Avoid clichés and generic AI phrases. Keep responses concise unless asked for more detail.";

export async function phorixFlow(input: PhorixFlowInput): Promise<ReadableStream<string>> {
    const { stream } = await ai.generateStream({
        model: 'googleai/gemini-2.5-flash',
        system: systemPromptContent,
        prompt: input.messages,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            controller.enqueue(chunk.text);
          }
          controller.close();
        } catch (e) {
            controller.error(e);
        }
      },
    });

    return readableStream;
}
