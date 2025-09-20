
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
import { phorixFlow } from '@/ai/flows/phorix-flow';

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function PhorixPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
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
  }, [messages, streamingMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const responseStream = await phorixFlow({ messages: newMessages });
      const reader = responseStream.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        setStreamingMessage(accumulatedResponse);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: accumulatedResponse }]);
    } catch (error) {
      console.error("Error running Phorix flow", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I seem to be having trouble connecting. Please try again."}]);
    } finally {
      setIsLoading(false);
      setStreamingMessage(null);
    }
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
              {messages.length === 0 && streamingMessage === null ? (
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
               {streamingMessage !== null && (
                 <div className="flex items-start gap-4">
                    <Avatar className="w-9 h-9 border">
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </Avatar>
                    <div className="bg-muted rounded-2xl p-4 rounded-bl-none max-w-[75%] text-sm whitespace-pre-wrap">
                      {streamingMessage}
                       {isLoading && <span className="inline-block w-2 h-4 bg-foreground animate-pulse ml-1" />}
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
              {isLoading ? <LoadingSpinner /> : <Send className="w-5 h-5" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
