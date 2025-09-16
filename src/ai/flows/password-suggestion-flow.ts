'use server';
/**
 * @fileOverview A flow for generating password suggestions.
 *
 * - suggestPassword - A function that suggests a stronger password.
 * - SuggestPasswordInput - The input type for the suggestPassword function.
 * - SuggestPasswordOutput - The return type for the suggestPassword function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPasswordInputSchema = z.object({
  currentPassword: z.string().describe('The current weak password.'),
});
export type SuggestPasswordInput = z.infer<typeof SuggestPasswordInputSchema>;

const SuggestPasswordOutputSchema = z.object({
  suggestion: z.string().describe('A stronger password suggestion.'),
});
export type SuggestPasswordOutput = z.infer<typeof SuggestPasswordOutputSchema>;

export async function suggestPassword(
  input: SuggestPasswordInput
): Promise<SuggestPasswordOutput> {
  return suggestPasswordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPasswordPrompt',
  input: {schema: SuggestPasswordInputSchema},
  output: {schema: SuggestPasswordOutputSchema},
  prompt: `You are a security expert. Based on the user's current password, suggest a much stronger, more secure password. The new password should be significantly different but could be inspired by the original.

Current password: {{{currentPassword}}}

Generate a single, strong password suggestion.`,
});

const suggestPasswordFlow = ai.defineFlow(
  {
    name: 'suggestPasswordFlow',
    inputSchema: SuggestPasswordInputSchema,
    outputSchema: SuggestPasswordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
