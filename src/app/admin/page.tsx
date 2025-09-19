
"use client";

import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminCharts } from "./charts";
import { useEffect, useState } from "react";
import { getTotalUserCount, getTotalLinkCount, getUserActivity, getLinkActivity } from "@/lib/firebase-admin";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type ActivityData = {
  date: string;
  count: number;
};

export default function AdminPage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [userCount, setUserCount] = useState<number | null>(null);
  const [linkCount, setLinkCount] = useState<number | null>(null);
  const [userActivity, setUserActivity] = useState<ActivityData[] | null>(null);
  const [linkActivity, setLinkActivity] = useState<ActivityData[] | null>(null);

  useEffect(() => {
    if (!authLoading && user?.isAdmin) {
      const fetchData = async () => {
        const [uCount, lCount, uActivity, lActivity] = await Promise.all([
          getTotalUserCount(),
          getTotalLinkCount(),
          getUserActivity(),
          getLinkActivity(),
        ]);
        setUserCount(uCount);
        setLinkCount(lCount);
        const formattedUserActivity = uActivity.map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}));
        const formattedLinkActivity = lActivity.map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}));
        setUserActivity(formattedUserActivity);
        setLinkActivity(formattedLinkActivity);
      };
      fetchData();
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    redirect("/");
    return null;
  }

  const isLoadingData = userCount === null || linkCount === null || userActivity === null || linkActivity === null;

  return (
    <ToolLayout
      title="Admin Dashboard"
      description="Manage users and application settings."
    >
      {isLoadingData ? (
        <div className="flex justify-center items-center h-96">
            <LoadingSpinner/>
        </div>
      ) : (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">Total registered users</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{linkCount}</div>
                        <p className="text-xs text-muted-foreground">Total links shortened</p>
                    </CardContent>
                </Card>
                 <Card className="col-span-1 md:col-span-2">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground mb-4">View, edit, and manage all users.</p>
                       <Button asChild>
                           <Link href="/admin/users">Go to User Management</Link>
                       </Button>
                    </CardContent>
                </Card>
            </div>

            <AdminCharts userActivity={userActivity!} linkActivity={linkActivity!} />
        </div>
      )}
    </ToolLayout>
  );
}
