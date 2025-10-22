'use client';

import type { GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface QuizResultsDisplayProps {
  quizData: GenerateQuizOutput['quiz'];
  userAnswers: Record<number, string>;
  onTryAgain: () => void;
}

export function QuizResultsDisplay({ quizData, userAnswers, onTryAgain }: QuizResultsDisplayProps) {
  let score = 0;
  quizData.forEach((question, index) => {
    if (userAnswers[index] === question.answer) {
      score++;
    }
  });
  const percentageScore = (score / quizData.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl mb-2">¡Prueba Completada!</CardTitle>
        <p className="text-xl font-semibold text-primary">
          Tu Puntuación: {score} de {quizData.length} ({percentageScore.toFixed(0)}%)
        </p>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold font-headline mb-4">Resumen de Respuestas:</h3>
        <ScrollArea className="h-[300px] pr-4">
          {quizData.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.answer;
            return (
              <div key={index} className="mb-4 p-3 border rounded-md">
                <p className="font-semibold text-base mb-1 flex items-center">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-2 text-red-500" />
                  )}
                  Pregunta {index + 1}: {question.question}
                </p>
                <p className="text-sm ml-7">Tu respuesta: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{userAnswer || "No respondida"}</span></p>
                {!isCorrect && (
                  <p className="text-sm ml-7">Respuesta correcta: <span className="text-blue-600 font-medium">{question.answer}</span></p>
                )}
                {index < quizData.length - 1 && <Separator className="my-3" />}
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button onClick={onTryAgain} className="w-full text-lg py-6" variant="outline">
          <HelpCircle className="mr-2 h-5 w-5" /> Intentar Otra Prueba
        </Button>
      </CardFooter>
    </Card>
  );
}
