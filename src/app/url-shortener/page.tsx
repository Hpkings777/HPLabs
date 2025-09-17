
"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, Check, Clipboard } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { shortenUrl } from "@/ai/flows/shorten-url-flow";

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setShortUrl("");

    try {
      const result = await shortenUrl({ longUrl });
      if (result.error) {
        throw new Error(result.error);
      }
      const fullShortUrl = `${window.location.origin}/${result.shortId}`;
      setShortUrl(fullShortUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Could not shorten the URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
          title: "Copied!",
          description: "Short URL copied to clipboard.",
        });
      });
    }
  };

  return (
    <ToolLayout
      title="URL Shortener"
      description="Create short, shareable links from long URLs."
    >
      <Card>
        <CardHeader>
          <CardTitle>Shorten a Long URL</CardTitle>
          <CardDescription>
            Enter a long URL to create a short version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/very/long/url/to/shorten"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="w-40">
                {isLoading ? <LoadingSpinner /> : "Shorten URL"}
              </Button>
            </div>
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Your short link:</p>
              <div className="flex items-center gap-4">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary hover:underline flex-1 truncate"
                >
                  {shortUrl}
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyToClipboard}
                >
                  {isCopied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clipboard className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
