
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft, LayoutDashboard, Users, BookOpen, UserCheck, BarChartHorizontalBig, Percent } from 'lucide-react';

export default function DireccionDashboardKpiPage() {
  // Placeholder data for KPIs
  const kpis = [
    { title: "Total Alumnos Activos", value: "152", trend: "+5%", icon: Users, color: "text-blue-500" },
    { title: "Nuevos Alumnos (Últimos 30 días)", value: "23", trend: "+12%", icon: Users, color: "text-green-500" },
    { title: "Cursos Ofertados", value: "12", trend: "Estable", icon: BookOpen, color: "text-indigo-500" },
    { title: "Tasa de Finalización Promedio", value: "88%", trend: "-2%", icon: UserCheck, color: "text-red-500" },
    { title: "Satisfacción del Alumno (Promedio)", value: "4.5/5", trend: "+0.1", icon: Percent, color: "text-yellow-500" },
    { title: "Profesores Activos", value: "8", trend: "+1", icon: BarChartHorizontalBig, color: "text-purple-500" },
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
          <LayoutDashboard className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Dashboard General (KPIs)
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualiza los Indicadores Clave de Rendimiento para monitorear la salud y el progreso de la institución.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, index) => {
            const IconComponent = kpi.icon;
            return (
              <Card key={index} className="shadow-lg bg-card hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                  <IconComponent className={`h-5 w-5 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpi.value}</div>
                  <p className={`text-xs ${kpi.trend.startsWith('+') ? 'text-green-600' : kpi.trend.startsWith('-') ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {kpi.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <p className="text-xs text-muted-foreground mt-10 pt-6 text-center border-t border-dashed">
          (Los KPIs mostrados son datos de ejemplo. La visualización de gráficos dinámicos, filtros por periodo y personalización del dashboard están en desarrollo.)
        </p>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Dashboard de KPIs.
        </div>
      </footer>
    </div>
  );
}
