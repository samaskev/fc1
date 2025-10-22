
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Semana {
  semana: number;
  fecha: string;
  tema: string;
  paginas: string;
}

export interface SaturdayClassReportData {
  tipo_documento: string;
  facilitador: string;
  nivel: string;
  horario: string;
  mes: string;
  gestion: string;
  estructura_semanal: Semana[];
  observaciones: string;
  total_horas_mes: number;
}

interface SaturdayClassReportCardProps {
    data: SaturdayClassReportData;
}

export function SaturdayClassReportCard({ data }: SaturdayClassReportCardProps) {
    return (
        <Card className="w-full mx-auto shadow-lg border-primary/10 bg-card font-sans text-sm">
            <CardHeader className="p-4">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-lg text-primary">{data.tipo_documento}</p>
                        <p className="text-xs text-muted-foreground">Mes: {data.mes} / Gestión: {data.gestion}</p>
                    </div>
                </div>
            </CardHeader>
            <Separator/>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs border rounded-lg p-3 bg-secondary/20">
                    <p><span className="font-semibold text-muted-foreground">Facilitador:</span><br/> {data.facilitador}</p>
                    <p><span className="font-semibold text-muted-foreground">Nivel:</span><br/> {data.nivel}</p>
                    <p><span className="font-semibold text-muted-foreground">Horario:</span><br/> {data.horario}</p>
                </div>
                
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-bold">Semana</TableHead>
                                <TableHead className="font-bold">Fecha</TableHead>
                                <TableHead className="font-bold">Tema Avanzado</TableHead>
                                <TableHead className="text-right font-bold">Páginas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.estructura_semanal.map((semana, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">Semana {semana.semana}</TableCell>
                                    <TableCell>{semana.fecha}</TableCell>
                                    <TableCell>{semana.tema}</TableCell>
                                    <TableCell className="text-right">{semana.paginas}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                 {data.observaciones && (
                    <div>
                        <h4 className="font-semibold text-xs text-muted-foreground">Observaciones:</h4>
                        <p className="text-xs p-2 border rounded-md bg-secondary/20 mt-1"><i>"{data.observaciones}"</i></p>
                    </div>
                )}
            </CardContent>
             <Separator/>
             <CardFooter className="p-4 flex justify-end">
                 <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-center">
                    <p className="text-sm font-semibold text-primary">Total Horas Mes</p>
                    <p className="text-2xl font-bold text-primary">{data.total_horas_mes}h</p>
                </div>
             </CardFooter>
        </Card>
    )
}
