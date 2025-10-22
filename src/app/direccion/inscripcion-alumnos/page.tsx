
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ChevronLeft, ClipboardList, CalendarIcon, Save } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';


const formSchema = z.object({
    nro_inscripcion: z.string().min(1, "El Nro. de inscripción es requerido."),
    nombres: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
    apellidos: z.string().min(2, "El apellido debe tener al menos 2 caracteres."),
    fecha_nacimiento: z.date({ required_error: "La fecha de nacimiento es requerida." }),
    mayor_de_edad: z.enum(['Sí', 'No'], { required_error: "Selecciona una opción." }),
    cedula_identidad: z.string().min(5, "La cédula de identidad parece muy corta."),
    expedido: z.string().min(1, "Selecciona un departamento."),
    celular: z.string().regex(/^\d{7,8}$/, "Número de celular inválido (debe tener 7-8 dígitos)."),
    celular_padre: z.string().optional(),
    direccion: z.string().min(5, "La dirección es muy corta."),
    telefono_referencia: z.string().optional(),
    profesion_ocupacion: z.string().optional(),
    nivel_estudios: z.string().optional(),
    email_alumno: z.string().email("Email de alumno inválido.").optional().or(z.literal('')),
    email_tutor: z.string().email("Email de tutor inválido.").optional().or(z.literal('')),
    nombre_padre_tutor: z.string().optional(),
    medio_entero: z.string().optional(),
    turno: z.enum(['Mañana', 'Tarde', 'Noche'], { required_error: "Selecciona un turno." }),
    nivel: z.string().min(1, "El nivel es requerido."),
    curso: z.string().min(1, "El curso es requerido."),
    promocion: z.enum(['Sí', 'No'], { required_error: "Selecciona una opción." }),
    monto: z.coerce.number().positive("El monto debe ser un número positivo."),
    sucursal: z.enum(['Zona Sur', 'Central', 'El Alto'], { required_error: "Selecciona una sucursal." }),
    comentarios: z.string().optional(),
});


export default function InscripcionAlumnosPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nro_inscripcion: "",
            nombres: "",
            apellidos: "",
            cedula_identidad: "",
            celular: "",
            direccion: "",
            nivel: "",
            curso: "",
            monto: 0,
            comentarios: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Datos de Inscripción:", values);
        toast({
            title: "Inscripción Registrada",
            description: `El estudiante ${values.nombres} ${values.apellidos} ha sido inscrito exitosamente.`,
        });
        form.reset();
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary/20">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                        <Link href="/direccion">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Volver al Portal de Dirección
                        </Link>
                    </Button>
                </div>

                <div className="relative text-center mb-12 p-6 md:p-8 bg-card rounded-xl shadow-xl overflow-hidden border border-border">
                    <div className="absolute inset-0 opacity-[0.03] pattern-[0.8rem_0.8rem_#000000_radial-gradient(circle_at_center,_var(--tw-gradient-stops))] dark:opacity-[0.05] dark:pattern-[0.8rem_0.8rem_#ffffff_radial-gradient(circle_at_center,_var(--tw-gradient-stops))]"></div>
                    <ClipboardList className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
                        Formulario de Inscripción
                    </h1>
                    <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Registra los datos de un nuevo estudiante en el sistema.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card className="shadow-lg bg-card">
                            <CardHeader>
                                <CardTitle>Datos Personales</CardTitle>
                                <CardDescription>Información básica del estudiante.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormField control={form.control} name="nro_inscripcion" render={({ field }) => (
                                    <FormItem><FormLabel>Nro. Inscripción</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="nombres" render={({ field }) => (
                                    <FormItem><FormLabel>Nombres</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="apellidos" render={({ field }) => (
                                    <FormItem><FormLabel>Apellidos</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="fecha_nacimiento" render={({ field }) => (
                                    <FormItem className="flex flex-col pt-2"><FormLabel>Fecha de Nacimiento</FormLabel>
                                    <Popover><PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? (format(field.value, "PPP", { locale: es })) : (<span>Selecciona una fecha</span>)}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1930-01-01")} initialFocus />
                                    </PopoverContent>
                                    </Popover><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="mayor_de_edad" render={({ field }) => (
                                    <FormItem><FormLabel>¿Mayor de Edad?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Sí">Sí</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="cedula_identidad" render={({ field }) => (
                                    <FormItem><FormLabel>Cédula de Identidad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="expedido" render={({ field }) => (
                                    <FormItem><FormLabel>Expedido en</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="LP">La Paz</SelectItem><SelectItem value="CB">Cochabamba</SelectItem><SelectItem value="SC">Santa Cruz</SelectItem>
                                            <SelectItem value="OR">Oruro</SelectItem><SelectItem value="PT">Potosí</SelectItem><SelectItem value="CH">Chuquisaca</SelectItem>
                                            <SelectItem value="TJ">Tarija</SelectItem><SelectItem value="BE">Beni</SelectItem><SelectItem value="PD">Pando</SelectItem>
                                        </SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="profesion_ocupacion" render={({ field }) => (
                                    <FormItem><FormLabel>Profesión/Ocupación</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name="nivel_estudios" render={({ field }) => (
                                    <FormItem><FormLabel>Nivel de Estudios</FormLabel><FormControl><Input placeholder="Ej: Bachiller, Universitario" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                        </Card>
                        
                        <Card className="shadow-lg bg-card">
                             <CardHeader>
                                <CardTitle>Información de Contacto y Familia</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormField control={form.control} name="celular" render={({ field }) => (
                                    <FormItem><FormLabel>Celular</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="celular_padre" render={({ field }) => (
                                    <FormItem><FormLabel>Celular del Padre/Tutor</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="telefono_referencia" render={({ field }) => (
                                    <FormItem><FormLabel>Teléfono de Referencia</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="direccion" render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>Dirección</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                               <FormField control={form.control} name="email_alumno" render={({ field }) => (
                                    <FormItem><FormLabel>Email del Alumno</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="email_tutor" render={({ field }) => (
                                    <FormItem><FormLabel>Email del Padre/Tutor</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="nombre_padre_tutor" render={({ field }) => (
                                    <FormItem><FormLabel>Nombre del Padre/Tutor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg bg-card">
                             <CardHeader>
                                <CardTitle>Detalles de la Inscripción</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <FormField control={form.control} name="turno" render={({ field }) => (
                                    <FormItem><FormLabel>Turno</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Mañana">Mañana</SelectItem><SelectItem value="Tarde">Tarde</SelectItem><SelectItem value="Noche">Noche</SelectItem></SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="nivel" render={({ field }) => (
                                    <FormItem><FormLabel>Nivel</FormLabel><FormControl><Input placeholder="Ej: 3.0" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="curso" render={({ field }) => (
                                    <FormItem><FormLabel>Curso</FormLabel><FormControl><Input placeholder="Ej: Julio - 16.06.25" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="promocion" render={({ field }) => (
                                    <FormItem><FormLabel>¿Promoción?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Sí">Sí</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="monto" render={({ field }) => (
                                    <FormItem><FormLabel>Monto</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="sucursal" render={({ field }) => (
                                    <FormItem><FormLabel>Sucursal</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger></FormControl>
                                    <SelectContent><SelectItem value="Zona Sur">Zona Sur</SelectItem><SelectItem value="Central">Central</SelectItem><SelectItem value="El Alto">El Alto</SelectItem></SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="medio_entero" render={({ field }) => (
                                    <FormItem className="md:col-span-2"><FormLabel>¿Cómo se enteró?</FormLabel><FormControl><Input placeholder="Ej: Redes sociales, recomendación" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="comentarios" render={({ field }) => (
                                    <FormItem className="md:col-span-full"><FormLabel>Comentarios</FormLabel><FormControl><Textarea placeholder="Añade cualquier comentario adicional aquí..." {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                        </Card>
                        
                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" className="font-semibold">
                                <Save className="mr-2 h-5 w-5" />
                                Registrar Inscripción
                            </Button>
                        </div>
                    </form>
                </Form>
            </main>
            <footer className="py-8 border-t mt-16 bg-card">
                <div className="container text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} First Class Institute. Inscripción de Alumnos.
                </div>
            </footer>
        </div>
    );
}
