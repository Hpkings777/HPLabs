"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, QrCode as QrCodeIcon, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://firebase.google.com/");
  const [submittedText, setSubmittedText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const generateQrCode = (currentText: string) => {
    if (!currentText) {
      toast({
        title: "Input Required",
        description: "Please enter text or a URL to generate a QR code.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSubmittedText(currentText);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
      currentText
    )}`;
    setQrCodeUrl(url);
  };

  const handleGenerateClick = () => {
    generateQrCode(text);
  };

  const downloadQrCode = () => {
    if (!qrCodeUrl) return;
    fetch(qrCodeUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() =>
        toast({
          title: "Download Failed",
          description: "Could not download the QR code. Please try again.",
          variant: "destructive",
        })
      );
  };

  useEffect(() => {
    generateQrCode(text);
  }, []);

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create QR codes from any text or URL instantly."
    >
      <Card>
        <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div>
              <Label htmlFor="qr-text">Text or URL</Label>
              <Input
                id="qr-text"
                placeholder="e.g., https://example.com"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateClick()}
              />
            </div>
            <Button
              onClick={handleGenerateClick}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <QrCodeIcon className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Generating..." : "Generate QR Code"}
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-64 h-64 border rounded-lg p-2 bg-white flex items-center justify-center">
              {isLoading || !qrCodeUrl ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <Image
                  key={submittedText}
                  src={qrCodeUrl}
                  alt={`QR Code for ${submittedText}`}
                  width={240}
                  height={240}
                  className="object-contain"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIsLoading(false);
                    toast({
                      title: "Error",
                      description: "Failed to load QR code image.",
                      variant: "destructive",
                    });
                  }}
                />
              )}
            </div>
            {qrCodeUrl && !isLoading && (
              <Button variant="outline" onClick={downloadQrCode}>
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
