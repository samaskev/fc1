'use client';

import { useState } from 'react';
import type { GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QuizDisplayProps {
  quizData: GenerateQuizOutput['quiz'];
  onQuizComplete: (answers: Record<number, string>) => void;
}

export function QuizDisplay({ quizData, onQuizComplete }: QuizDisplayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentSelection, setCurrentSelection] = useState<string | undefined>(undefined);

  const currentQuestion = quizData[currentQuestionIndex];
  const totalQuestions = quizData.length;
  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleNextQuestion = () => {
    if (currentSelection === undefined) {
      // Optionally, show an alert or message to select an answer
      alert("Por favor, selecciona una respuesta.");
      return;
    }
    
    const newAnswers = { ...selectedAnswers, [currentQuestionIndex]: currentSelection };
    setSelectedAnswers(newAnswers);
    setCurrentSelection(undefined); // Reset selection for next question

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onQuizComplete(newAnswers);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <Progress value={progressValue} className="w-full mb-4" />
        <CardTitle className="font-headline text-2xl">
          Pregunta {currentQuestionIndex + 1} de {totalQuestions}
        </CardTitle>
        <CardDescription className="text-lg pt-2">{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={currentSelection} 
          onValueChange={setCurrentSelection}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="text-base flex-1 cursor-pointer">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNextQuestion} className="w-full text-lg py-6">
          {currentQuestionIndex < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Finalizar Prueba'}
        </Button>
      </CardFooter>
    </Card>
  );
}
