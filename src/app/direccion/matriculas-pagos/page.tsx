
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft, CreditCard, Users, FileSpreadsheet } from 'lucide-react';

export default function DireccionMatriculasPagosPage() {
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
          <CreditCard className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Gestión de Matrículas y Pagos
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Supervisa el estado de las inscripciones, los pagos realizados y pendientes.
          </p>
        </div>
        
        <Card className="shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-headline">
              Panel de Matrículas y Pagos
            </CardTitle>
            <CardDescription>Visualiza datos de inscripciones y accede a herramientas de gestión financiera básica.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-accent"/>Nuevas Matrículas (Mes)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">23</p>
                        <p className="text-xs text-muted-foreground">+5 respecto al mes anterior</p>
                    </CardContent>
                </Card>
                <Card className="bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center"><CreditCard className="mr-2 h-5 w-5 text-accent"/>Ingresos del Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">$5,750.00</p>
                        <p className="text-xs text-muted-foreground">Proyección: $6,200.00</p>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center"><FileSpreadsheet className="mr-2 h-5 w-5 text-accent"/>Exportar Reporte</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">Descarga un resumen de pagos y matrículas.</p>
                        <Button variant="outline" className="w-full" disabled>Descargar CSV</Button>
                    </CardContent>
                </Card>
            </div>
             <p className="text-center text-muted-foreground p-6 border border-dashed rounded-md">
              Funcionalidad detallada de gestión de matrículas, historial de pagos por alumno e integración con pasarelas de pago en desarrollo.
            </p>
          </CardContent>
        </Card>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Matrículas y Pagos.
        </div>
      </footer>
    </div>
  );
}
