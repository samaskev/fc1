
import { Apple } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="mr-4 flex items-center">
          <Apple className="h-8 w-8 mr-2 text-primary" />
          <Link href="/" className="text-2xl font-bold font-headline text-primary">First Class Institute</Link>
        </div>
        <nav className="flex items-center space-x-4 md:space-x-6">
          <Link href="/profesores" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Profesores
          </Link>
          <Link href="/direccion" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Dirección
          </Link>
        </nav>
      </div>
    </header>
  );
}
