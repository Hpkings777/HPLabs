"use client";

import { useAuth } from "@/context/AuthContext";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Lock } from "lucide-react";

export default function AiImageEnhancerPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
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
        description="This is a premium feature."
      >
        <div className="flex flex-col items-center justify-center text-center py-12">
            <Lock className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">This tool is available for selected premium users only.</p>
            <Button asChild>
                <Link href="/">Back to Home</Link>
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
      <Card>
        <CardHeader>
          <CardTitle>Enhance Your Image</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Premium feature coming soon! Upload an image and let our AI work its magic.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
