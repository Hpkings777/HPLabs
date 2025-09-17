"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import { Input } from "@/components/ui/input";
import { tools, categories, type Tool, type ToolCategory } from "@/lib/tools";
import { Search } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      tool.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      tool.category.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const toolsByCategory = categories.map((category) => ({
    category,
    tools: filteredTools.filter((tool) => tool.category === category),
  }));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
              Welcome to Tool Hub
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A curated collection of handy utilities to streamline your tasks.
              From developers to everyday users, there's a tool for everyone.
            </p>
          </section>

          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for a tool..."
                className="w-full pl-10 text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {toolsByCategory.map(
            ({ category, tools: categoryTools }) =>
              categoryTools.length > 0 && (
                <section key={category} className="mb-12">
                  <h2 className="text-2xl font-headline font-semibold mb-6">
                    {category} Tools
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryTools.map((tool) => (
                      <ToolCard key={tool.title} {...tool} />
                    ))}
                  </div>
                </section>
              )
          )}
          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No tools found for &quot;{debouncedSearch}&quot;
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
