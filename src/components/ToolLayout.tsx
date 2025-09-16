import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
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
