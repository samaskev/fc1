'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Printer, Download } from 'lucide-react';
import { BoletinCard, type BoletinData } from '@/components/boletin/BoletinCard';


const boletinData: BoletinData = {
  tipo_documento: "Boletín de Notas",
  institucion: "Flying Boat School",
  seccion: "Área Académica",
  estudiante: {
    nombre: "TEMBA RICHARD",
    clase: "EFA",
    numero_admision: "EFA 001"
  },
  evaluacion: {
    termino: "3rd Term",
    sesion: "2021/2022",
    fecha: "2022-07-28",
    facilitador: "ROSELINE RUTH",
    programa: "EFA",
    componentes: [
      {
        nombre: "Cutting",
        notas: [8, 9, 8],
        total: 25
      },
      {
        nombre: "Joining",
        notas: [8, 9, 8],
        total: 25
      },
      {
        nombre: "Finishing",
        notas: [8, 9, 8],
        total: 25
      }
    ],
    total_general: 75,
    promedio: 25
  },
  validacion: {
    sello: "Autenticado",
    firma_digital: true
  }
};


export default function BoletinNotasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
            <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
                <Link href="/profesores/calificaciones">
                <ChevronLeft className="mr-2 h-4 w-4"/>
                Volver a Calificaciones
                </Link>
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" disabled>
                    <Printer className="mr-2 h-4 w-4"/>
                    Imprimir
                </Button>
                <Button disabled>
                    <Download className="mr-2 h-4 w-4"/>
                    Descargar PDF
                </Button>
            </div>
        </div>

        <BoletinCard data={boletinData} />
        
        <p className="text-xs text-muted-foreground mt-6 text-center">
            (Esta es una vista de ejemplo. La generación dinámica de boletines por alumno está en desarrollo.)
        </p>

      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Visor de Boletines.
        </div>
      </footer>
    </div>
  );
}
