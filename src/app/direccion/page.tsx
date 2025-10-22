
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Landmark, 
  UsersRound, 
  FileSearch, 
  Megaphone, 
  CreditCard, 
  CalendarCog, 
  Banknote,
  ClipboardList,
  Replace,
  CalendarClock,
  PiggyBank,
  Snowflake,
  GraduationCap,
  Clock
} from 'lucide-react';

export default function DireccionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-primary">
            <Landmark className="inline-block mr-3 h-10 w-10" />
            Portal de Dirección
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Herramientas para la supervisión y gestión académica de First Class Institute.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <UsersRound className="mr-2 h-6 w-6 text-accent" />
                Gestión de Profesores
              </CardTitle>
              <CardDescription>Administra el personal docente y sus asignaciones.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Visualiza, añade nuevos perfiles y gestiona los cursos asignados a cada profesor.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/gestion-profesores">Administrar Profesores</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <FileSearch className="mr-2 h-6 w-6 text-accent" />
                Supervisión de Cursos
              </CardTitle>
              <CardDescription>Revisa el contenido y el progreso de los cursos ofertados.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Accede a temarios, estadísticas de finalización y feedback general de los cursos.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/supervision-cursos">Supervisar Cursos</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <GraduationCap className="mr-2 h-6 w-6 text-accent" />
                Evaluaciones y Calificaciones
              </CardTitle>
              <CardDescription>Supervisa todas las evaluaciones y notas de los estudiantes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Busca por alumno, revisa y descarga los boletines de notas y evaluaciones.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/evaluaciones">Supervisar Evaluaciones</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Megaphone className="mr-2 h-6 w-6 text-accent" />
                Comunicaciones Internas
              </CardTitle>
              <CardDescription>Gestiona avisos y notificaciones para alumnos y profesores.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Envía comunicados importantes y gestiona plantillas de mensajes.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/comunicaciones">Gestionar Comunicaciones</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <CreditCard className="mr-2 h-6 w-6 text-accent" />
                Matrículas y Pagos
              </CardTitle>
              <CardDescription>Supervisa el proceso de inscripción y el estado de los pagos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Visualiza matrículas, gestiona cobros y accede a reportes financieros básicos.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/matriculas-pagos">Ver Matrículas y Pagos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Banknote className="mr-2 h-6 w-6 text-accent" />
                Registro de Pagos
              </CardTitle>
              <CardDescription>Ingresa nuevos pagos de mensualidades de los estudiantes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Accede al formulario para registrar un nuevo pago y generar el recibo correspondiente.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/registro-pagos">Registrar Pago</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <CalendarCog className="mr-2 h-6 w-6 text-accent" />
                Ciclos Académicos
              </CardTitle>
              <CardDescription>Configura periodos lectivos y la estructura académica.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Define semestres, trimestres, fechas importantes y la oferta de cursos por ciclo.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/ciclos-academicos">Configurar Ciclos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Clock className="mr-2 h-6 w-6 text-accent" />
                Horas Profesores
              </CardTitle>
              <CardDescription>Supervisa los registros de horas y actividades de los profesores.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Visualiza y filtra los informes de horas de clase del personal docente.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/horas-profesores">Supervisar Horas</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <ClipboardList className="mr-2 h-6 w-6 text-accent" />
                Inscripción de Alumnos
              </CardTitle>
              <CardDescription>Inscribe a personas registradas en cursos específicos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Asigna un curso, horario y tarifa a un estudiante para un nuevo ciclo académico.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/inscripcion-alumnos">Inscribir Alumno</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Replace className="mr-2 h-6 w-6 text-accent" />
                Cambio de Status
              </CardTitle>
              <CardDescription>Modifica el estado de un alumno (activo, retirado, etc.).</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Actualiza la condición académica o administrativa de un estudiante en el sistema.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/cambio-status">Cambiar Status</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <CalendarClock className="mr-2 h-6 w-6 text-accent" />
                Cambio de Fecha
              </CardTitle>
              <CardDescription>Ajusta fechas de inicio o fin de cursos para un alumno.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Modifica las fechas de cursada de un estudiante por motivos excepcionales.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/cambio-fecha">Cambiar Fecha</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <PiggyBank className="mr-2 h-6 w-6 text-accent" />
                Pago de Rehabilitación
              </CardTitle>
              <CardDescription>Registra pagos para reactivar cuentas o cursos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Gestiona los pagos de estudiantes que desean reincorporarse tras una pausa.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/pago-rehabilitacion">Registrar Pago</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Snowflake className="mr-2 h-6 w-6 text-accent" />
                Congelación de Cuentas
              </CardTitle>
              <CardDescription>Pausa temporalmente la cuenta de un estudiante.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Administra las solicitudes de congelación de matrícula de los estudiantes.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/congelacion-cuentas">Congelar Cuenta</Link>
              </Button>
            </CardContent>
          </Card>


          {/* Tarjeta de acceso al submódulo Historial */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-headline">
                <Clock className="mr-2 h-6 w-6 text-accent" />
                Historial
              </CardTitle>
              <CardDescription>Consulta el historial de datos de estudiantes y pagos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Visualiza registros de estudiantes y pagos.</p>
              <Button asChild className="w-full">
                <Link href="/direccion/historial">Ver Historial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
      </main>
      <footer className="py-6 border-t mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Portal de Dirección.
        </div>
      </footer>
    </div>
  );
}
