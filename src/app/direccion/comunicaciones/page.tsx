
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ChevronLeft, Megaphone, Send, History, BellRing } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DireccionComunicacionesPage() {

  const comunicacionesPlaceholder = [
    {
      id: "comm1",
      asunto: "Recordatorio: Inicio del Semestre 2024-II",
      fecha: "2024-08-20",
      destinatarios: "General",
      mensaje: "Les recordamos que el segundo semestre académico del 2024 comenzará el próximo lunes. ¡Esperamos verlos a todos listos para un nuevo ciclo de aprendizaje!"
    },
    {
      id: "comm2",
      asunto: "Mantenimiento de la Plataforma",
      fecha: "2024-07-15",
      destinatarios: "General",
      mensaje: "El sistema estará en mantenimiento este fin de semana para aplicar mejoras. El servicio se restaurará el lunes por la mañana."
    }
  ];

  const alumnosConDeuda = [
      { id: "a1", nombre: "Javier Sánchez Gómez", curso: "Inglés Intermedio B1", fechaVencimiento: "2024-07-05" },
      { id: "a2", nombre: "Sofía Moreno Jiménez", curso: "Inglés Básico A1", fechaVencimiento: "2024-07-05" },
      { id: "a3", nombre: "Miguel Ángel Díaz", curso: "Preparación TOEFL", fechaVencimiento: "2024-07-10" },
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
          <Megaphone className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Comunicaciones Internas
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Gestiona avisos, notificaciones y comunicados para toda la institución o grupos específicos.
          </p>
        </div>
        
        <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                <Card className="shadow-lg bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-headline">
                      Enviar Nuevo Comunicado
                    </CardTitle>
                    <CardDescription>Redacta y envía un mensaje a un grupo de destinatarios.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="destinatarios">Destinatarios</Label>
                        <Select defaultValue="general">
                            <SelectTrigger id="destinatarios">
                                <SelectValue placeholder="Seleccionar grupo..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General (Todos los usuarios)</SelectItem>
                                <SelectItem value="profesores">Solo Profesores</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="asunto">Asunto</Label>
                        <Input id="asunto" placeholder="Ej: Recordatorio de Feriado" className="bg-background"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mensaje">Mensaje</Label>
                        <Textarea id="mensaje" placeholder="Escribe tu mensaje aquí..." rows={6} className="bg-background"/>
                    </div>
                    <Button className="w-full font-semibold" disabled>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Comunicado
                    </Button>
                     <p className="text-xs text-muted-foreground mt-2 text-center">(Funcionalidad de envío y segmentación en desarrollo)</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-headline">
                      <History className="mr-2 h-6 w-6 text-accent" />
                      Historial de Comunicados
                    </CardTitle>
                    <CardDescription>Revisa los últimos comunicados enviados.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {comunicacionesPlaceholder.length > 0 ? (
                      <div className="space-y-4">
                        {comunicacionesPlaceholder.map(comm => (
                          <div key={comm.id} className="p-3 border rounded-lg bg-secondary/30">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-semibold">{comm.asunto}</h4>
                              <Badge variant="outline">{comm.destinatarios}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">Enviado: {comm.fecha}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{comm.mensaje}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">No se han enviado comunicados.</p>
                    )}
                  </CardContent>
                </Card>
            </div>
            
            <Card className="shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                  <BellRing className="mr-2 h-6 w-6 text-accent" />
                  Alumnos con Pagos Pendientes
                </CardTitle>
                <CardDescription>
                  Visualiza los alumnos con mensualidades vencidas y envía recordatorios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alumnosConDeuda.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Alumno</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Fecha de Vencimiento</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {alumnosConDeuda.map(alumno => (
                            <TableRow key={alumno.id} className="hover:bg-secondary/50 transition-colors">
                              <TableCell className="font-medium">{alumno.nombre}</TableCell>
                              <TableCell className="text-muted-foreground">{alumno.curso}</TableCell>
                              <TableCell className="text-destructive font-semibold">{alumno.fechaVencimiento}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" disabled>
                                  <Send className="mr-2 h-4 w-4" />
                                  Enviar Recordatorio
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                     <div className="flex justify-end mt-4">
                        <Button disabled>Enviar Recordatorio a Todos</Button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    ¡Excelente! No hay alumnos con pagos pendientes.
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-dashed">
                    (Funcionalidad de envío de recordatorios en desarrollo. La lista es un ejemplo.)
                </p>
              </CardContent>
            </Card>
        </div>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Comunicaciones Internas.
        </div>
      </footer>
    </div>
  );
}
