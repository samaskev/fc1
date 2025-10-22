
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft, Clock, Save, PlusCircle } from 'lucide-react';
import { SaturdayClassReportCard, type SaturdayClassReportData } from '@/components/reports/SaturdayClassReportCard';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const reportData: SaturdayClassReportData = {
  tipo_documento: "Saturday Class Report",
  facilitador: "Roger Urrutia",
  nivel: "EF 5A",
  horario: "09:00 - 12:00",
  mes: "September",
  gestion: "2024",
  estructura_semanal: [
    { semana: 1, fecha: "2024-09-07", tema: "Review Unit 1-3", paginas: "15-20" },
    { semana: 2, fecha: "2024-09-14", tema: "Present Perfect", paginas: "21-25" },
    { semana: 3, fecha: "2024-09-21", tema: "Mid-Term Exam", paginas: "N/A" },
    { semana: 4, fecha: "2024-09-28", tema: "Passive Voice", paginas: "26-30" },
  ],
  observaciones: "",
  total_horas_mes: 12
};

interface ActividadDiaria {
    fecha: Date;
    actividad: string;
    horas: number;
}

export default function ProfesorRegistroHorasSabadoPage() {
    const { toast } = useToast();
    const [observaciones, setObservaciones] = useState('');
    
    // State for the new daily activity form
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [fechaActividad, setFechaActividad] = useState<Date | undefined>(new Date());
    const [descripcionActividad, setDescripcionActividad] = useState('');
    const [horasActividad, setHorasActividad] = useState<number | ''>('');
    const [actividadesRegistradas, setActividadesRegistradas] = useState<ActividadDiaria[]>([]);

    const handleSave = () => {
        console.log("Guardando registro de horas (sábados) con observaciones:", observaciones);
        toast({
            title: "Registro de Horas (Sábados) Guardado",
            description: "Tu informe de horas sabatinas ha sido enviado para revisión.",
        });
    };
    
    const handleSaveActividad = () => {
        if (!fechaActividad || !descripcionActividad || horasActividad === '' || horasActividad <= 0) {
            toast({
                title: "Error de Validación",
                description: "Por favor, completa todos los campos del formulario.",
                variant: "destructive",
            });
            return;
        }

        const nuevaActividad: ActividadDiaria = {
            fecha: fechaActividad,
            actividad: descripcionActividad,
            horas: horasActividad,
        };
        
        setActividadesRegistradas(prev => [...prev, nuevaActividad].sort((a,b) => b.fecha.getTime() - a.fecha.getTime()));
        console.log("Nueva actividad guardada:", nuevaActividad);
        toast({
            title: "Actividad Registrada",
            description: `Se guardó la actividad para el ${format(fechaActividad, "PPP", { locale: es })}.`
        });

        // Reset form and close dialog
        setFechaActividad(new Date());
        setDescripcionActividad('');
        setHorasActividad('');
        setIsDialogOpen(false);
    };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
            <Link href="/profesores">
              <ChevronLeft className="mr-2 h-4 w-4"/>
              Volver al Portal de Profesor
            </Link>
          </Button>
        </div>

        <div className="relative text-center mb-12 p-6 md:p-8 bg-card rounded-xl shadow-xl overflow-hidden border border-border">
          <div className="absolute inset-0 opacity-[0.03] pattern-[0.8rem_0.8rem_#000000_radial-gradient(circle_at_center,_var(--tw-gradient-stops))] dark:opacity-[0.05] dark:pattern-[0.8rem_0.8rem_#ffffff_radial-gradient(circle_at_center,_var(--tw-gradient-stops))]"></div>
          <Clock className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Registro de Horas (Sábados)
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Registra tus actividades y envía tu informe de horas para las clases de los sábados.
          </p>
        </div>

        <Card className="shadow-lg bg-card max-w-4xl mx-auto mb-8">
            <CardHeader className="flex-row justify-between items-center">
                <div>
                    <CardTitle>Registro de Actividad Diaria</CardTitle>
                    <CardDescription>Añade un nuevo registro por cada sábado trabajado.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><PlusCircle className="mr-2 h-5 w-5"/>Registrar Actividad</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-card">
                        <DialogHeader>
                            <DialogTitle>Registrar Nueva Actividad Sabatina</DialogTitle>
                            <DialogDescription>
                                Selecciona la fecha y describe la actividad y horas trabajadas.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Fecha</Label>
                                <Calendar 
                                    mode="single"
                                    selected={fechaActividad}
                                    onSelect={setFechaActividad}
                                    className="rounded-md border bg-background"
                                    disabled={(date) => date > new Date()}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="actividad">Actividad Realizada</Label>
                                <Textarea 
                                    id="actividad"
                                    placeholder="Ej: Taller de conversación, clase de refuerzo..."
                                    value={descripcionActividad}
                                    onChange={(e) => setDescripcionActividad(e.target.value)}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="horas">Horas Trabajadas</Label>
                                <Input 
                                    id="horas"
                                    type="number"
                                    placeholder="Ej: 3"
                                    value={horasActividad}
                                    onChange={(e) => setHorasActividad(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button type="submit" onClick={handleSaveActividad}>Guardar Actividad</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {actividadesRegistradas.length > 0 ? (
                     <div className="overflow-x-auto border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Actividad</TableHead>
                                    <TableHead className="text-right">Horas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {actividadesRegistradas.map((act, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{format(act.fecha, "PPP", { locale: es })}</TableCell>
                                        <TableCell className="text-muted-foreground">{act.actividad}</TableCell>
                                        <TableCell className="text-right font-bold text-primary">{act.horas}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-6 border border-dashed rounded-md">
                        <p className="text-muted-foreground">Aún no has registrado actividades sabatinas.</p>
                        <p className="text-sm text-muted-foreground">Usa el botón "Registrar Actividad" para empezar.</p>
                    </div>
                )}
            </CardContent>
        </Card>
        
        <Card className="shadow-lg bg-card max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Informe Planificado de Clases de Sábado - {reportData.mes}</CardTitle>
                <CardDescription>Este es un resumen de tu planificación y horas para el mes actual.</CardDescription>
            </CardHeader>
            <CardContent>
                <SaturdayClassReportCard data={reportData} />

                <div className="mt-6">
                    <Label htmlFor="observaciones" className="font-semibold">Observaciones Generales del Informe</Label>
                    <Textarea 
                        id="observaciones"
                        placeholder="Añade aquí cualquier comentario relevante sobre el informe mensual..."
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        className="mt-2"
                        rows={4}
                    />
                </div>
            </CardContent>
            <CardFooter>
                 <Button size="lg" onClick={handleSave}>
                    <Save className="mr-2 h-5 w-5" />
                    Guardar y Enviar Informe Mensual
                </Button>
            </CardFooter>
        </Card>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Registro de Horas (Sábados).
        </div>
      </footer>
    </div>
  );
}
