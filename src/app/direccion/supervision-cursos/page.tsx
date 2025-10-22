
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronLeft, FileSearch, Eye, Edit, Users as UsersIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DireccionSupervisionCursosPage() {
  const cursosPlaceholder = [
    { id: "c1", nombre: "Inglés Básico A1 - Mañana", profesor: "Dr. David Lee", alumnos: 25, progresoMedio: 75, estado: "Activo" },
    { id: "c2", nombre: "Inglés Intermedio B1 - Tarde", profesor: "Laura Martínez", alumnos: 18, progresoMedio: 60, estado: "Activo" },
    { id: "c3", nombre: "Taller de Conversación - Sábados", profesor: "Carlos Gómez", alumnos: 12, progresoMedio: 85, estado: "Activo" },
    { id: "c4", nombre: "Inglés Avanzado C2 - Noche", profesor: "Dr. David Lee", alumnos: 0, progresoMedio: 0, estado: "Planificado" },
  ];

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
          <FileSearch className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Supervisión de Cursos
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Revisa el estado, contenido y progreso general de los cursos ofertados por la institución.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosPlaceholder.map(curso => (
            <Card key={curso.id} className="shadow-lg hover:shadow-xl transition-shadow bg-card flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-headline mb-1">{curso.nombre}</CardTitle>
                  <Badge variant={curso.estado === "Activo" ? "default" : "secondary"} className={curso.estado === "Activo" ? "bg-green-500/80 text-primary-foreground" : ""}>
                    {curso.estado}
                  </Badge>
                </div>
                <CardDescription className="text-xs">Profesor: {curso.profesor}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center"><UsersIcon className="mr-1.5 h-4 w-4" /> Alumnos Inscritos:</span>
                  <span className="font-semibold">{curso.alumnos}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progreso Medio del Curso:</span>
                    <span className="font-semibold">{curso.progresoMedio}%</span>
                  </div>
                  <Progress value={curso.progresoMedio} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 hover:bg-primary/10" disabled>
                  <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 hover:bg-accent/20" disabled>
                  <Edit className="mr-2 h-4 w-4" /> Editar Curso
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        {cursosPlaceholder.length === 0 && (
           <p className="text-sm text-muted-foreground text-center py-10">No hay cursos para supervisar actualmente.</p>
        )}
         <p className="text-xs text-muted-foreground mt-8 pt-4 text-center border-t border-dashed">
          (Funcionalidades de visualización detallada y edición de cursos en desarrollo. Estos son datos de ejemplo.)
        </p>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Supervisión de Cursos.
        </div>
      </footer>
    </div>
  );
}
