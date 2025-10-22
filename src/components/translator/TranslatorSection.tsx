'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { translateText } from '@/ai/flows/translate-text';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, ArrowRightLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  sourceText: z.string().min(1, { message: 'Por favor, ingresa texto para traducir.' }),
  sourceLang: z.enum(['English', 'Spanish']),
  targetLang: z.enum(['English', 'Spanish']),
}).refine(data => data.sourceLang !== data.targetLang, {
    message: 'El idioma de origen y destino no pueden ser el mismo.',
    path: ['sourceLang'],
});


export function TranslatorSection() {
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sourceText: '',
            sourceLang: 'English',
            targetLang: 'Spanish',
        },
    });
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setTranslatedText('');
        try {
            const result = await translateText({ text: values.sourceText, sourceLang: values.sourceLang, targetLang: values.targetLang });
            setTranslatedText(result.translatedText);
        } catch (e) {
            console.error('Error translating text:', e);
            toast({
                title: 'Error de Traducción',
                description: 'No se pudo completar la traducción. Inténtalo de nuevo.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const swapLanguages = () => {
        const sourceLang = form.getValues('sourceLang');
        const targetLang = form.getValues('targetLang');
        const sourceText = form.getValues('sourceText');
        
        form.setValue('sourceLang', targetLang);
        form.setValue('targetLang', sourceLang);
        form.setValue('sourceText', translatedText);
        setTranslatedText(sourceText);
    };

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow w-full">
            <CardHeader>
                <CardTitle className="flex items-center text-2xl font-headline">
                    <Languages className="mr-3 h-7 w-7 text-primary" />
                    Traductor
                </CardTitle>
                <CardDescription>Traduce texto entre inglés y español con ayuda de la IA.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                             {/* Source Language */}
                             <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="sourceLang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>De:</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="English">Inglés</SelectItem>
                                                    <SelectItem value="Spanish">Español</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sourceText"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea placeholder="Escribe aquí el texto..." {...field} rows={6} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                             
                            {/* Swap Button */}
                            <Button type="button" variant="outline" size="icon" onClick={swapLanguages} className="self-center">
                                <ArrowRightLeft />
                                <span className="sr-only">Intercambiar idiomas</span>
                            </Button>

                             {/* Target Language */}
                             <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="targetLang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>A:</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="English">Inglés</SelectItem>
                                                    <SelectItem value="Spanish">Español</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <Textarea 
                                    placeholder="La traducción aparecerá aquí..." 
                                    value={isLoading ? 'Traduciendo...' : translatedText} 
                                    readOnly 
                                    rows={6} 
                                    className="bg-muted/50"
                                />
                             </div>
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <><Loader2 className="mr-2 animate-spin" />Traduciendo...</> : 'Traducir'}
                        </Button>
                         <FormMessage>{form.formState.errors.sourceLang?.message}</FormMessage>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
