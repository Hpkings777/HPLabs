import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { type LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function ToolCard({ title, description, href, icon: Icon }: ToolCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary flex flex-col">
        <CardHeader>
          <div className="bg-primary/10 text-primary rounded-lg p-3 w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Icon className="w-8 h-8" />
          </div>
          <CardTitle className="text-xl font-headline">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center text-sm font-medium text-primary">
            <span>Use Tool</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
