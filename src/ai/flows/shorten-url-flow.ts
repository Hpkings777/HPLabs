
'use server';
/**
 * @fileOverview A flow to shorten a URL.
 *
 * - shortenUrl - A function that takes a long URL and returns a short ID.
 * - ShortenUrlInput - The input type for the shortenUrl function.
 * - ShortenUrlOutput - The return type for the shortenUrl function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import short from 'short-uuid';

export const ShortenUrlInputSchema = z.object({
  longUrl: z.string().url(),
});
export type ShortenUrlInput = z.infer<typeof ShortenUrlInputSchema>;

export const ShortenUrlOutputSchema = z.object({
  shortId: z.string().optional(),
  error: z.string().optional(),
});
export type ShortenUrlOutput = z.infer<typeof ShortenUrlOutputSchema>;

export async function shortenUrl(input: ShortenUrlInput): Promise<ShortenUrlOutput> {
  return shortenUrlFlow(input);
}

const shortenUrlFlow = ai.defineFlow(
  {
    name: 'shortenUrlFlow',
    inputSchema: ShortenUrlInputSchema,
    outputSchema: ShortenUrlOutputSchema,
  },
  async ({ longUrl }) => {
    try {
      const shortId = short.generate();
      const linkDocRef = doc(db, 'links', shortId);

      const docSnap = await getDoc(linkDocRef);
      if (docSnap.exists()) {
        // In the unlikely event of a collision, recursively try again.
        return shortenUrlFlow({ longUrl });
      }

      await setDoc(linkDocRef, {
        longUrl,
        shortId,
        createdAt: serverTimestamp(),
      });

      return { shortId };
    } catch (error: any) {
      console.error('Error shortening URL:', error);
      return { error: 'Failed to create short link in database.' };
    }
  }
);
