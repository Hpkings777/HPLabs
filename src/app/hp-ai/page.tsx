
"use client";

import { useAuth } from "@/context/AuthContext";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sparkles, Lock } from "lucide-react";
import Link from "next/link";

export default function HPAIPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

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
        title="HP AI"
        description="Unlock the power of HP AI to enhance your images."
      >
        <div className="flex flex-col items-center justify-center text-center py-12 bg-card border rounded-lg shadow-lg">
            <div className="p-6 bg-primary/10 rounded-full mb-6">
                <Lock className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
                Please log in to access premium features.
            </p>
            <Button size="lg" asChild>
                <Link href="/login?redirect=/hp-ai">
                    Log In
                </Link>
            </Button>
        </div>
      </ToolLayout>
    );
  }

  if (!user.isPremium) {
     return (
      <ToolLayout
        title="HP AI"
        description="Unlock the power of HP AI to enhance your images."
      >
        <div className="flex flex-col items-center justify-center text-center py-12 bg-card border rounded-lg shadow-lg">
            <div className="p-6 bg-yellow-400/10 rounded-full mb-6">
                <Sparkles className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-2">Upgrade to Premium</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
                This tool is part of our premium suite. Upgrade your account to get exclusive access to AI-powered features.
            </p>
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold">
                Upgrade Now (Coming Soon)
            </Button>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="HP AI"
      description="Use AI to upscale and enhance your images."
    >
        <div className="flex flex-col items-center justify-center text-center py-12 bg-card border rounded-lg shadow-lg">
          <p className="text-muted-foreground">
            Premium feature coming soon! Upload an image and let our AI work its magic.
          </p>
        </div>
    </ToolLayout>
  );
}
