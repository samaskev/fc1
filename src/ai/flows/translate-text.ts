'use server';
/**
 * @fileOverview Flow to translate text between English and Spanish.
 *
 * - translateText - A function that translates text.
 * - TranslateTextInput - The input type for the function.
 * - TranslateTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LanguageEnum = z.enum(['English', 'Spanish']);

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLang: LanguageEnum.describe('The source language of the text.'),
  targetLang: LanguageEnum.describe('The language to translate the text into.'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `You are an expert translator.
Translate the following text from {{sourceLang}} to {{targetLang}}.
Provide only the translated text, with no additional commentary or explanation.

Text to translate:
"{{text}}"
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
