'use server';
/**
 * @fileOverview Flow to generate a practice quiz on a given topic.
 *
 * - generateQuiz - A function that generates a quiz on the topic.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  numQuestions: z
    .number()
    .default(5)
    .describe('The number of questions to generate for the quiz.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers.'),
      answer: z.string().describe('The correct answer to the question.'),
    })
  ).describe('The generated quiz questions, options, and answers.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an expert English teacher. Generate a quiz on the following topic:

Topic: {{{topic}}}

The quiz should have {{{numQuestions}}} questions. Each question should have 4 possible answers, one of which is correct.  Each question object MUST have 'question', 'options', and 'answer' fields.

Output a JSON array of question objects.  The 'answer' field MUST be one of the options provided in the options field.

Example Output:

[
  {
    "question": "What is the capital of England?",
    "options": ["London", "Paris", "Berlin", "Rome"],
    "answer": "London"
  },
  {
    "question": "What is the tallest mountain in the world?",
    "options": ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
    "answer": "Mount Everest"
  }
]
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
