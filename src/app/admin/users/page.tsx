
import "server-only";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as admin from "firebase-admin";

import { ToolLayout } from "@/components/ToolLayout";
import { getAllUsers } from "@/lib/firebase-admin";
import { UserProfile } from "@/context/AuthContext";
import { columns } from "./columns";
import { DataTable } from "./data-table";

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

async function getUsers(): Promise<UserProfile[]> {
  const users = await getAllUsers();
  return users.map(u => ({...u, createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date(0).toISOString()})) as unknown as UserProfile[];
}

export default async function AdminUsersPage() {
  const isAdmin = await getAdminStatus();
  if (!isAdmin) {
    redirect("/");
  }

  const users = await getUsers();

  return (
    <ToolLayout
      title="User Management"
      description="View, manage, and edit all users in the application."
    >
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={users} />
        </div>
    </ToolLayout>
  );
}
