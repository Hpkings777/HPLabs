
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import type React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useLoading } from "@/context/LoadingContext";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  isPremium?: boolean;
}

export function ToolCard({ title, description, href, icon: Icon, isPremium }: ToolCardProps) {
  const { startLoading, isLoading } = useLoading();

  const handleClick = () => {
    if (!isLoading) {
        startLoading();
    }
  };

  const isPhorix = title === "Phorix";

  return (
    <Link href={href} className="group block h-full" onClick={handleClick}>
      <Card className={cn(
        "h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col",
        isPremium 
          ? "border-yellow-400/50 hover:border-yellow-400 bg-gradient-to-br from-yellow-50/20 via-card to-card" 
          : "hover:border-primary"
      )}>
        <CardHeader>
          <div className={cn(
            "rounded-lg p-3 w-fit mb-4 transition-colors duration-300",
            isPremium
              ? "bg-yellow-400/10 text-yellow-500 group-hover:bg-yellow-400 group-hover:text-yellow-950"
              : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
          )}>
            {isPhorix ? (
              <Image src="/phorix-logo.png" alt="Phorix Logo" width={32} height={32} className="w-8 h-8" />
            ) : (
              <Icon className="w-8 h-8" />
            )}
          </div>
          <CardTitle className="text-xl font-headline flex items-center justify-between">
            {title}
            {isPremium && (
                <Badge variant="outline" className="border-yellow-400/80 text-yellow-500 bg-yellow-400/10">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Premium
                </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{description}</CardDescription>
        </CardContent>
        <CardFooter className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={cn(
            "flex items-center text-sm font-medium",
            isPremium ? "text-yellow-500" : "text-primary"
            )}>
            <span>Use Tool</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
