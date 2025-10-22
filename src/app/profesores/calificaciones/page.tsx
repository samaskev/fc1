
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { ChevronLeft, ClipboardCheck, TrendingUp, MessageCircle, FileEdit, FileText, GraduationCap } from 'lucide-react';

export default function ProfesorCalificacionesPage() {
  const cursosPlaceholder = [
    { id: "c1", nombre: "Inglés Básico A1 - Mañana" },
    { id: "c2", nombre: "Inglés Intermedio B1 - Tarde" },
    { id: "c3", nombre: "Taller de Conversación - Sábados" },
  ];

  const alumnosPlaceholder = [
    { id: "s1", nombre: "Ana García Pérez", cursoId: "c1", calificacionPromedio: 85, ultimoFeedback: "Buen progreso en vocabulario." },
    { id: "s2", nombre: "Carlos López Martín", cursoId: "c1", calificacionPromedio: 92, ultimoFeedback: "Participa activamente." },
    { id: "s3", nombre: "Laura Fernández Ruiz", cursoId: "c2", calificacionPromedio: 78, ultimoFeedback: "Necesita practicar más los verbos." },
    { id: "s4", nombre: "Javier Sánchez Gómez", cursoId: "c2", calificacionPromedio: 88, ultimoFeedback: "Excelente en los ejercicios escritos." },
  ];


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
          <ClipboardCheck className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Gestión de Calificaciones y Feedback
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Supervisa el rendimiento de tus alumnos, registra calificaciones y proporciona comentarios constructivos.
          </p>
        </div>
        
        <Card className="shadow-lg bg-card mb-8">
          <CardHeader className="flex flex-row flex-wrap justify-between items-center gap-4">
            <div>
                <CardTitle className="flex items-center text-xl font-headline">
                <FileEdit className="mr-2 h-6 w-6 text-accent" />
                Seleccionar Curso
                </CardTitle>
                <CardDescription>Elige el curso para ver las calificaciones de los alumnos.</CardDescription>
            </div>
            <div className='flex gap-2 flex-wrap'>
                <Button asChild variant="outline">
                    <Link href="/profesores/boletin-notas">
                        <FileText className="mr-2 h-4 w-4"/>
                        Ver Boletín
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/profesores/evaluacion-desempeno">
                        <GraduationCap className="mr-2 h-4 w-4"/>
                        Registrar Notas
                    </Link>
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Select>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Selecciona un curso..." />
              </SelectTrigger>
              <SelectContent>
                {cursosPlaceholder.map(curso => (
                  <SelectItem key={curso.id} value={curso.id}>{curso.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-3">(Funcionalidad de filtrado de alumnos por curso en desarrollo)</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline">
               <TrendingUp className="mr-2 h-6 w-6 text-accent" />
              Resumen de Calificaciones
            </CardTitle>
            <CardDescription>Vista general del rendimiento de los alumnos en el curso seleccionado.</CardDescription>
          </CardHeader>
          <CardContent>
            {alumnosPlaceholder.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alumno</TableHead>
                      <TableHead className="text-center">Calificación Promedio</TableHead>
                      <TableHead>Último Feedback General</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alumnosPlaceholder.map(alumno => (
                      <TableRow key={alumno.id} className="hover:bg-secondary/50 transition-colors">
                        <TableCell className="font-medium">{alumno.nombre}</TableCell>
                        <TableCell className="text-center">
                           <span className={`font-semibold px-2 py-1 rounded-md text-sm ${alumno.calificacionPromedio >= 80 ? 'bg-green-100 text-green-700' : alumno.calificacionPromedio >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {alumno.calificacionPromedio}%
                           </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs italic">{alumno.ultimoFeedback || "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2 hover:bg-primary/10" disabled>
                            Ver Detalles
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-accent/20" disabled>
                            <MessageCircle className="mr-1 h-4 w-4" /> Feedback
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">Selecciona un curso para ver los alumnos o no hay alumnos inscritos.</p>
            )}
            <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-dashed">
              (Las calificaciones y el sistema de feedback detallado están en desarrollo. Estos son datos de ejemplo.)
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full md:w-auto" disabled>
              <FileEdit className="mr-2 h-4 w-4" />
              Registrar Nuevas Calificaciones (General)
            </Button>
          </CardFooter>
        </Card>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Gestión de Calificaciones.
        </div>
      </footer>
    </div>
  );
}
