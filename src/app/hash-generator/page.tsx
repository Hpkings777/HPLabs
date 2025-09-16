"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, Check } from "lucide-react";
import CryptoJS from "crypto-js";

type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";

const hashAlgorithms: HashAlgorithm[] = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-512",
];

function HashOutput({
  label,
  value,
}: {
  label: HashAlgorithm;
  value: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: `${label} Hash Copied!`,
      });
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`hash-output-${label}`}>{label}</Label>
      <div className="relative">
        <Textarea
          id={`hash-output-${label}`}
          value={value}
          readOnly
          className="pr-12 font-code bg-muted h-auto"
          rows={label === 'SHA-512' ? 4 : (label === 'SHA-256' ? 3 : 2)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={handleCopy}
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Clipboard className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function HashGenerator() {
  const [input, setInput] = useState("Hello, World!");
  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithm | "All">(
    "All"
  );

  const hashes = useMemo(() => {
    if (!input) return null;
    return {
      MD5: CryptoJS.MD5(input).toString(),
      "SHA-1": CryptoJS.SHA1(input).toString(),
      "SHA-256": CryptoJS.SHA256(input).toString(),
      "SHA-512": CryptoJS.SHA512(input).toString(),
    };
  }, [input]);

  const visibleAlgorithms =
    selectedAlgo === "All"
      ? hashAlgorithms
      : ([selectedAlgo] as HashAlgorithm[]);

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate various types of hashes from your text input."
    >
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input-text">Input Text</Label>
            <Textarea
              id="input-text"
              placeholder="Type or paste your content here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="algo-select">Hash Algorithm</Label>
            <Select
              onValueChange={(value) =>
                setSelectedAlgo(value as HashAlgorithm | "All")
              }
              defaultValue="All"
            >
              <SelectTrigger id="algo-select" className="w-full">
                <SelectValue placeholder="Select an algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {hashAlgorithms.map((algo) => (
                  <SelectItem key={algo} value={algo}>
                    {algo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hashes && (
            <div className="space-y-4 pt-4 border-t">
              {visibleAlgorithms.map((algo) => (
                <HashOutput key={algo} label={algo} value={hashes[algo]} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
