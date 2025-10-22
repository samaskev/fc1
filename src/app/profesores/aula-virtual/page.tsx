'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ListPlus, FilePlus2, Eye, Settings, Video, Users as UsersIcon, ChevronLeft, UserCircle, Edit3, UploadCloud, Trash2, FileText as FileTextIcon, MessageSquare, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export default function AulaVirtualProfesorPage() {
  const temarioPlaceholder = [
    { title: "Unidad 1: Introducción y Saludos", pdfFile: "unidad1_intro.pdf" },
    { title: "Unidad 2: Verbo 'To Be' y Artículos", pdfFile: null },
    { title: "Unidad 3: Presente Simple (En progreso)", pdfFile: "unidad3_presente_simple_ejercicios.pdf" },
    { title: "Unidad 4: Vocabulario: La Familia", pdfFile: null },
    { title: "Unidad 5: Preposiciones de Lugar", pdfFile: "unidad5_preposiciones.pdf" },
    { title: "Repaso General y Práctica Conversacional", pdfFile: null },
  ];

  const alumnosPlaceholder = [
    { id: "1", nombre: "Ana García Pérez", progreso: 75 },
    { id: "2", nombre: "Carlos López Martín", progreso: 90 },
    { id: "3", nombre: "Laura Fernández Ruiz", progreso: 60 },
    { id: "4", nombre: "Javier Sánchez Gómez", progreso: 82 },
    { id: "5", nombre: "Sofía Moreno Jiménez", progreso: 95 },
  ];

  const chatMessagesPlaceholder = [
    { id: "1", sender: "Ana García", text: "Hello professor, I have a question about exercise 3.", time: "10:30 AM" },
    { id: "2", sender: "Profesor Davis", text: "Hi Ana, sure, what's your question?", time: "10:31 AM" },
    { id: "3", sender: "Carlos López", text: "Can we get the slides for Unit 2?", time: "10:35 AM" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" size="sm" className="hover:bg-primary/10 transition-colors">
            <Link href="/profesores">
               <ChevronLeft className="mr-2 h-4 w-4"/>
              Volver al Portal
            </Link>
          </Button>
        </div>
        
        <div className="relative text-center mb-12 p-6 md:p-8 bg-card rounded-xl shadow-xl overflow-hidden border border-border">
           <div className="absolute inset-0 opacity-[0.03] pattern-[0.8rem_0.8rem_#000000_radial-gradient(circle_at_center,_var(--tw-gradient-stops))] dark:opacity-[0.05] dark:pattern-[0.8rem_0.8rem_#ffffff_radial-gradient(circle_at_center,_var(--tw-gradient-stops))]"></div>
          <Settings className="mx-auto mb-4 h-14 w-14 md:h-16 md:w-16 text-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline mb-3 text-primary">
            Gestión del Aula Virtual
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Administra el contenido del curso, crea evaluaciones y supervisa el progreso de tus alumnos.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Columna Principal (Más ancha) */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-card">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-headline">
                  <ListPlus className="mr-3 h-7 w-7 text-accent" />
                  Gestionar Temario del Curso
                </CardTitle>
                <CardDescription>Define y organiza los temas. Sube materiales en PDF para cada unidad.</CardDescription>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-4">
                  {temarioPlaceholder.map((tema, index) => (
                    <li key={index} className="p-4 border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground">{tema.title}</h4>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <Edit3 className="mr-2 h-4 w-4" /> Editar Título
                        </Button>
                      </div>
                      {tema.pdfFile ? (
                        <div className="flex items-center justify-between p-2 bg-background rounded-md border">
                          <div className="flex items-center">
                            <FileTextIcon className="mr-2 h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">{tema.pdfFile}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar PDF</span>
                          </Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic mb-2">No hay PDF asignado a esta unidad.</p>
                      )}
                      <Button variant="outline" size="sm" className="w-full mt-2 hover:bg-primary/10 transition-colors">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        {tema.pdfFile ? "Reemplazar PDF" : "Subir PDF"}
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full md:w-auto font-semibold mt-6">
                  <Link href="#"><ListPlus className="mr-2 h-5 w-5" /> Añadir Nueva Unidad al Temario</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-3">(Funcionalidad de subida de PDFs y edición de temario en desarrollo)</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-card">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl font-headline">
                  <FilePlus2 className="mr-3 h-7 w-7 text-accent" />
                  Crear y Gestionar Evaluaciones
                </CardTitle>
                <CardDescription>Elabora nuevas pruebas, simuladores y gestiona las existentes.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Utiliza el generador de IA o crea preguntas manualmente para evaluar a tus alumnos.
                </p>
                <Button asChild className="w-full md:w-auto font-semibold">
                  <Link href="#">Crear Nueva Evaluación</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  (Integración con IA y creación manual en desarrollo. Próximamente: bancos de preguntas, diferentes tipos de ítems y configuraciones avanzadas.)
                </p>
              </CardContent>
            </Card>
             <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                  <MessageSquare className="mr-2 h-6 w-6 text-accent" />
                  Chat del Curso
                </CardTitle>
                <CardDescription>Comunícate con tus alumnos en tiempo real.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 w-full border rounded-md p-4 mb-4 bg-secondary/20">
                  {chatMessagesPlaceholder.map(message => (
                    <div key={message.id} className={`mb-3 p-2 rounded-lg max-w-[80%] ${message.sender === "Profesor Davis" ? 'ml-auto bg-primary/80 text-primary-foreground' : 'bg-background shadow-sm'}`}>
                      <p className="text-xs font-semibold mb-0.5">{message.sender} <span className="text-xs text-muted-foreground/80">({message.time})</span></p>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  ))}
                   <p className="text-center text-xs text-muted-foreground py-2">--- Fin de los mensajes ---</p>
                </ScrollArea>
                <div className="flex space-x-2">
                  <Textarea placeholder="Escribe tu mensaje aquí..." className="flex-1 bg-background focus-visible:ring-primary/50" rows={2}/>
                  <Button className="self-end font-semibold">
                    <Send className="mr-2 h-4 w-4" /> Enviar
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">(Funcionalidad de chat en desarrollo)</p>
              </CardContent>
            </Card>
          </div>

          {/* Columna Lateral (Más estrecha) */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                  <Video className="mr-2 h-6 w-6 text-accent" />
                  Clase Virtual / Videoconferencia
                </CardTitle>
                <CardDescription>Administra tus sesiones de clase en vivo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Genera y comparte enlaces para tus clases virtuales (ej. Microsoft Teams, Zoom).
                </p>
                <div className="space-y-2">
                  <Label htmlFor="meeting-link" className="text-sm font-medium">Enlace de la Reunión</Label>
                  <Input id="meeting-link" type="url" placeholder="https://teams.microsoft.com/l/meetup-join/..." className="bg-background" disabled/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-password">Contraseña (opcional)</Label>
                  <Input id="meeting-password" type="text" placeholder="Contraseña de la reunión" className="bg-background" disabled/>
                </div>
                <Button className="w-full md:w-auto font-semibold" disabled>
                  Generar/Actualizar Enlace
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">(Integración con Microsoft Teams y otras plataformas, así como opciones de programación, en desarrollo)</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                  <UsersIcon className="mr-2 h-6 w-6 text-accent" />
                  Alumnos Inscritos
                </CardTitle>
                <CardDescription>Visualiza los estudiantes de este curso.</CardDescription>
              </CardHeader>
              <CardContent>
                {alumnosPlaceholder.length > 0 ? (
                  <ScrollArea className="h-60 pr-2">
                  <ul className="space-y-3">
                    {alumnosPlaceholder.map((alumno) => (
                      <li key={alumno.id} className="flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/60 rounded-lg transition-colors duration-200">
                        <div className="flex items-center">
                          <UserCircle className="mr-3 h-6 w-6 text-muted-foreground" />
                          <span className="text-sm font-medium">{alumno.nombre}</span>
                        </div>
                        <Badge variant={alumno.progreso > 80 ? "default" : "secondary"} className={alumno.progreso > 80 ? "bg-green-500/80 text-primary-foreground" : ""}>{alumno.progreso}%</Badge>
                      </li>
                    ))}
                  </ul>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No hay alumnos inscritos.</p>
                )}
                <Button variant="outline" className="w-full mt-4 font-semibold" disabled>Gestionar Alumnos</Button>
                <p className="text-xs text-muted-foreground mt-3 text-center">(Funcionalidad de gestión de alumnos y visualización de progreso detallado en desarrollo)</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-card border-dashed border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-headline">
                  <Eye className="mr-2 h-6 w-6 text-accent" />
                  Vista Previa (Alumno)
                </CardTitle>
                <CardDescription>Así verán los alumnos el temario.</CardDescription>
              </CardHeader>
              <CardContent>
                {temarioPlaceholder.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {temarioPlaceholder.map((tema, index) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <FileTextIcon className={`mr-2 h-4 w-4 ${tema.pdfFile ? 'text-primary' : 'text-muted-foreground/50'}`} />
                        {tema.title}
                        {tema.pdfFile && <Badge variant="outline" className="ml-2 text-xs">PDF</Badge>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Define el temario para ver la vista previa.</p>
                )}
                <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">Esta es una simulación. La gestión real se hace en "Gestionar Temario".</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="py-8 border-t mt-16 bg-card">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} First Class Institute. Gestión del Aula Virtual.
        </div>
      </footer>
    </div>
  );
}
