
"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ToolLayout } from "@/components/ToolLayout";
import { getAllUsers } from "./actions";
import { UserProfile } from "@/context/AuthContext";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminUsersPage() {
  const { user, authLoading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.isAdmin) {
      async function getUsers() {
          try {
            const fetchedUsers = await getAllUsers();
            // Ensure createdAt is a Date object for client-side sorting/filtering
            const formattedUsers = fetchedUsers.map(u => ({
              ...u,
              createdAt: u.createdAt ? new Date(u.createdAt) : new Date(0),
            })) as unknown as UserProfile[];
            setUsers(formattedUsers);
          } catch (error) {
              console.error("Failed to fetch users", error);
          } finally {
              setIsLoading(false);
          }
      }
      getUsers();
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

  return (
    <ToolLayout
      title="User Management"
      description="View, manage, and edit all users in the application."
    >
        <div className="container mx-auto py-10">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
                <LoadingSpinner/>
            </div>
          ) : (
            <DataTable columns={columns} data={users} />
          )}
        </div>
    </ToolLayout>
  );
}
