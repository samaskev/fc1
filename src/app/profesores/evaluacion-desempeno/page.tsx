
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, GraduationCap, Save, Calculator } from 'lucide-react';
import { WorkAssessmentCard, type WorkAssessmentData, type Criterio } from '@/components/assessment/WorkAssessmentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const initialAssessmentData: WorkAssessmentData = {
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
  fecha_finalizacion: new Date().toISOString().split('T')[0], // "2024-07-26"
  evaluacion: {
    criterios: [
      { nombre: "Attendance", porcentaje: 10, notas: [] },
      { nombre: "Participation", porcentaje: 35, notas: [] },
      { nombre: "Oral Evaluation", porcentaje: 20, notas: [] },
      { nombre: "Written Evaluation", porcentaje: 25, notas: [] },
      { nombre: "Practices", porcentaje: 10, notas: [] },
    ],
    puntaje_total: 0,
    examen_medio: 0,
    examen_final: 0,
    promedio: 0,
  },
  estado: { aprobado: false, reprobado: true },
  comentarios: ""
};

export default function EvaluacionDesempenoPage() {
    const [assessment, setAssessment] = useState<WorkAssessmentData>(initialAssessmentData);
    const { toast } = useToast();
    
    const cursosPlaceholder = [
        { id: "c1", nombre: "Inglés Intermedio B1 - Tarde (Roger Urrutia)" },
        { id: "c2", nombre: "Inglés Básico A1 - Mañana (Laura Martinez)" },
    ];
    
    const alumnosPlaceholder = [
        { id: "s1", nombre: "TERAN BORDA, DAYLIN ARLEN", cursoId: "c1" },
        { id: "s2", nombre: "SALAZAR PARDO, JUAN VICTOR", cursoId: "c2" },
    ];

    const handleNotesChange = (criterioIndex: number, notesString: string) => {
        const notes = notesString.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        
        setAssessment(prev => {
            const newCriterios = [...prev.evaluacion.criterios];
            newCriterios[criterioIndex].notas = notes;
            return {
                ...prev,
                evaluacion: {
                    ...prev.evaluacion,
                    criterios: newCriterios
                }
            };
        });
    };
    
    const calculateTotals = () => {
         let totalScore = 0;
         assessment.evaluacion.criterios.forEach(c => {
             const sum = c.notas.reduce((a, b) => a + b, 0);
             totalScore += sum;
         });
         
         const midTerm = assessment.evaluacion.examen_medio || 0;
         const finalTerm = assessment.evaluacion.examen_final || 0;
         const average = (totalScore + midTerm + finalTerm) / (assessment.evaluacion.criterios.length + (midTerm > 0 ? 1 : 0) + (finalTerm > 0 ? 1 : 0));
         const finalAverage = (totalScore + midTerm + finalTerm) / 3;

         setAssessment(prev => ({
             ...prev,
             evaluacion: {
                ...prev.evaluacion,
                puntaje_total: parseFloat(totalScore.toFixed(2)),
                promedio: parseFloat(finalAverage.toFixed(2)),
             },
             estado: {
                 aprobado: finalAverage >= 51,
                 reprobado: finalAverage < 51,
             }
         }));

        toast({
            title: "Cálculo Realizado",
            description: `Puntaje total actualizado a ${totalScore.toFixed(2)} y promedio a ${finalAverage.toFixed(2)}.`,
        });
    }

    const handleSave = () => {
        console.log("Guardando Evaluación:", assessment);
        toast({
            title: "Calificaciones Guardadas",
            description: "Las notas para el estudiante han sido guardadas exitosamente.",
        });
    }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
            <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                <Link href="/profesores/calificaciones">
                <ChevronLeft className="mr-2 h-4 w-4"/>
                Volver a Calificaciones
                </Link>
            </Button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle>Registrar Calificaciones</CardTitle>
                        <CardDescription>Selecciona el curso y el estudiante para ingresar sus notas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label>Curso</Label>
                            <Select><SelectTrigger><SelectValue placeholder="Selecciona un curso..." /></SelectTrigger>
                                <SelectContent>{cursosPlaceholder.map(c => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Estudiante</Label>
                             <Select><SelectTrigger><SelectValue placeholder="Selecciona un estudiante..." /></SelectTrigger>
                                <SelectContent>{alumnosPlaceholder.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-muted-foreground pt-2 border-t">La selección de estudiante cargará sus datos y la plantilla de evaluación.</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg bg-card">
                    <CardHeader>
                        <CardTitle>Formulario de Notas</CardTitle>
                        <CardDescription>Ingresa las notas para cada criterio. Separa múltiples notas con comas.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {assessment.evaluacion.criterios.map((criterio, index) => (
                            <div key={index} className="grid grid-cols-[1fr_80px_1fr] items-center gap-2">
                                <Label htmlFor={`criterio-${index}`}>{criterio.nombre}</Label>
                                <Input id={`porcentaje-${index}`} value={`${criterio.porcentaje}%`} readOnly className="text-center bg-secondary/30" />
                                <Input 
                                    id={`criterio-${index}`} 
                                    placeholder="Ej: 8, 9.5, 7" 
                                    value={criterio.notas.join(', ')}
                                    onChange={(e) => handleNotesChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                             <div>
                                <Label htmlFor="examen-medio">Examen Medio</Label>
                                <Input 
                                    id="examen-medio" 
                                    type="number"
                                    value={assessment.evaluacion.examen_medio}
                                    onChange={(e) => setAssessment(prev => ({...prev, evaluacion: {...prev.evaluacion, examen_medio: parseFloat(e.target.value) || 0}}))}
                                />
                            </div>
                             <div>
                                <Label htmlFor="examen-final">Examen Final</Label>
                                <Input 
                                    id="examen-final" 
                                    type="number"
                                    value={assessment.evaluacion.examen_final}
                                    onChange={(e) => setAssessment(prev => ({...prev, evaluacion: {...prev.evaluacion, examen_final: parseFloat(e.target.value) || 0}}))}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="comentarios">Comentarios Adicionales</Label>
                            <Textarea 
                                id="comentarios"
                                placeholder="Añade comentarios sobre el desempeño del estudiante..."
                                value={assessment.comentarios}
                                onChange={(e) => setAssessment(prev => ({...prev, comentarios: e.target.value}))}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-4 border-t">
                            <Button onClick={calculateTotals} variant="outline" className="flex-1">
                                <Calculator className="mr-2 h-4 w-4"/>Calcular Totales
                            </Button>
                            <Button onClick={handleSave} className="flex-1">
                                <Save className="mr-2 h-4 w-4"/>Guardar Calificaciones
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="sticky top-24">
                <Card className="shadow-xl bg-card">
                    <CardHeader>
                        <CardTitle>Vista Previa del Boletín</CardTitle>
                        <CardDescription>Así se verá la evaluación del estudiante.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WorkAssessmentCard data={assessment}/>
                    </CardContent>
                </Card>
            </div>

        </div>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Registro de Evaluaciones.
        </div>
      </footer>
    </div>
  );
}
