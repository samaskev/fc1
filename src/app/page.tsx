
import Link from 'next/link';
import { Briefcase, Landmark, Apple } from 'lucide-react';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary to-secondary/80 p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="shadow-2xl border-primary/10">
          <CardHeader className="text-center p-8 bg-gradient-to-br from-primary via-primary/90 to-accent rounded-t-lg">
            <div className="mx-auto bg-white/20 p-4 rounded-full w-fit mb-4 backdrop-blur-sm">
                <Apple className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold font-headline text-white drop-shadow-md">
              First Class Institute
            </h1>
            <p className="text-primary-foreground/90 drop-shadow-sm">
              Plataforma de Gestión Académica
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <p className="text-center text-muted-foreground">
              Selecciona tu rol para continuar
            </p>
            <div className="flex flex-col space-y-4">
                <Button asChild size="lg" className="h-14 text-lg font-semibold transform hover:scale-105 transition-transform duration-300">
                    <Link href="/profesores">
                        <Briefcase className="mr-3 h-6 w-6" />
                        Acceder como Profesor
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 text-lg font-semibold transform hover:scale-105 transition-transform duration-300">
                    <Link href="/direccion">
                        <Landmark className="mr-3 h-6 w-6" />
                        Acceder como Dirección
                    </Link>
                </Button>
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground text-center w-full">
              © {new Date().getFullYear()} First Class Institute. Todos los derechos reservados.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

// Re-usando componentes de ShadCN para mantener consistencia
// Estos componentes no se importan directamente pero se asume su estilo y estructura
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`rounded-xl bg-card text-card-foreground overflow-hidden ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardContent = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`p-4 border-t ${className}`}>{children}</div>
);

const Button = ({ children, asChild, size, variant, className }: { children: React.ReactNode, asChild?: boolean, size?: string, variant?: string, className?: string }) => {
  const Comp = asChild ? 'div' : 'button';
  // Esta es una simulación del estilo de los botones de ShadCN para que funcione en este contexto
  const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variantStyle = variant === 'outline'
    ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    : "bg-primary text-primary-foreground hover:bg-primary/90";
  return <Comp className={`${baseStyle} ${variantStyle} ${className}`}>{children}</Comp>;
};
