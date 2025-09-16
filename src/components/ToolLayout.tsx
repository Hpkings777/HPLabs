import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { ReactNode } from "react";

export function ToolLayout({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" className="pl-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>
          </Button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{description}</p>
        </div>
        <div className="max-w-3xl mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
