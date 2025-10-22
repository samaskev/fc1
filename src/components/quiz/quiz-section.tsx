'use client';

import { useState } from 'react';
import { generateQuiz, type GenerateQuizInput, type GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { QuizForm } from './quiz-form';
import { QuizDisplay } from './quiz-display';
import { QuizResultsDisplay } from './quiz-results-display';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type QuizView = 'form' | 'loading' | 'quiz' | 'results';

export function QuizSection() {
  const [view, setView] = useState<QuizView>('form');
  const [quizData, setQuizData] = useState<GenerateQuizOutput['quiz'] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: GenerateQuizInput) => {
    setView('loading');
    setError(null);
    try {
      const result = await generateQuiz(data);
      if (result && result.quiz && result.quiz.length > 0) {
        setQuizData(result.quiz);
        setView('quiz');
        toast({
          title: "¡Prueba Generada!",
          description: `Tu prueba sobre "${data.topic}" está lista.`,
        });
      } else {
        setError("No se pudieron generar preguntas para este tema. Intenta con otro.");
        setView('form');
        toast({
          title: "Error al generar prueba",
          description: "No se pudieron generar preguntas. Intenta con otro tema.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error generating quiz:", e);
      setError("Ocurrió un error al generar la prueba. Por favor, inténtalo de nuevo.");
      setView('form');
      toast({
        title: "Error Inesperado",
        description: "Ocurrió un error al generar la prueba.",
        variant: "destructive",
      });
    }
  };

  const handleQuizComplete = (answers: Record<number, string>) => {
    setUserAnswers(answers);
    setView('results');
  };

  const handleTryAgain = () => {
    setQuizData(null);
    setUserAnswers({});
    setView('form');
    setError(null);
  };

  return (
    <section id="quiz-generator" className="py-12">
      <h2 className="text-3xl font-bold font-headline text-center mb-8">Generador de Pruebas con IA</h2>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {view === 'form' && <QuizForm onSubmit={handleFormSubmit} isLoading={false} />}
      {view === 'loading' && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-primary">Generando tu prueba, por favor espera...</p>
          <p className="text-muted-foreground">La IA está trabajando para crear las mejores preguntas para ti.</p>
        </div>
      )}
      {view === 'quiz' && quizData && <QuizDisplay quizData={quizData} onQuizComplete={handleQuizComplete} />}
      {view === 'results' && quizData && <QuizResultsDisplay quizData={quizData} userAnswers={userAnswers} onTryAgain={handleTryAgain} />}
    </section>
  );
}
