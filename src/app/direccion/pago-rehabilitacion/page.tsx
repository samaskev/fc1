
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronLeft, PiggyBank, Search, ShieldCheck, CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AlumnoCongelado {
    id: string;
    nombre: string;
    cursoCongelado: string;
    fechaCongelacion: string;
    deuda: number;
}

const initialFrozenStudents: AlumnoCongelado[] = [
    { id: "a2", nombre: "Sofía Moreno Jiménez", cursoCongelado: "Inglés Básico A1 (2024-I)", fechaCongelacion: "2024-05-15", deuda: 1000 },
    { id: "a5", nombre: "Ricardo Vega Soliz", cursoCongelado: "Inglés Intermedio B2 (2023-II)", fechaCongelacion: "2023-11-20", deuda: 1500 },
];

export default function PagoRehabilitacionPage() {
    const { toast } = useToast();
    const [selectedStudent, setSelectedStudent] = useState<AlumnoCongelado | null>(null);
    const [fechaRehabilitacion, setFechaRehabilitacion] = useState<Date>();
    const [fechaRetorno, setFechaRetorno] = useState<Date>();

    const handleRehabilitate = () => {
        // Logic to save the rehabilitation would go here
        toast({
            title: "Cuenta Rehabilitada (Simulación)",
            description: `La cuenta de ${selectedStudent?.nombre} ha sido marcada para rehabilitación.`
        });
        // Close dialog logic would be here
    }

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
                    <PiggyBank className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
                        Pago de Rehabilitación
                    </h1>
                    <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
                        Gestiona la reactivación de cuentas de estudiantes congeladas y registra los pagos correspondientes.
                    </p>
                </div>

                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle>Cuentas Congeladas</CardTitle>
                        <CardDescription>Lista de estudiantes con cuentas congeladas que son candidatos para rehabilitación.</CardDescription>
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
                                        <TableHead>Curso Congelado</TableHead>
                                        <TableHead>Fecha Congelación</TableHead>
                                        <TableHead>Deuda Pendiente</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {initialFrozenStudents.map(student => (
                                        <TableRow key={student.id} className="hover:bg-secondary/50">
                                            <TableCell className="font-medium">{student.nombre}</TableCell>
                                            <TableCell className="text-muted-foreground">{student.cursoCongelado}</TableCell>
                                            <TableCell className="text-muted-foreground">{student.fechaCongelacion}</TableCell>
                                            <TableCell className="text-destructive font-semibold">Bs {student.deuda.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="default" size="sm" onClick={() => setSelectedStudent(student)}>
                                                            <ShieldCheck className="mr-2 h-4 w-4"/>
                                                            Rehabilitar Cuenta
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md bg-card">
                                                        <DialogHeader>
                                                            <DialogTitle>Rehabilitar a: {selectedStudent?.nombre}</DialogTitle>
                                                            <DialogDescription>
                                                                Completa los campos para registrar el pago y la reactivación del estudiante.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4 space-y-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor='rehab-date'>Fecha de Rehabilitación</Label>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaRehabilitacion && "text-muted-foreground")}>
                                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            {fechaRehabilitacion ? format(fechaRehabilitacion, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fechaRehabilitacion} onSelect={setFechaRehabilitacion} initialFocus /></PopoverContent>
                                                                </Popover>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor='monto-deuda'>Monto a Pagar (Deuda Pendiente: Bs {selectedStudent?.deuda.toFixed(2)})</Label>
                                                                <Input id='monto-deuda' type="number" placeholder={selectedStudent?.deuda.toFixed(2)} />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor='return-date'>Fecha de Retorno a Clases</Label>
                                                                 <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !fechaRetorno && "text-muted-foreground")}>
                                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            {fechaRetorno ? format(fechaRetorno, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fechaRetorno} onSelect={setFechaRetorno} initialFocus /></PopoverContent>
                                                                </Popover>
                                                            </div>
                                                             <div className="space-y-2">
                                                                <Label htmlFor='new-course'>Nuevo Curso Asignado</Label>
                                                                <Input id='new-course' placeholder="Ej: Inglés Intermedio B2 (2024-II)" />
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="button" variant="outline" onClick={() => document.querySelector('[aria-label="Close"]')?.click()}>Cancelar</Button>
                                                            <Button type="submit" onClick={handleRehabilitate}>Confirmar Rehabilitación</Button>
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
                          (La búsqueda y rehabilitación de cuentas son funcionalidades en desarrollo. Los datos son de ejemplo.)
                        </p>
                    </CardContent>
                </Card>

            </main>
            <footer className="py-8 border-t mt-16 bg-card">
                <div className="container text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} First Class Institute. Gestión de Rehabilitaciones.
                </div>
            </footer>
        </div>
    );
}

