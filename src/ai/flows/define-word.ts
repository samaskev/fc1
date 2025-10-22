'use server';
/**
 * @fileOverview Flow to define a word for an English language learner.
 *
 * - defineWord - A function that provides a definition and example sentence.
 * - DefineWordInput - The input type for the function.
 * - DefineWordOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DefineWordInputSchema = z.object({
  word: z.string().describe('The English word to define.'),
});
export type DefineWordInput = z.infer<typeof DefineWordInputSchema>;

const DefineWordOutputSchema = z.object({
  definition: z
    .string()
    .describe('A simple definition of the word, suitable for a language learner.'),
  example: z
    .string()
    .describe('An example sentence using the word.'),
});
export type DefineWordOutput = z.infer<typeof DefineWordOutputSchema>;

export async function defineWord(input: DefineWordInput): Promise<DefineWordOutput> {
  return defineWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'defineWordPrompt',
  input: {schema: DefineWordInputSchema},
  output: {schema: DefineWordOutputSchema},
  prompt: `You are an expert English teacher assisting a student.
The student has selected a word and needs a clear, simple explanation.

Please define the word "{{word}}".

- Provide a simple definition in English that a language learner can easily understand.
- Provide one clear example sentence showing how the word is used in context.
`,
});

const defineWordFlow = ai.defineFlow(
  {
    name: 'defineWordFlow',
    inputSchema: DefineWordInputSchema,
    outputSchema: DefineWordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
