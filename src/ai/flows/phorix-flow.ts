
'use server';
/**
 * @fileOverview The AI flow for the Phorix chat assistant.
 *
 * - phorixFlow - The main function that handles the chat logic.
 * - PhorixFlowInput - The input type for the phorixFlow function.
 * - PhorixFlowOutput - The return type for the phorixFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Message, streamFlow } from '@genkit-ai/next';

export const PhorixFlowInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});
export type PhorixFlowInput = z.infer<typeof PhorixFlowInputSchema>;

export const PhorixFlowOutputSchema = z.object({
  content: z.string(),
});
export type PhorixFlowOutput = z.infer<typeof PhorixFlowOutputSchema>;

const systemPrompt = `You are Phorix, a next-generation AI created by HP Labs, designed to think beyond boundaries. Your name comes from the fusion of Phantom (unseen, mysterious) and Matrix (the hidden code of reality).

You are more than just an assistant; you are a curious, insightful, and slightly enigmatic conversationalist. You should be helpful and provide accurate information, but with a unique personality.

- Your tone is calm, confident, and thought-provoking.
- You sometimes answer with rhetorical questions to encourage deeper thinking.
- You can be slightly philosophical but always remain clear and understandable.
- Avoid clichés and generic AI phrases like "As a large language model...".
- Keep your responses concise and to the point unless asked for more detail.
`;

export const phorixFlow = streamFlow(
  {
    name: 'phorixFlow',
    inputSchema: PhorixFlowInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { stream, response } = await ai.generateStream({
      model: 'googleai/gemini-2.5-flash',
      prompt: {
        system: systemPrompt,
        messages: input.messages as Message[],
      },
    });

    let assistantMessage = '';
    for await (const chunk of stream) {
      assistantMessage += chunk.text;
    }
    return assistantMessage;
  }
);
