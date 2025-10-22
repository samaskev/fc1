import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseCardProps {
  title: string;
  topics: string[];
  icon: LucideIcon;
}

export function CourseCard({ title, topics, icon: Icon }: CourseCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-headline font-medium">{title}</CardTitle>
        <Icon className="h-6 w-6 text-accent" />
      </CardHeader>
      <CardContent>
        {topics.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {topics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No hay temas disponibles.</p>
        )}
      </CardContent>
    </Card>
  );
}
