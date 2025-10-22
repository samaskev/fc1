'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export interface BoletinData {
  tipo_documento: string;
  institucion: string;
  seccion: string;
  estudiante: {
    nombre: string;
    clase: string;
    numero_admision: string;
  };
  evaluacion: {
    termino: string;
    sesion: string;
    fecha: string;
    facilitador: string;
    programa: string;
    componentes: Array<{
      nombre: string;
      notas: number[];
      total: number;
    }>;
    total_general: number;
    promedio: number;
  };
  validacion: {
    sello: string;
    firma_digital: boolean;
  };
}

interface BoletinCardProps {
    data: BoletinData
}

export function BoletinCard({ data }: BoletinCardProps) {
    const { estudiante, evaluacion, institucion, seccion, tipo_documento, validacion } = data;

    return (
        <Card className="max-w-4xl mx-auto shadow-xl border-primary/20 bg-card p-2 sm:p-4">
            <CardHeader className="text-center p-4">
                <p className="text-sm font-semibold text-primary">{institucion}</p>
                <CardTitle className="text-2xl sm:text-3xl font-headline">{tipo_documento}</CardTitle>
                <CardDescription className="text-sm">{seccion}</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                    <div className="p-3 bg-secondary/30 rounded-md border">
                        <p className="font-semibold text-muted-foreground">Estudiante:</p>
                        <p className="text-lg font-bold">{estudiante.nombre}</p>
                    </div>
                     <div className="p-3 bg-secondary/30 rounded-md border">
                        <p className="font-semibold text-muted-foreground">Clase / N° Admisión:</p>
                        <p className="text-lg font-bold">{estudiante.clase} / {estudiante.numero_admision}</p>
                    </div>
                </div>

                <div className="border rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg mb-2">Detalles de Evaluación</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <p><span className="font-semibold">Término:</span> {evaluacion.termino}</p>
                        <p><span className="font-semibold">Sesión:</span> {evaluacion.sesion}</p>
                        <p><span className="font-semibold">Fecha:</span> {evaluacion.fecha}</p>
                        <p><span className="font-semibold">Facilitador:</span> {evaluacion.facilitador}</p>
                        <p><span className="font-semibold">Programa:</span> {evaluacion.programa}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">Componentes</TableHead>
                                <TableHead className="text-center">Nota 1</TableHead>
                                <TableHead className="text-center">Nota 2</TableHead>
                                <TableHead className="text-center">Nota 3</TableHead>
                                <TableHead className="text-right font-bold">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {evaluacion.componentes.map((comp, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{comp.nombre}</TableCell>
                                    {comp.notas.map((nota, i) => (
                                        <TableCell key={i} className="text-center">{nota}</TableCell>
                                    ))}
                                    <TableCell className="text-right font-semibold">{comp.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <Separator className="my-6"/>

                <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-secondary/30 rounded-md">
                            <span className="font-semibold">Total General:</span>
                            <span className="font-bold text-lg">{evaluacion.total_general}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-secondary/30 rounded-md">
                            <span className="font-semibold">Promedio:</span>
                            <span className="font-bold text-lg text-primary">{evaluacion.promedio}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 border-t mt-4 flex items-center justify-center">
                 {validacion.firma_digital && (
                    <Badge variant="default" className="bg-green-600/80 hover:bg-green-700 text-primary-foreground">
                        <CheckCircle className="mr-2 h-4 w-4"/>
                        {validacion.sello}
                    </Badge>
                 )}
            </CardFooter>
        </Card>
    )
}
