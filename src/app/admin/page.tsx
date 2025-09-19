
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as admin from "firebase-admin";

import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Link as LinkIcon, LineChart } from "lucide-react";
import { getTotalUserCount, getTotalLinkCount, getUserActivity, getLinkActivity } from "@/lib/firebase-admin";
import { Button } from "@/components/ui/button";
import Link from "next/link";


async function getAdminStatus() {
  const sessionCookie = cookies().get("session")?.value || "";
  if (!sessionCookie) return false;

  try {
    if (!admin.apps.length) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.isAdmin === true;
  } catch (error) {
    return false;
  }
}

export default async function AdminPage() {
  const isAdmin = await getAdminStatus();

  if (!isAdmin) {
    redirect("/");
  }

  const [userCount, linkCount, userActivity, linkActivity] = await Promise.all([
    getTotalUserCount(),
    getTotalLinkCount(),
    getUserActivity(),
    getLinkActivity(),
  ]);
  
  const formattedUserActivity = userActivity.map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}));
  const formattedLinkActivity = linkActivity.map(d => ({...d, date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}));

  return (
    <ToolLayout
      title="Admin Dashboard"
      description="Manage users and application settings."
    >
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

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <LineChart className="h-5 w-5"/>
                            User Activity (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={formattedUserActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="hsl(var(--primary))" name="New Users" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                           <LineChart className="h-5 w-5"/>
                            Link Creation (Last 7 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={formattedLinkActivity}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="hsl(var(--accent))" name="New Links" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    </ToolLayout>
  );
}
