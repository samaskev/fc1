
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { ChevronLeft, UsersRound, UserPlus, Edit3, Trash2 } from 'lucide-react';

export default function DireccionGestionProfesoresPage() {
  const profesoresPlaceholder = [
    { id: "p1", nombre: "Dr. David Lee", email: "david.lee@example.com", avatarUrl: "https://placehold.co/40x40.png", cursos: ["Inglés Básico A", "Inglés Avanzado C"] },
    { id: "p2", nombre: "Laura Martínez", email: "laura.martinez@example.com", avatarUrl: "https://placehold.co/40x40.png", cursos: ["Inglés Intermedio B1"] },
    { id: "p3", nombre: "Carlos Gómez", email: "carlos.gomez@example.com", avatarUrl: "https://placehold.co/40x40.png", cursos: ["Taller de Conversación", "Preparación TOEFL"] },
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
          <UsersRound className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Gestión de Profesores
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Administra el personal docente, asigna cursos y gestiona sus perfiles.
          </p>
        </div>
        
        <Card className="shadow-lg bg-card">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-xl font-headline">Listado de Profesores</CardTitle>
              <CardDescription>Visualiza y gestiona el personal docente activo.</CardDescription>
            </div>
            <Button disabled>
              <UserPlus className="mr-2 h-5 w-5" />
              Añadir Nuevo Profesor
            </Button>
          </CardHeader>
          <CardContent>
            {profesoresPlaceholder.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Avatar</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cursos Asignados</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profesoresPlaceholder.map(profesor => (
                      <TableRow key={profesor.id} className="hover:bg-secondary/50 transition-colors">
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profesor.avatarUrl} alt={profesor.nombre} data-ai-hint="teacher avatar" />
                            <AvatarFallback>{profesor.nombre.substring(0,1)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{profesor.nombre}</TableCell>
                        <TableCell className="text-muted-foreground">{profesor.email}</TableCell>
                        <TableCell className="text-xs">
                          {profesor.cursos.join(", ") || "Ninguno"}
                        </TableCell>
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
              <p className="text-sm text-muted-foreground text-center py-6">No hay profesores registrados.</p>
            )}
             <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-dashed">
              (Funcionalidades de añadir, editar y eliminar profesores en desarrollo. Estos son datos de ejemplo.)
            </p>
          </CardContent>
        </Card>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Gestión de Profesores.
        </div>
      </footer>
    </div>
  );
}
