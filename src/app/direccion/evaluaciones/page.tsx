
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft, GraduationCap, Search, Printer, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { WorkAssessmentCard, type WorkAssessmentData } from '@/components/assessment/WorkAssessmentCard';
import { Separator } from '@/components/ui/separator';

const assessmentData1: WorkAssessmentData = {
  tipo_documento: "Work Assessment",
  facilitador: "ROGER URRUTIA",
  codigo: "9006",
  horario: "16:15",
  estudiante: {
    apellidos: "TERAN BORDA",
    nombres: "DAYLIN ARLEN",
    nivel_actual: "EF 4B",
    nivel_recomendado: "EF 5A"
  },
  fecha_finalizacion: "2024-07-26",
  evaluacion: {
    criterios: [
      { nombre: "Attendance", porcentaje: 10, notas: [9, 8.5] },
      { nombre: "Participation", porcentaje: 35, notas: [30, 29, 29.5] },
      { nombre: "Oral Evaluation", porcentaje: 20, notas: [17, 8, 17, 17] },
      { nombre: "Written Evaluation", porcentaje: 25, notas: [21, 22.5, 7, 22] },
      { nombre: "Practices", porcentaje: 10, notas: [8, 8.5] },
    ],
    puntaje_total: 84,
    examen_medio: 85,
    examen_final: 85,
    promedio: 84.5
  },
  estado: { aprobado: true, reprobado: false },
  comentarios: "Excelente progreso durante el curso. Daylin muestra gran interés y habilidad para el idioma. Se recomienda continuar al siguiente nivel para seguir desarrollando su fluidez y precisión gramatical."
};


const assessmentData2: WorkAssessmentData = {
  tipo_documento: "Work Assessment",
  facilitador: "LAURA MARTINEZ",
  codigo: "8887",
  horario: "08:30",
  estudiante: {
    apellidos: "SALAZAR PARDO",
    nombres: "JUAN VICTOR",
    nivel_actual: "EF 2A",
    nivel_recomendado: "EF 2B"
  },
  fecha_finalizacion: "2024-07-25",
  evaluacion: {
    criterios: [
      { nombre: "Attendance", porcentaje: 10, notas: [7, 8] },
      { nombre: "Participation", porcentaje: 35, notas: [25, 28, 27] },
      { nombre: "Oral Evaluation", porcentaje: 20, notas: [15, 16, 15] },
      { nombre: "Written Evaluation", porcentaje: 25, notas: [18, 19, 20] },
      { nombre: "Practices", porcentaje: 10, notas: [7, 7.5] },
    ],
    puntaje_total: 78,
    examen_medio: 75,
    examen_final: 80,
    promedio: 77.5
  },
  estado: { aprobado: true, reprobado: false },
  comentarios: "Juan Victor ha mejorado su confianza al hablar. Necesita reforzar la estructura de las oraciones en pasado simple. Con práctica continua, alcanzará los objetivos del siguiente nivel."
};

const allAssessments = [assessmentData1, assessmentData2];

export default function DireccionEvaluacionesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredAssessments, setFilteredAssessments] = useState(allAssessments);

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredAssessments(allAssessments);
            return;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        const results = allAssessments.filter(assessment => 
            `${assessment.estudiante.nombres} ${assessment.estudiante.apellidos}`.toLowerCase().includes(lowercasedTerm) ||
            assessment.codigo.includes(lowercasedTerm)
        );
        setFilteredAssessments(results);
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
          <GraduationCap className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Supervisión de Evaluaciones
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Busca y visualiza las evaluaciones de desempeño y las calificaciones de todos los estudiantes del instituto.
          </p>
        </div>

        <Card className="shadow-lg bg-card mb-8">
          <CardHeader>
            <CardTitle>Buscar Evaluación de Estudiante</CardTitle>
            <CardDescription>Busca por nombre, apellido o código del estudiante.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input 
                id="student-search" 
                placeholder="Ingresa nombre o código..." 
                className="max-w-xs bg-background" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4"/>Buscar</Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
            {filteredAssessments.length > 0 ? (
                filteredAssessments.map((data, index) => (
                    <Card key={index} className="shadow-lg bg-card">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className='text-xl'>
                                    {data.estudiante.nombres} {data.estudiante.apellidos} - <span className='text-primary'>{data.estudiante.nivel_actual}</span>
                                </CardTitle>
                                <CardDescription>Facilitador: {data.facilitador} - Finalización: {data.fecha_finalizacion}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" disabled>
                                    <Printer className="mr-2 h-4 w-4"/>
                                    Imprimir
                                </Button>
                                <Button disabled>
                                    <Download className="mr-2 h-4 w-4"/>
                                    Descargar PDF
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <WorkAssessmentCard data={data} />
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card className="shadow-lg bg-card">
                    <CardContent className="p-10 text-center">
                        <p className="text-xl font-semibold text-muted-foreground">No se encontraron evaluaciones.</p>
                        <p className="text-sm text-muted-foreground">Intenta con otro término de búsqueda o verifica que haya evaluaciones registradas.</p>
                    </CardContent>
                </Card>
            )}
             <p className="text-xs text-muted-foreground mt-4 pt-3 text-center">
                (Los datos mostrados son de ejemplo. La funcionalidad de búsqueda e impresión está en desarrollo.)
            </p>
        </div>


      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Supervisión de Evaluaciones.
        </div>
      </footer>
    </div>
  );
}
