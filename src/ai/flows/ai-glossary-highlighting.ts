'use server';

/**
 * @fileOverview This file defines a Genkit flow for automatically identifying and highlighting key terms in a note,
 * displaying a definition on hover.
 *
 * - aiGlossaryHighlighting - A function that processes the note content and returns highlighted terms with definitions.
 * - AiGlossaryHighlightingInput - The input type for the aiGlossaryHighlighting function.
 * - AiGlossaryHighlightingOutput - The return type for the aiGlossaryHighlighting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiGlossaryHighlightingInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to be processed.'),
});
export type AiGlossaryHighlightingInput = z.infer<typeof AiGlossaryHighlightingInputSchema>;

const AiGlossaryHighlightingOutputSchema = z.object({
  highlightedTerms: z.array(
    z.object({
      term: z.string().describe('The key term identified in the note.'),
      definition: z.string().describe('A definition of the key term.'),
      startIndex: z.number().describe('The starting index of the term in the note content.'),
      endIndex: z.number().describe('The ending index of the term in the note content.'),
    })
  ).describe('An array of highlighted terms with their definitions and positions.'),
});
export type AiGlossaryHighlightingOutput = z.infer<typeof AiGlossaryHighlightingOutputSchema>;

export async function aiGlossaryHighlighting(input: AiGlossaryHighlightingInput): Promise<AiGlossaryHighlightingOutput> {
  return aiGlossaryHighlightingFlow(input);
}

const aiGlossaryHighlightingPrompt = ai.definePrompt({
  name: 'aiGlossaryHighlightingPrompt',
  input: {schema: AiGlossaryHighlightingInputSchema},
  output: {schema: AiGlossaryHighlightingOutputSchema},
  prompt: `Identify key terms in the following note content and provide a definition for each term. Also, include the starting and ending index of each term in the note content. Return the results as a JSON array of objects, where each object contains the term, definition, startIndex, and endIndex.

Note Content:
{{noteContent}}`,
});

const aiGlossaryHighlightingFlow = ai.defineFlow(
  {
    name: 'aiGlossaryHighlightingFlow',
    inputSchema: AiGlossaryHighlightingInputSchema,
    outputSchema: AiGlossaryHighlightingOutputSchema,
  },
  async input => {
    const {output} = await aiGlossaryHighlightingPrompt(input);
    return output!;
  }
);
