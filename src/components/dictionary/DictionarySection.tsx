'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { defineWord, type DefineWordOutput } from '@/ai/flows/define-word';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookMarked, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  word: z.string().min(2, { message: 'La palabra debe tener al menos 2 caracteres.' }).regex(/^[a-zA-Z]+$/, { message: 'Solo se permiten letras en inglés.' }),
});

export function DictionarySection() {
  const [definition, setDefinition] = useState<DefineWordOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wordSearched, setWordSearched] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { word: '' },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setDefinition(null);
    setWordSearched(values.word);
    try {
      const result = await defineWord({ word: values.word });
      setDefinition(result);
    } catch (e) {
      console.error('Error defining word:', e);
      toast({
        title: 'Error de Diccionario',
        description: 'No se pudo obtener la definición. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <BookMarked className="mr-3 h-7 w-7 text-primary" />
          Diccionario de Inglés
        </CardTitle>
        <CardDescription>Busca la definición y un ejemplo de cualquier palabra en inglés.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Ej: 'serendipity'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="h-10">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Buscar'}
            </Button>
          </form>
        </Form>
        {(isLoading || definition) && (
          <div className="mt-6 border-t pt-6">
            {isLoading && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="animate-spin text-primary" />
                <p className="text-muted-foreground">Buscando definición para "{wordSearched}"...</p>
              </div>
            )}
            {definition && (
              <div className="space-y-4 animate-in fade-in-50">
                <h3 className="text-xl font-headline capitalize text-primary">{wordSearched}</h3>
                <div>
                  <h4 className="font-semibold text-accent">Definición:</h4>
                  <p className="text-muted-foreground">{definition.definition}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-accent">Ejemplo de uso:</h4>
                  <p className="italic text-muted-foreground">"{definition.example}"</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
