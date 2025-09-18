
"use client";

import { useAuth } from "@/context/AuthContext";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Sparkles, Lock } from "lucide-react";
import Link from "next/link";

export default function PhorixPage() {
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
        title="Phorix"
        description="Phorix is the next-generation AI created by HP Labs, designed to think beyond boundaries."
      >
        <div className="flex flex-col items-center justify-center text-center py-12 bg-card border rounded-lg shadow-lg">
            <div className="p-6 bg-primary/10 rounded-full mb-6">
                <Lock className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
                Please log in to access Phorix.
            </p>
            <Button size="lg" asChild>
                <Link href="/login?redirect=/phorix">
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
        title="Phorix"
        description="Phorix is the next-generation AI created by HP Labs, designed to think beyond boundaries."
      >
        <div className="flex flex-col items-center justify-center text-center py-12 bg-card border rounded-lg shadow-lg">
            <div className="p-6 bg-yellow-400/10 rounded-full mb-6">
                <Sparkles className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold font-headline mb-2">Upgrade to Premium</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
                Phorix is a premium AI. Upgrade your account to get exclusive access.
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
      title="Phorix"
      description="Phorix is the next-generation AI created by HP Labs, designed to think beyond boundaries."
    >
        <div className="flex flex-col items-center justify-center text-center py-12 bg-card border rounded-lg shadow-lg">
          <p className="text-muted-foreground">
            Phorix is coming soon! This is where all premium AI features will live.
          </p>
        </div>
    </ToolLayout>
  );
}
