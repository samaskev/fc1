'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Puzzle } from "lucide-react";
import type { GenerateWordSearchInput } from '@/ai/flows/generate-word-search';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: "El tema debe tener al menos 3 caracteres.",
  }).max(50, { message: "El tema no puede tener más de 50 caracteres."}),
  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
});

interface WordSearchFormProps {
  onSubmit: (data: GenerateWordSearchInput) => void;
  isLoading: boolean;
}

export function WordSearchForm({ onSubmit, isLoading }: WordSearchFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "Animals",
      difficulty: "easy",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const difficultyMap = {
      easy: { gridSize: 10, numWords: 5 },
      medium: { gridSize: 15, numWords: 8 },
      hard: { gridSize: 20, numWords: 10 },
    };
    const { gridSize, numWords } = difficultyMap[values.difficulty];
    
    onSubmit({ topic: values.topic, gridSize, numWords });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-6 border rounded-lg shadow-md bg-card max-w-md mx-auto">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Tema</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Fruits, Sports, The Office" {...field} />
              </FormControl>
               <FormDescription>Elige un tema en inglés para el juego.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Nivel de Dificultad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un nivel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Fácil (10x10)</SelectItem>
                    <SelectItem value="medium">Medio (15x15)</SelectItem>
                    <SelectItem value="hard">Difícil (20x20)</SelectItem>
                  </SelectContent>
                </Select>
                 <FormDescription>El nivel determina el tamaño de la cuadrícula y la cantidad de palabras.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Generando..."
          ) : (
            <>
              <Puzzle className="mr-2 h-4 w-4" /> Generar Juego
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
