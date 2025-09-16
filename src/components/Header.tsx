import Link from "next/link";
import { GanttChartSquare } from "lucide-react";

export function Header() {
  return (
    <header className="py-6 px-4 md:px-6 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="HP Labs Home"
        >
          <GanttChartSquare className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">
            HP Labs
          </span>
        </Link>
      </div>
    </header>
  );
}
