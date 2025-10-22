
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { ChevronLeft, Banknote, Search, Edit, Save, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const initialStudentData = {
    ci: "1234567",
    codigo: "9984",
    nombreCompleto: "ARAGONDOÑA ZULEMA",
    nombreFactura: "ARAGONDOÑA ZULEMA",
    fechaInscripcion: "15/01/2025",
    fechaInicioClases: "19/05/2025",
    fechaUltimoPago: "10/05/2025",
    curso: "ENGLISH FIRST 4.4",
    profesor: "Prf. Ariel Berrios",
    turno: "mañana",
    status: "EPSILON - ACELERADO",
    modalidad: "ACELERADO",
    tarifa: "EPSILON-ACEL",
    matricula: "SIN MATRÍCULA",
};

export default function DireccionRegistroPagosPage() {
  const [studentData, setStudentData] = useState(initialStudentData);
  const [paymentData, setPaymentData] = useState({
      mesPagado: 'JUNIO 2025',
      montoMensual: 500.00,
      pagoAdelantado: "No",
      numeroRecibo: "",
      numeroAutorizacion: "",
      numeroFactura: "",
      totalSeleccionado: 500.00,
      montoPagado: "",
      cambio: 0,
      usuarioRegistro: "marian"
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const montoPagadoNum = parseFloat(paymentData.montoPagado);
    if (!isNaN(montoPagadoNum)) {
        const cambioCalc = montoPagadoNum - paymentData.totalSeleccionado;
        setPaymentData(prev => ({...prev, cambio: Math.max(0, cambioCalc)}));
    } else {
        setPaymentData(prev => ({...prev, cambio: 0}));
    }
  }, [paymentData.montoPagado, paymentData.totalSeleccionado]);

  const handleStudentDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setStudentData(prev => ({...prev, [id]: value}));
  };

  const handlePaymentDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPaymentData(prev => ({...prev, [id]: value}));
  };
  
  const handleRegisterPayment = () => {
      // Future: Logic to save to Firebase
      console.log("Datos del Estudiante:", studentData);
      console.log("Datos del Pago:", paymentData);
      toast({
          title: "Pago Registrado Exitosamente",
          description: `Recibo #${paymentData.numeroRecibo} para ${studentData.nombreCompleto} guardado.`,
      });
  }

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
          <Banknote className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Registro de Pagos de Estudiantes
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Ingresa y gestiona los pagos de mensualidades, matrículas y otros conceptos.
          </p>
        </div>
        
        <div className="space-y-8">
          <Card className="shadow-lg bg-card">
              <CardHeader>
                  <CardTitle>Buscar Estudiante</CardTitle>
                  <CardDescription>Busca por CI para cargar los datos del estudiante. (Funcionalidad simulada)</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                  <Input id="ci-search" placeholder="Ingresa CI del estudiante..." className="max-w-xs bg-background" defaultValue={initialStudentData.ci}/>
                  <Button><Search className="mr-2 h-4 w-4"/>Buscar</Button>
              </CardContent>
          </Card>

          <Card className="shadow-lg bg-card">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Información del Estudiante y Curso</CardTitle>
                <CardDescription>Datos cargados del estudiante. Haz clic en Editar para modificar.</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <><Save className="mr-2 h-4 w-4" /> Guardar Cambios</> : <><Edit className="mr-2 h-4 w-4"/> Editar Información</>}
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {/* General Fields */}
              <div className="space-y-1"><Label htmlFor="ci">ID de búsqueda (ci)</Label><Input id="ci" value={studentData.ci} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="codigo">Código del estudiante</Label><Input id="codigo" value={studentData.codigo} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="nombreCompleto">Nombre completo</Label><Input id="nombreCompleto" value={studentData.nombreCompleto} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="nombreFactura">Nombre para la factura</Label><Input id="nombreFactura" value={studentData.nombreFactura} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="fechaInscripcion">Fecha de inscripción</Label><Input id="fechaInscripcion" value={studentData.fechaInscripcion} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="fechaInicioClases">Fecha de inicio de clases</Label><Input id="fechaInicioClases" value={studentData.fechaInicioClases} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="fechaUltimoPago">Fecha del último pago</Label><Input id="fechaUltimoPago" value={studentData.fechaUltimoPago} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="curso">Curso</Label><Input id="curso" value={studentData.curso} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="profesor">Profesor</Label><Input id="profesor" value={studentData.profesor} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1">
                  <Label htmlFor="turno">Turno</Label>
                  <Select value={studentData.turno} onValueChange={(value) => setStudentData(prev => ({...prev, turno: value}))} disabled={!isEditing}>
                      <SelectTrigger id="turno"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="mañana">Mañana</SelectItem><SelectItem value="tarde">Tarde</SelectItem><SelectItem value="noche">Noche</SelectItem></SelectContent>
                  </Select>
              </div>
              <div className="space-y-1"><Label htmlFor="status">Status</Label><Input id="status" value={studentData.status} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="modalidad">Modalidad</Label><Input id="modalidad" value={studentData.modalidad} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="tarifa">Tarifa</Label><Input id="tarifa" value={studentData.tarifa} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
              <div className="space-y-1"><Label htmlFor="matricula">Matrícula</Label><Input id="matricula" value={studentData.matricula} onChange={handleStudentDataChange} disabled={!isEditing} /></div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-card">
            <CardHeader>
                <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-accent"/>Detalles del Pago</CardTitle>
                <CardDescription>Ingresa los detalles específicos para este registro de pago.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                  {/* Payment Fields */}
                  <div className="space-y-1 lg:col-span-2"><Label htmlFor="mesPagado">Mes pagado</Label><Input id="mesPagado" value={paymentData.mesPagado} onChange={handlePaymentDataChange} /></div>
                  <div className="space-y-1"><Label htmlFor="montoMensual">Monto mensual</Label><Input type="number" id="montoMensual" value={paymentData.montoMensual} onChange={handlePaymentDataChange} /></div>
                  <div className="space-y-2 pt-2">
                      <Label>¿Pago adelantado?</Label>
                      <RadioGroup value={paymentData.pagoAdelantado} onValueChange={(value) => setPaymentData(prev => ({...prev, pagoAdelantado: value}))} className="flex gap-4">
                          <div className="flex items-center space-x-2"><RadioGroupItem value="Sí" id="adelantado-si" /><Label htmlFor="adelantado-si">Sí</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="No" id="adelantado-no" /><Label htmlFor="adelantado-no">No</Label></div>
                      </RadioGroup>
                  </div>
                </div>
                <Separator/>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <div className="space-y-1"><Label htmlFor="numeroRecibo">Número de recibo</Label><Input id="numeroRecibo" value={paymentData.numeroRecibo} onChange={handlePaymentDataChange} /></div>
                  <div className="space-y-1"><Label htmlFor="numeroAutorizacion">Número de autorización</Label><Input id="numeroAutorizacion" value={paymentData.numeroAutorizacion} onChange={handlePaymentDataChange} /></div>
                  <div className="space-y-1 lg:col-span-2"><Label htmlFor="numeroFactura">Número de factura</Label><Input id="numeroFactura" value={paymentData.numeroFactura} onChange={handlePaymentDataChange} /></div>
                  
                  <div className="space-y-1"><Label htmlFor="totalSeleccionado">Total seleccionado</Label><Input id="totalSeleccionado" value={paymentData.totalSeleccionado.toFixed(2)} readOnly className="font-bold bg-secondary/30" /></div>
                  <div className="space-y-1"><Label htmlFor="montoPagado">Monto pagado</Label><Input type="number" id="montoPagado" value={paymentData.montoPagado} onChange={handlePaymentDataChange} placeholder="0.00"/></div>
                  <div className="space-y-1"><Label htmlFor="cambio">Cambio</Label><Input id="cambio" value={paymentData.cambio.toFixed(2)} readOnly className="font-bold bg-secondary/30"/></div>
                  <div className="space-y-1"><Label htmlFor="usuarioRegistro">Usuario registro</Label><Input id="usuarioRegistro" value={paymentData.usuarioRegistro} readOnly className="bg-secondary/30"/></div>
                </div>
            </CardContent>
            <CardFooter>
                <Button size="lg" className="font-semibold text-base" onClick={handleRegisterPayment}>
                    Registrar Pago
                </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Registro de Pagos.
        </div>
      </footer>
    </div>
  );
}
