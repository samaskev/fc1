
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, BarChartBig, Users, BookOpen, UserCheck, Download } from 'lucide-react';

export default function DireccionReportesEstadisticasPage() {
  
  const reportTypes = [
    { value: "inscripciones", label: "Informe de Inscripciones" },
    { value: "progreso_alumnos", label: "Informe de Progreso de Alumnos" },
    { value: "rendimiento_cursos", label: "Informe de Rendimiento de Cursos" },
    { value: "actividad_docente", label: "Informe de Actividad Docente" },
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
          <BarChartBig className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Reportes y Estadísticas
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Genera y visualiza informes clave para la toma de decisiones y el seguimiento del rendimiento académico.
          </p>
        </div>
        
        <Card className="shadow-lg bg-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline">
              Generador de Informes
            </CardTitle>
            <CardDescription>Selecciona el tipo de informe y los parámetros deseados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="report-type" className="block text-sm font-medium text-muted-foreground mb-1">Tipo de Informe</label>
              <Select disabled>
                <SelectTrigger id="report-type" className="w-full md:w-[350px]">
                  <SelectValue placeholder="Selecciona un tipo de informe..." />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(report => (
                    <SelectItem key={report.value} value={report.value}>{report.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Aquí irían más filtros dependiendo del tipo de informe: rango de fechas, cursos específicos, etc. */}
            <Button className="w-full md:w-auto" disabled>
              <Download className="mr-2 h-4 w-4" />
              Generar y Descargar Informe (PDF/CSV)
            </Button>
             <p className="text-xs text-muted-foreground mt-3">(Generación y descarga de informes en desarrollo)</p>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold font-headline text-center my-10">Vista Rápida de Estadísticas Clave</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-md bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alumnos Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">152</div>
              <p className="text-xs text-muted-foreground">+5% desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Ofertados</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">2 nuevos este semestre</p>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Finalización Promedio</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">88%</div>
              <p className="text-xs text-muted-foreground">Meta: 90%</p>
            </CardContent>
          </Card>
        </div>
         <p className="text-xs text-muted-foreground mt-8 pt-4 text-center border-t border-dashed">
            (Las estadísticas clave son datos de ejemplo. La visualización dinámica y los filtros están en desarrollo.)
        </p>


      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Reportes y Estadísticas.
        </div>
      </footer>
    </div>
  );
}
