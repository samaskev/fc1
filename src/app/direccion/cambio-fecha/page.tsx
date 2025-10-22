
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { ChevronLeft, CalendarClock, Search, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Alumno {
    id: string;
    nombre: string;
    curso: string;
    fechaInicio: string;
    fechaFin: string;
}

const alumnosPlaceholder: Alumno[] = [
    { id: "a1", nombre: "Javier Sánchez Gómez", curso: "Inglés Intermedio B1", fechaInicio: "2024-08-01", fechaFin: "2024-12-15" },
    { id: "a2", nombre: "Sofía Moreno Jiménez", curso: "Inglés Básico A1", fechaInicio: "2024-08-01", fechaFin: "2024-12-15" },
    { id: "a3", nombre: "Miguel Ángel Díaz", curso: "Preparación TOEFL", fechaInicio: "2024-09-01", fechaFin: "2024-11-30" },
];

export default function CambioFechaPage() {
    const { toast } = useToast();
    const [selectedStudent, setSelectedStudent] = useState<Alumno | null>(null);
    const [fechaInicio, setFechaInicio] = useState<Date | undefined>();
    const [fechaFin, setFechaFin] = useState<Date | undefined>();

    const handleOpenDialog = (student: Alumno) => {
        setSelectedStudent(student);
        setFechaInicio(new Date(student.fechaInicio));
        setFechaFin(new Date(student.fechaFin));
    };
    
    const handleSaveChanges = () => {
        if (!selectedStudent || !fechaInicio || !fechaFin) return;

        console.log("Guardando cambios para:", selectedStudent.nombre);
        console.log("Nueva Fecha Inicio:", fechaInicio);
        console.log("Nueva Fecha Fin:", fechaFin);

        toast({
            title: "Fechas Actualizadas (Simulación)",
            description: `Las fechas para ${selectedStudent.nombre} han sido modificadas.`,
        });
        
        // Aquí se cerraría el diálogo en una implementación real
    };

    return (
        <div className="flex flex-col min-h-screen bg-secondary/20">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-8">
                    <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                        <Link href="/direccion">
                            <ChevronLeft className="mr-2 h-4 w-4"/>
                            Volver al Portal de Dirección
                        </Link>
                    </Button>
                </div>

                <div className="relative text-center mb-12 p-6 md:p-8 bg-card rounded-xl shadow-xl overflow-hidden border border-border">
                    <div className="absolute inset-0 opacity-[0.03] pattern-[0.8rem_0.8rem_#000000_radial-gradient(circle_at_center,_var(--tw-gradient-stops))] dark:opacity-[0.05] dark:pattern-[0.8rem_0.8rem_#ffffff_radial-gradient(circle_at_center,_var(--tw-gradient-stops))]"></div>
                    <CalendarClock className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
                        Cambio de Fechas de Cursos
                    </h1>
                    <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
                        Busca a un estudiante y ajusta las fechas de inicio o fin de su curso por motivos excepcionales.
                    </p>
                </div>

                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle>Lista de Estudiantes</CardTitle>
                        <CardDescription>Busca un estudiante y asigna las nuevas fechas para su curso.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-6">
                            <Input placeholder="Buscar por nombre o CI del estudiante..." className="max-w-sm bg-background" />
                            <Button><Search className="mr-2 h-4 w-4"/>Buscar</Button>
                        </div>
                        
                        <div className="overflow-x-auto border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre del Alumno</TableHead>
                                        <TableHead>Curso Actual</TableHead>
                                        <TableHead>Fecha Inicio</TableHead>
                                        <TableHead>Fecha Fin</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {alumnosPlaceholder.map(student => (
                                        <TableRow key={student.id} className="hover:bg-secondary/50">
                                            <TableCell className="font-medium">{student.nombre}</TableCell>
                                            <TableCell className="text-muted-foreground">{student.curso}</TableCell>
                                            <TableCell className="text-muted-foreground">{student.fechaInicio}</TableCell>
                                            <TableCell className="text-muted-foreground">{student.fechaFin}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog(student)}>
                                                            <Edit className="mr-2 h-4 w-4"/>
                                                            Asignar Fechas
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-xl bg-card">
                                                        <DialogHeader>
                                                            <DialogTitle>Cambiar Fechas para {selectedStudent?.nombre}</DialogTitle>
                                                            <DialogDescription>
                                                                Selecciona las nuevas fechas de inicio y fin para el curso.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Fecha de Inicio</Label>
                                                                <Calendar 
                                                                    mode="single"
                                                                    selected={fechaInicio}
                                                                    onSelect={setFechaInicio}
                                                                    className="rounded-md border bg-background"
                                                                />
                                                            </div>
                                                             <div className="space-y-2">
                                                                <Label>Fecha de Fin</Label>
                                                                <Calendar 
                                                                    mode="single"
                                                                    selected={fechaFin}
                                                                    onSelect={setFechaFin}
                                                                    className="rounded-md border bg-background"
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="button" variant="outline" onClick={() => document.querySelector('[aria-label="Close"]')?.click()}>Cancelar</Button>
                                                            <Button type="submit" onClick={handleSaveChanges}>Guardar Cambios</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                         <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-dashed">
                          (La búsqueda y guardado de fechas son funcionalidades en desarrollo. Los datos son de ejemplo.)
                        </p>
                    </CardContent>
                </Card>

            </main>
            <footer className="py-8 border-t mt-16 bg-card">
                <div className="container text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} First Class Institute. Gestión de Fechas.
                </div>
            </footer>
        </div>
    );
}
