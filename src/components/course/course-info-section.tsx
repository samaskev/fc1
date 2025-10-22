
import { BookOpenText, Forward } from 'lucide-react';
import { CourseCard } from './course-card';

const coveredTopics = [
  "Saludos y Presentaciones",
  "El Alfabeto y Números",
  "Verbo 'To Be' (Ser/Estar)",
  "Artículos (A/An/The)",
  "Sustantivos Comunes y Propios",
];

const upcomingTopics = [
  "Tiempos Verbales Presentes (Simple y Continuo)",
  "Adjetivos y Adverbios",
  "Formulación de Preguntas",
  "Vocabulario: Familia y Hogar",
  "Preposiciones de Lugar",
];

export function CourseInfoSection() {
  return (
    <section id="course-info" className="py-12">
      <h2 className="text-3xl font-bold font-headline text-center mb-8">Información del Curso</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <CourseCard title="Temas Cubiertos" topics={coveredTopics} icon={BookOpenText} />
        <CourseCard title="Próximos Temas" topics={upcomingTopics} icon={Forward} />
      </div>
      <div className="mt-8 text-center text-muted-foreground p-4 border border-dashed rounded-lg">
        <p className="font-medium">Funcionalidades Adicionales Planeadas:</p>
        <ul className="list-inside list-disc text-sm">
          <li>Integración con Microsoft Teams para aulas virtuales.</li>
          <li>Chat del curso para interacción en tiempo real.</li>
          <li>Carga de materiales por el profesor.</li>
        </ul>
      </div>
    </section>
  );
}
