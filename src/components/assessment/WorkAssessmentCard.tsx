
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export interface Criterio {
  nombre: string;
  porcentaje: number;
  notas: number[];
}

export interface WorkAssessmentData {
  tipo_documento: string;
  facilitador: string;
  codigo: string;
  horario: string;
  estudiante: {
    apellidos: string;
    nombres: string;
    nivel_actual: string;
    nivel_recomendado: string;
  };
  fecha_finalizacion: string;
  evaluacion: {
    criterios: Criterio[];
    puntaje_total: number;
    examen_medio: number;
    examen_final: number;
    promedio: number;
  };
  estado: {
    aprobado: boolean;
    reprobado: boolean;
  };
  comentarios: string;
}

interface WorkAssessmentCardProps {
    data: WorkAssessmentData
}

export function WorkAssessmentCard({ data }: WorkAssessmentCardProps) {
    const { estudiante, evaluacion, facilitador, tipo_documento, fecha_finalizacion, estado, comentarios, nivel_actual: legacy_nivel_actual, nivel_recomendado: legacy_nivel_recomendado, ...rest } = data;
    const { nombres, apellidos, nivel_actual, nivel_recomendado } = estudiante;

    const getCriterioSum = (notas: number[]) => notas.reduce((acc, nota) => acc + nota, 0).toFixed(1);

    return (
        <Card className="w-full mx-auto shadow-lg border-primary/10 bg-card font-sans text-sm">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-lg text-primary">{tipo_documento}</p>
                        <p className="text-xs text-muted-foreground">Facilitador: {facilitador}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">Código: {data.codigo}</p>
                        <p className="text-xs text-muted-foreground">Horario: {data.horario}</p>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 space-y-4">
                <div className="border rounded-lg p-3 bg-secondary/20">
                     <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <p><span className="font-semibold text-muted-foreground">Apellidos:</span> {apellidos}</p>
                        <p><span className="font-semibold text-muted-foreground">Nombres:</span> {nombres}</p>
                        <p><span className="font-semibold text-muted-foreground">Nivel Actual:</span> {nivel_actual}</p>
                        <p><span className="font-semibold text-muted-foreground">Nivel Recomendado:</span> <span className="font-bold text-primary">{nivel_recomendado}</span></p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold w-[35%]">Evaluation Criterial</TableHead>
                                <TableHead className="text-center font-bold">Percentage</TableHead>
                                <TableHead className="text-center">Scores</TableHead>
                                <TableHead className="text-right font-bold">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {evaluacion.criterios.map((criterio, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{criterio.nombre}</TableCell>
                                    <TableCell className="text-center">{criterio.porcentaje}%</TableCell>
                                    <TableCell className="text-center text-xs text-muted-foreground">{criterio.notas.join(' + ')}</TableCell>
                                    <TableCell className="text-right font-semibold">{getCriterioSum(criterio.notas)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-secondary/30 rounded-md text-xs">
                            <span className="font-semibold">Puntaje Total Criterios:</span>
                            <span className="font-bold">{evaluacion.puntaje_total}</span>
                        </div>
                         <div className="flex justify-between p-2 bg-secondary/30 rounded-md text-xs">
                            <span className="font-semibold">Examen Medio:</span>
                            <span className="font-bold">{evaluacion.examen_medio}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-secondary/30 rounded-md text-xs">
                            <span className="font-semibold">Examen Final:</span>
                            <span className="font-bold">{evaluacion.examen_final}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 bg-primary/10 rounded-md border border-primary/20">
                        <p className="text-xs font-bold text-primary">PROMEDIO FINAL</p>
                        <p className="text-4xl font-bold text-primary">{evaluacion.promedio}</p>
                        {estado.aprobado ? (
                             <Badge className="bg-green-500 text-white"><CheckCircle className="mr-1 h-3 w-3"/> APROBADO</Badge>
                        ) : (
                            <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3"/> REPROBADO</Badge>
                        )}
                    </div>
                </div>

                {comentarios && (
                    <div className="pt-2">
                        <h4 className="font-semibold">Comentarios del Facilitador:</h4>
                        <p className="text-xs text-muted-foreground p-2 border rounded-md bg-secondary/20 mt-1"><i>"{comentarios}"</i></p>
                    </div>
                )}
            </CardContent>
            <Separator />
            <CardFooter className="p-2 text-center text-xs text-muted-foreground">
                <p>Fecha de finalización y emisión de este documento: {fecha_finalizacion}</p>
            </CardFooter>
        </Card>
    )
}
