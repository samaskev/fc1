'use client';

import { useState } from 'react';
import { generateWordSearch, type GenerateWordSearchInput, type GenerateWordSearchOutput } from '@/ai/flows/generate-word-search';
import { WordSearchForm } from './word-search-form';
import { WordSearchGrid } from './word-search-grid';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Puzzle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

type GameView = 'form' | 'loading' | 'game';

export function WordSearchSection() {
  const [view, setView] = useState<GameView>('form');
  const [puzzle, setPuzzle] = useState<GenerateWordSearchOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: GenerateWordSearchInput) => {
    setView('loading');
    setError(null);
    try {
      const result = await generateWordSearch(data);
      if (result && result.grid && result.words) {
        setPuzzle(result);
        setView('game');
        toast({
          title: "¡Sopa de Letras Generada!",
          description: `Tu juego sobre "${data.topic}" está listo. ¡A buscar!`,
        });
      } else {
        throw new Error("La IA no devolvió un formato de puzzle válido.");
      }
    } catch (e) {
      console.error("Error generating word search:", e);
      const errorMessage = e instanceof Error ? e.message : "Ocurrió un error inesperado.";
      setError(`No se pudo generar el juego. ${errorMessage}`);
      setView('form');
      toast({
        title: "Error al Generar Juego",
        description: "Inténtalo de nuevo con otro tema o dificultad.",
        variant: "destructive",
      });
    }
  };
  
  const handleGameWon = () => {
    toast({
        title: "¡Felicidades!",
        description: "¡Has encontrado todas las palabras!",
    });
    // Maybe add a button to play again
  }

  const handlePlayAgain = () => {
    setPuzzle(null);
    setView('form');
    setError(null);
  };

  return (
    <section id="word-search-game" className="py-12">
       <h2 className="text-3xl font-bold font-headline text-center mb-2 flex items-center justify-center">
        <Puzzle className="mr-3 h-8 w-8 text-primary"/>
        Juego Didáctico: Sopa de Letras
      </h2>
      <p className="text-lg text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Refuerza tu vocabulario. Elige un tema y una dificultad, y la IA creará un juego para ti.
      </p>
      
      {error && (
        <Alert variant="destructive" className="mb-6 max-w-2xl mx-auto">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {view === 'form' && <WordSearchForm onSubmit={handleFormSubmit} isLoading={false} />}
      
      {view === 'loading' && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-primary">Creando tu sopa de letras...</p>
          <p className="text-muted-foreground">La IA está escondiendo las palabras en la cuadrícula.</p>
        </div>
      )}

      {view === 'game' && puzzle && (
        <WordSearchGrid 
            puzzle={puzzle} 
            onGameWon={handleGameWon} 
            onPlayAgain={handlePlayAgain}
        />
      )}
      <Separator className="my-12" />
    </section>
  );
}
