
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft, CalendarCog, Settings, PlusCircle } from 'lucide-react';

export default function DireccionCiclosAcademicosPage() {
  const ciclosPlaceholder = [
    { id: "ciclo1", nombre: "Semestre 2024-I", inicio: "01/02/2024", fin: "30/06/2024", estado: "Activo" },
    { id: "ciclo2", nombre: "Verano Intensivo 2024", inicio: "01/07/2024", fin: "31/08/2024", estado: "Planificado" },
    { id: "ciclo3", nombre: "Semestre 2024-II", inicio: "01/09/2024", fin: "20/12/2024", estado: "Planificado" },
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
          <CalendarCog className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Configuración de Ciclos Académicos
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Define y gestiona los periodos lectivos, fechas importantes y la estructura de los cursos.
          </p>
        </div>
        
        <Card className="shadow-lg bg-card">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="flex items-center text-xl font-headline">
                Ciclos Académicos Definidos
              </CardTitle>
              <CardDescription>Visualiza y administra los periodos lectivos de la institución.</CardDescription>
            </div>
            <Button disabled>
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear Nuevo Ciclo
            </Button>
          </CardHeader>
          <CardContent>
            {ciclosPlaceholder.length > 0 ? (
              <div className="space-y-4">
                {ciclosPlaceholder.map(ciclo => (
                  <Card key={ciclo.id} className="bg-secondary/30">
                    <CardHeader className="flex flex-row justify-between items-center pb-2">
                      <CardTitle className="text-lg">{ciclo.nombre}</CardTitle>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${ciclo.estado === "Activo" ? "bg-green-500/20 text-green-700" : "bg-blue-500/20 text-blue-700"}`}>
                        {ciclo.estado}
                      </span>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Fechas: {ciclo.inicio} - {ciclo.fin}
                      </p>
                      <Button variant="outline" size="sm" className="mt-3 hover:bg-primary/10" disabled>
                        <Settings className="mr-2 h-4 w-4"/>
                        Gestionar Ciclo
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No hay ciclos académicos definidos.</p>
            )}
            <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-dashed">
              Funcionalidad para creación y edición detallada de ciclos (asignación de cursos, definición de feriados, etc.) en desarrollo.
            </p>
          </CardContent>
        </Card>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Ciclos Académicos.
        </div>
      </footer>
    </div>
  );
}
