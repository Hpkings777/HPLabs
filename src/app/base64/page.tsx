
"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      // Use encodeURIComponent to handle Unicode characters correctly
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);
    } catch (e) {
      toast({
        title: "Encoding Error",
        description: "Could not encode the provided input.",
        variant: "destructive",
      });
    }
  };

  const handleDecode = () => {
    try {
      // Handles URL-safe Base64 and then use decodeURIComponent
      const safeInput = input.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = decodeURIComponent(escape(atob(safeInput)));
      setOutput(decoded);
    } catch (e) {
      toast({
        title: "Decoding Error",
        description: "Invalid Base64 string for decoding.",
        variant: "destructive",
      });
    }
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Easily encode your data to Base64 or decode Base64 strings."
    >
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">Input</Label>
              <Textarea
                id="input-text"
                placeholder="Type or paste your content here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[150px] font-code"
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleEncode} className="flex-1 from-primary to-primary/80 bg-gradient-to-br">
                Encode
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSwap}
                aria-label="Swap input and output"
              >
                <ArrowRightLeft className="w-5 h-5 text-muted-foreground transition-transform group-hover:rotate-180" />
              </Button>
              <Button onClick={handleDecode} className="flex-1 from-primary to-primary/80 bg-gradient-to-br">
                Decode
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="output-text">Output</Label>
              <Textarea
                id="output-text"
                placeholder="Result will appear here..."
                value={output}
                readOnly
                className="min-h-[150px] bg-muted font-code"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end mt-4">
        <Button
          variant="outline"
          onClick={() => {
            setInput("");
            setOutput("");
          }}
        >
          Clear
        </Button>
      </div>
    </ToolLayout>
  );
}
