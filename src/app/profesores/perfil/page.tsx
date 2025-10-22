
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ChevronLeft, UserCog, Briefcase, Edit3, Settings2, BookCopy } from 'lucide-react';

export default function ProfesorPerfilPage() {
  const profesor = {
    nombre: "Dr. David Lee",
    email: "david.lee@example.com",
    rol: "Profesor",
    avatarUrl: "https://placehold.co/100x100.png", // Placeholder
    especialidad: "Lingüística Aplicada, TOEFL Prep",
    cursosAsignados: ["Inglés Básico A (Mañana)", "Inglés Avanzado C (Tarde)", "Taller de Conversación Sábados"],
    proximaClase: "Inglés Básico A - Martes 10:00 AM",
    antiguedad: "5 años en la institución",
  };

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

        <Card className="max-w-3xl mx-auto shadow-xl border border-border bg-card">
          <CardHeader className="text-center">
            <UserCog className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle className="text-3xl font-headline">Mi Perfil de Profesor</CardTitle>
            <CardDescription>Revisa y actualiza tu información profesional y de contacto.</CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-lg bg-secondary/30 border">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={profesor.avatarUrl} alt={profesor.nombre} data-ai-hint="teacher profile" />
                <AvatarFallback>{profesor.nombre.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold">{profesor.nombre}</h2>
                <p className="text-primary">{profesor.rol}</p>
                <p className="text-sm text-muted-foreground">{profesor.email}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold font-headline mb-3 flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-accent" />
                Información Profesional
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-background rounded-md border">
                  <span className="font-medium text-muted-foreground">Especialidad:</span>
                  <span>{profesor.especialidad || "No especificada"}</span>
                </div>
                <div className="flex justify-between p-3 bg-background rounded-md border">
                  <span className="font-medium text-muted-foreground">Años en la Institución:</span>
                  <span>{profesor.antiguedad}</span>
                </div>
              </div>
            </div>
            
            <Separator />

            <div>
              <h3 className="text-xl font-semibold font-headline mb-3 flex items-center">
                <BookCopy className="mr-2 h-5 w-5 text-accent" />
                Resumen de Cursos
              </h3>
              <div className="space-y-3 text-sm">
                 <div className="p-3 bg-background rounded-md border">
                  <span className="font-medium text-muted-foreground block mb-1">Cursos Asignados:</span>
                  {profesor.cursosAsignados.length > 0 ? (
                    <ul className="list-disc list-inside pl-1">
                      {profesor.cursosAsignados.map((curso, i) => <li key={i}>{curso}</li>)}
                    </ul>
                  ) : (
                    <span>No hay cursos asignados.</span>
                  )}
                </div>
                <div className="flex justify-between p-3 bg-background rounded-md border">
                  <span className="font-medium text-muted-foreground">Próxima Clase Programada:</span>
                  <span>{profesor.proximaClase || "N/A"}</span>
                </div>
              </div>
            </div>

            <Separator />
            
            <div>
              <h3 className="text-xl font-semibold font-headline mb-3 flex items-center">
                <Settings2 className="mr-2 h-5 w-5 text-accent" />
                Gestión de Cuenta
              </h3>
               <p className="text-sm text-muted-foreground mb-3">
                Actualiza tus datos de contacto, biografía profesional y preferencias.
              </p>
              <Button variant="outline" className="w-full sm:w-auto hover:bg-primary/10 transition-colors" disabled>
                <Edit3 className="mr-2 h-4 w-4" />
                Editar Información del Perfil
              </Button>
               <p className="text-xs text-muted-foreground mt-2">(Funcionalidad de edición en desarrollo)</p>
            </div>

          </CardContent>
          <CardFooter className="p-6 border-t">
            <p className="text-xs text-muted-foreground text-center w-full">
              Contacta con la dirección para cambios en asignaciones de cursos o información institucional.
            </p>
          </CardFooter>
        </Card>
      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Perfil del Profesor.
        </div>
      </footer>
    </div>
  );
}
