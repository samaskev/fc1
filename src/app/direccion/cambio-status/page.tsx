
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft, Replace, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DireccionCambioStatusPage() {
  const statusPlaceholder = [
    { id: "s1", nombre: "Activo", descripcion: "El alumno está cursando activamente.", color: "bg-green-500/80" },
    { id: "s2", nombre: "Retirado", descripcion: "El alumno ha abandonado el curso.", color: "bg-red-500/80" },
    { id: "s3", nombre: "Congelado", descripcion: "El alumno ha pausado sus estudios temporalmente.", color: "bg-blue-500/80" },
    { id: "s4", nombre: "Egresado", descripcion: "El alumno ha completado satisfactoriamente el programa.", color: "bg-yellow-500/80" },
    { id: "s5", nombre: "Potencial", descripcion: "Persona registrada, aún no inscrita en un curso.", color: "bg-gray-500/80" },
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
          <Replace className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Gestión de Status de Alumnos
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Crea y administra los diferentes estados que puede tener un alumno en el sistema (ej. Activo, Retirado, Congelado).
          </p>
        </div>
        
        <Card className="shadow-lg bg-card">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-xl font-headline">Listado de Status</CardTitle>
              <CardDescription>Visualiza y gestiona los estados de los alumnos.</CardDescription>
            </div>
            <Button disabled>
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear Nuevo Status
            </Button>
          </CardHeader>
          <CardContent>
            {statusPlaceholder.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre del Status</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusPlaceholder.map(status => (
                      <TableRow key={status.id} className="hover:bg-secondary/50 transition-colors">
                        <TableCell>
                          <Badge variant="default" className={`${status.color} text-primary-foreground`}>
                            {status.nombre}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{status.descripcion}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="icon" className="mr-1 hover:bg-accent/20" title="Editar" disabled>
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10" title="Eliminar" disabled>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">No hay status definidos.</p>
            )}
             <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-dashed">
              (Funcionalidad para crear, editar y eliminar status en desarrollo.)
            </p>
          </CardContent>
        </Card>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Gestión de Status.
        </div>
      </footer>
    </div>
  );
}
