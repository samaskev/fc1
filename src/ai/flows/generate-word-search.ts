'use server';
/**
 * @fileOverview Flow to generate a word search puzzle.
 *
 * - generateWordSearch - A function that generates a puzzle.
 * - GenerateWordSearchInput - The input type for the function.
 * - GenerateWordSearchOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWordSearchInputSchema = z.object({
  topic: z.string().describe('The topic for the word search puzzle.'),
  gridSize: z
    .number()
    .min(8)
    .max(20)
    .default(10)
    .describe('The size of the square grid (e.g., 10 for a 10x10 grid).'),
  numWords: z
    .number()
    .min(3)
    .max(12)
    .default(5)
    .describe('The number of words to hide in the puzzle.'),
});
export type GenerateWordSearchInput = z.infer<typeof GenerateWordSearchInputSchema>;

const GenerateWordSearchOutputSchema = z.object({
  grid: z
    .array(z.array(z.string().length(1).toUpperCase()))
    .describe('The 2D array representing the letter grid.'),
  words: z
    .array(z.string().toUpperCase())
    .describe('The list of words hidden in the grid.'),
});
export type GenerateWordSearchOutput = z.infer<typeof GenerateWordSearchOutputSchema>;

export async function generateWordSearch(input: GenerateWordSearchInput): Promise<GenerateWordSearchOutput> {
  return generateWordSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWordSearchPrompt',
  input: {schema: GenerateWordSearchInputSchema},
  output: {schema: GenerateWordSearchOutputSchema},
  prompt: `You are an expert puzzle designer. Your task is to create a fun and educational word search puzzle.

Generate a word search puzzle based on the following criteria:
- Topic: {{{topic}}}
- Grid Size: {{{gridSize}}}x{{{gridSize}}}
- Number of words: {{{numWords}}}

The words must be related to the given topic.
The words can be placed horizontally, vertically, or diagonally, in any direction (forwards or backwards).
All words and grid letters must be in uppercase.
Fill any empty spaces in the grid with random uppercase letters.

The final output must be a valid JSON object containing:
1.  A "grid" key: a 2D array of strings, where each string is a single uppercase letter, representing the {{{gridSize}}}x{{{gridSize}}} puzzle.
2.  A "words" key: an array of strings, containing the {{{numWords}}} hidden words in uppercase.

Example for a 4x4 grid with 2 words about "fruit":
{
  "grid": [
    ["A", "P", "P", "L"],
    ["X", "O", "Y", "E"],
    ["B", "A", "N", "A"],
    ["Z", "W", "V", "O"]
  ],
  "words": ["APPLE", "BANANA"]
}

Make sure the words are actually findable in the grid you provide. Double-check your work.
`,
});

const generateWordSearchFlow = ai.defineFlow(
  {
    name: 'generateWordSearchFlow',
    inputSchema: GenerateWordSearchInputSchema,
    outputSchema: GenerateWordSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
