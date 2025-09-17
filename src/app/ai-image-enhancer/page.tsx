"use client";

import { useAuth } from "@/context/AuthContext";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Lock, Sparkles } from "lucide-react";

export default function AiImageEnhancerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/ai-image-enhancer");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <ToolLayout
        title="AI Image Enhancer"
        description="This is a premium feature."
      >
        <div className="flex flex-col items-center justify-center text-center py-12">
           <LoadingSpinner /> 
        </div>
      </ToolLayout>
    );
  }

  if (!user.isPremium) {
     return (
      <ToolLayout
        title="AI Image Enhancer"
        description="Unlock the power of AI to enhance your images."
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
      title="AI Image Enhancer"
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
