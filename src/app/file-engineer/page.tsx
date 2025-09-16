"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Clipboard, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function FileEngineer() {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result;
        if (typeof result === "string") {
          setBase64(result);
        }
      };
      reader.onerror = () => {
        toast({
          title: "File Read Error",
          description: "Could not read the selected file.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCopyToClipboard = () => {
    if (base64) {
      navigator.clipboard.writeText(base64).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Copied!",
          description: "Base64 data URI copied to clipboard.",
        });
      });
    }
  };

  const clearAll = () => {
    setFile(null);
    setBase64("");
    const fileInput = document.getElementById("file-upload") as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  }

  return (
    <ToolLayout
      title="File Engineer"
      description="Convert files into Base64 data URIs."
    >
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p className="text-xs text-muted-foreground">
                  Any file type, up to 10MB
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {file && (
              <p className="text-sm text-center text-muted-foreground pt-2">
                Selected file: <span className="font-medium">{file.name}</span> ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>

          {base64 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Base64 Data URI</label>
                <Button variant="ghost" size="sm" onClick={handleCopyToClipboard}>
                  {isCopied ? (
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                  ) : (
                    <Clipboard className="w-4 h-4 mr-2" />
                  )}
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              </div>
              <Textarea
                value={base64}
                readOnly
                className="min-h-[150px] font-code bg-muted"
                placeholder="Base64 output will appear here"
              />
            </div>
          )}
           <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={clearAll}
              >
                Clear
              </Button>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
