
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ToolLayout } from "@/components/ToolLayout";

export default function AdminPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <ToolLayout
      title="Admin Dashboard"
      description="Manage users and application settings."
    >
        <div>
            <p>Welcome to the Admin Dashboard, {user.displayName}.</p>
            <p>More features coming soon!</p>
        </div>
    </ToolLayout>
  );
}
