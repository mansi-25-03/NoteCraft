'use server';
/**
 * @fileOverview Grammar checking AI agent.
 *
 * - grammarCheck - A function that handles the grammar check process.
 * - GrammarCheckInput - The input type for the grammarCheck function.
 * - GrammarCheckOutput - The return type for the grammarCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GrammarCheckInputSchema = z.object({
  text: z.string().describe('The text to check for grammatical errors.'),
});
export type GrammarCheckInput = z.infer<typeof GrammarCheckInputSchema>;

const GrammarCheckOutputSchema = z.object({
  correctedText: z.string().describe('The text corrected for grammatical errors.'),
  explanation: z.string().describe('Explanation of the changes made.'),
});
export type GrammarCheckOutput = z.infer<typeof GrammarCheckOutputSchema>;

export async function grammarCheck(input: GrammarCheckInput): Promise<GrammarCheckOutput> {
  return grammarCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'grammarCheckPrompt',
  input: {schema: GrammarCheckInputSchema},
  output: {schema: GrammarCheckOutputSchema},
  prompt: `You are a grammar expert. You will be given a piece of text and you will return the corrected text and an explanation of the changes you made.\n\nText: {{{text}}}`,
});

const grammarCheckFlow = ai.defineFlow(
  {
    name: 'grammarCheckFlow',
    inputSchema: GrammarCheckInputSchema,
    outputSchema: GrammarCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
