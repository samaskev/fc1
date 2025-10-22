
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft, Clock, Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { WeekdayClassReportCard, type WeekdayClassReportData } from '@/components/reports/WeekdayClassReportCard';


const reportData1: WeekdayClassReportData = {
  tipo_documento: "Weekday Class Report",
  facilitador: "Pamela Altamirano Pozo",
  nivel: "EF 1A",
  modalidad: "Accelerated",
  horario: "20:45–22:00",
  fecha_inicio: "2024-08-25",
  fecha_fin: "2024-10-22",
  mes: "September",
  estructura_semanal: {
    lunes: [ { tema: "Verbs", pagina: 1 }, { tema: "Time", pagina: 6 }, { pagina: 11 }, { pagina: 16 }, { pagina: 21 }, { pagina: 26 } ],
    martes: [ { tema: "School Stuff", pagina: 2 }, { tema: "Days & Months", pagina: 7 }, { pagina: 12 }, { pagina: 17 }, { pagina: 22 }, { pagina: 27 } ],
    miércoles: [ { tema: "Subject Pronouns", pagina: 3 }, { tema: "The Weather", pagina: 8 }, { pagina: 13 }, { pagina: 18 }, { pagina: 23 }, { pagina: 28 } ],
    jueves: [ { tema: "Clothes and Accessories", pagina: 4 }, { tema: "Computers and More", pagina: 9 }, { pagina: 14 }, { pagina: 19 }, { pagina: 24 }, { pagina: 29 } ],
    viernes: [ { tema: "The Sentence", pagina: 5 }, { tema: "Definite & Indefinite Articles", pagina: 10 }, { pagina: 15 }, { pagina: 20 }, { pagina: 25 }, { pagina: 30 } ]
  },
  observaciones: "Los estudiantes del nivel 1A están progresando adecuadamente, aunque algunos necesitan más práctica con los artículos definidos e indefinidos.",
  registro_horas: { lunes: "1.25", martes: "1.25", miércoles: "1.25", jueves: "1.25", viernes: "1.25" }
};

const reportData2: WeekdayClassReportData = {
  tipo_documento: "Weekday Class Report",
  facilitador: "Roger Urrutia",
  nivel: "EF 4B",
  modalidad: "Regular",
  horario: "16:15–17:30",
  fecha_inicio: "2024-08-26",
  fecha_fin: "2024-10-23",
  mes: "September",
  estructura_semanal: {
    lunes: [ { tema: "Past Tense", pagina: 45 }, { pagina: 50 } ],
    martes: [ { tema: "Future Tense", pagina: 46 }, { pagina: 51 } ],
    miércoles: [ { tema: "Conditionals", pagina: 47 }, { pagina: 52 } ],
    jueves: [ { tema: "Review", pagina: 48 }, { pagina: 53 } ],
    viernes: [ { tema: "Practice", pagina: 49 }, { pagina: 54 } ]
  },
  observaciones: "No se han registrado observaciones para este mes.",
  registro_horas: { lunes: "1.25", martes: "1.25", miércoles: "1.25", jueves: "1.25", viernes: "1.25" }
};

const reportsPlaceholder = [
  { id: "r1", facilitador: "Pamela Altamirano Pozo", nivel: "EF 1A", mes: "September", estado: "Enviado", fechaEnvio: "2024-10-01", data: reportData1 },
  { id: "r2", facilitador: "Roger Urrutia", nivel: "EF 4B", mes: "September", estado: "Pendiente", fechaEnvio: "", data: reportData2 },
  { id: "r3", facilitador: "Laura Martinez", nivel: "EF 2A", mes: "August", estado: "Aprobado", fechaEnvio: "2024-09-02", data: reportData1 }, // Example data
];


export default function DireccionHorasProfesoresPage() {

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
          <Clock className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Supervisión de Horas de Profesores
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Visualiza, filtra y aprueba los informes de horas de clase registrados por el personal docente.
          </p>
        </div>

        <Card className="shadow-lg bg-card">
          <CardHeader>
            <CardTitle>Lista de Informes de Horas</CardTitle>
            <CardDescription>Busca por profesor o filtra por mes y estado para revisar los informes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-6">
                <Input placeholder="Buscar por nombre del profesor..." className="max-w-xs bg-background" />
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por mes..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="september">Septiembre</SelectItem>
                        <SelectItem value="august">Agosto</SelectItem>
                        <SelectItem value="july">Julio</SelectItem>
                    </SelectContent>
                </Select>
                 <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por estado..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="enviado">Enviado</SelectItem>
                        <SelectItem value="aprobado">Aprobado</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                    </SelectContent>
                </Select>
                <Button><Search className="mr-2 h-4 w-4"/>Buscar</Button>
            </div>
            
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Facilitador</TableHead>
                    <TableHead>Nivel del Curso</TableHead>
                    <TableHead>Mes</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Envío</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportsPlaceholder.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.facilitador}</TableCell>
                      <TableCell>{report.nivel}</TableCell>
                      <TableCell>{report.mes}</TableCell>
                      <TableCell>{report.estado}</TableCell>
                      <TableCell>{report.fechaEnvio || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Informe
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-card">
                                <DialogHeader>
                                    <DialogTitle>Informe de {report.facilitador} - {report.mes}</DialogTitle>
                                    <DialogDescription>
                                        Resumen de actividades y horas registradas para el curso {report.nivel}.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4 max-h-[70vh] overflow-y-auto">
                                   <WeekdayClassReportCard data={report.data} />
                                </div>
                            </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-dashed">
              (La búsqueda y filtrado están en desarrollo. Los datos son de ejemplo.)
            </p>
          </CardContent>
        </Card>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Supervisión de Horas.
        </div>
      </footer>
    </div>
  );
}

