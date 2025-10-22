'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import type { GenerateQuizInput } from '@/ai/flows/generate-quiz';

const quizFormSchema = z.object({
  topic: z.string().min(3, {
    message: "El tema debe tener al menos 3 caracteres.",
  }),
  numQuestions: z.coerce.number().min(1, { message: "Mínimo 1 pregunta."}).max(10, {message: "Máximo 10 preguntas."}).default(5),
});

interface QuizFormProps {
  onSubmit: (data: GenerateQuizInput) => void;
  isLoading: boolean;
}

export function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
  const form = useForm<z.infer<typeof quizFormSchema>>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      topic: "",
      numQuestions: 5,
    },
  });

  function handleSubmit(values: z.infer<typeof quizFormSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-6 border rounded-lg shadow-md bg-card">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Tema de la Prueba</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Verbos en presente simple" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Número de Preguntas</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Generando..."
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" /> Generar Prueba con IA
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
