
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserCog, ClipboardCheck, Clock, CalendarCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProfesorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
            Portal del Profesor
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Gestiona tus cursos, estudiantes y recursos educativos de manera eficiente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <CalendarCheck className="mr-2 h-6 w-6 text-accent" />
                Registro de Asistencia
              </CardTitle>
              <CardDescription>Toma lista, registra notas y gestiona el informe mensual.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Accede a la lista de tus alumnos para el registro diario.</p>
              <Button asChild variant="default" className="w-full">
                <Link href="/profesores/asistencia">Pasar Lista</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <ClipboardCheck className="mr-2 h-6 w-6 text-accent" />
                Calificaciones y Feedback
              </CardTitle>
              <CardDescription>Revisa el rendimiento y proporciona comentarios a tus alumnos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Accede al sistema de calificaciones y gestiona el feedback.</p>
              <Button asChild variant="outline">
                <Link href="/profesores/calificaciones">Gestionar Calificaciones</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Clock className="mr-2 h-6 w-6 text-accent" />
                Registro de Horas (Semanal)
              </CardTitle>
              <CardDescription>Completa tu informe de clases de lunes a viernes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Registra tu avance y horas para la gestión administrativa.</p>
              <Button asChild variant="outline">
                <Link href="/profesores/registro-horas">Registrar Horas (L-V)</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Clock className="mr-2 h-6 w-6 text-accent" />
                Registro de Horas (Sábados)
              </CardTitle>
              <CardDescription>Completa tu informe de clases de los sábados.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Registra tus actividades y horas de las clases sabatinas.</p>
              <Button asChild variant="outline">
                <Link href="/profesores/registro-horas-sabado">Registrar Horas (Sáb.)</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <UserCog className="mr-2 h-6 w-6 text-accent" />
                Mi Perfil
              </CardTitle>
              <CardDescription>Actualiza tu información y gestiona tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Revisa tus datos personales y profesionales.</p>
              <Button asChild variant="outline">
                <Link href="/profesores/perfil">Ir a Mi Perfil</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="py-6 border-t mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Portal del Profesor.
        </div>
      </footer>
    </div>
  );
}
