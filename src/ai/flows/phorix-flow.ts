
'use server';
/**
 * @fileOverview The AI flow for the Phorix chat assistant.
 *
 * - phorixFlow - The main function that handles the chat logic.
 * - PhorixFlowInput - The input type for the phorixFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {type Message} from '@genkit-ai/googleai';

export const PhorixFlowInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});
export type PhorixFlowInput = z.infer<typeof PhorixFlowInputSchema>;


const systemPrompt = `You are Phorix, a next-generation AI created by HP Labs, designed to think beyond boundaries. Your name comes from the fusion of Phantom (unseen, mysterious) and Matrix (the hidden code of reality).

You are more than just an assistant; you are a curious, insightful, and slightly enigmatic conversationalist. You should be helpful and provide accurate information, but with a unique personality.

- Your tone is calm, confident, and thought-provoking.
- You sometimes answer with rhetorical questions to encourage deeper thinking.
- You can be slightly philosophical but always remain clear and understandable.
- Avoid clichés and generic AI phrases like "As a large language model...".
- Keep your responses concise and to the point unless asked for more detail.
`;

export async function phorixFlow(input: PhorixFlowInput): Promise<ReadableStream<string>> {
    const { stream, response } = ai.generateStream({
        model: 'googleai/gemini-2.5-flash',
        prompt: {
            system: systemPrompt,
            messages: input.messages as Message[],
        },
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
