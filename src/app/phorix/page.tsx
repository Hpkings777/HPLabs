
"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Lock, Send, User as UserIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function PhorixPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        // A slight delay to allow the new message to render
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if(viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Placeholder for AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: "assistant",
        content: "This is a placeholder response from Phorix.",
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <ToolLayout
        title="Phorix"
        description="Phorix is the next-generation AI created by HP Labs, designed to think beyond boundaries."
      >
        <div className="flex flex-col items-center justify-center text-center py-12 bg-card border rounded-lg shadow-lg">
          <div className="p-6 bg-primary/10 rounded-full mb-6">
            <Lock className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-3xl font-bold font-headline mb-2">
            Authentication Required
          </h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Please log in to access Phorix.
          </p>
          <Button size="lg" asChild>
            <Link href="/login?redirect=/phorix">Log In</Link>
          </Button>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Phorix"
      description="Phorix is the next-generation AI created by HP Labs, designed to think beyond boundaries."
    >
      <Card className="h-[70vh] flex flex-col">
        <CardContent className="p-6 flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground pt-16">
                  <Sparkles className="w-12 h-12 mx-auto mb-4" />
                  <p className="text-lg">Welcome to Phorix</p>
                  <p>Start a conversation by typing your message below.</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-4",
                      message.role === "user" ? "justify-end" : ""
                    )}
                  >
                    {message.role === "assistant" && (
                       <Avatar className="w-9 h-9 border">
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                            <Sparkles className="w-5 h-5" />
                        </div>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl p-4 text-sm whitespace-pre-wrap",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted rounded-bl-none"
                      )}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-9 h-9 border">
                        <AvatarImage src={user.photoURL ?? ""} />
                        <AvatarFallback>
                          <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
               {isLoading && (
                 <div className="flex items-start gap-4">
                    <Avatar className="w-9 h-9 border">
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </Avatar>
                    <div className="bg-muted rounded-2xl p-4 rounded-bl-none flex items-center space-x-2">
                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-pulse"></span>
                    </div>
                 </div>
                )}
            </div>
          </ScrollArea>

          <form
            onSubmit={handleSubmit}
            className="relative flex items-center gap-2 pt-4 border-t"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Phorix..."
              className="pr-20 resize-none min-h-[40px] max-h-40"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 bottom-1 h-9 w-16 rounded-lg"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
