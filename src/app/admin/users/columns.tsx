
"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Shield,
  ShieldOff,
  Sparkle,
  User as UserIcon,
  Coins,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { toggleAdmin, togglePremium, updateUserCredits } from "./actions";


function EditCreditsDialog({ user }: { user: UserProfile }) {
    const [open, setOpen] = useState(false);
    const [credits, setCredits] = useState(user.credits);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleSave = async () => {
      setIsLoading(true);
      try {
        await updateUserCredits(user.uid, credits);
        toast({ title: "Success", description: "User credits updated." });
        setOpen(false);
      } catch (error) {
        toast({ title: "Error", description: "Failed to update credits.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DialogTrigger asChild>
                <div className="flex items-center w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit Credits</span>
                </div>
            </DialogTrigger>
        </DropdownMenuItem>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Credits for {user.displayName}</DialogTitle>
            <DialogDescription>
              Adjust the credit balance for this user.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credits" className="text-right">
                Credits
              </Label>
              <Input
                id="credits"
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "displayName",
    header: "User",
    cell: ({ row }) => {
        const user = row.original;
        return (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user.photoURL ?? ""} />
                    <AvatarFallback><UserIcon /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Signed Up
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
        const formatted = date ? date.toLocaleDateString() : "N/A";
        return <div className="pl-4">{formatted}</div>
    }
  },
  {
    accessorKey: "isPremium",
    header: "Premium",
    cell: ({ row }) => {
        const isPremium = row.getValue("isPremium");
        return isPremium ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-muted-foreground" />;
    }
  },
  {
    accessorKey: "credits",
    header: "Credits",
    cell: ({ row }) => {
        return <div className="text-center">{row.getValue("credits")}</div>
    }
  },
  {
    accessorKey: "isAdmin",
    header: "Admin",
    cell: ({ row }) => {
        const isAdmin = row.getValue("isAdmin");
        return isAdmin ? <Badge variant="destructive">Admin</Badge> : <Badge variant="outline">User</Badge>;
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      const handleToggleAdmin = async () => {
        try {
            await toggleAdmin(user.uid, !user.isAdmin);
            toast({title: "Success", description: "Admin status updated."});
        } catch (e) {
            toast({title: "Error", description: "Failed to update admin status.", variant: "destructive"});
        }
      }
      
      const handleTogglePremium = async () => {
        try {
            await togglePremium(user.uid, !user.isPremium);
            toast({title: "Success", description: "Premium status updated."});
        } catch (e) {
            toast({title: "Error", description: "Failed to update premium status.", variant: "destructive"});
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleTogglePremium}>
              {user.isPremium ? <XCircle className="mr-2 h-4 w-4" /> : <Sparkle className="mr-2 h-4 w-4" />}
              {user.isPremium ? "Revoke Premium" : "Grant Premium"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleAdmin}>
                {user.isAdmin ? <ShieldOff className="mr-2 h-4 w-4" /> : <Shield className="mr-2 h-4 w-4" />}
                {user.isAdmin ? "Revoke Admin" : "Grant Admin"}
            </DropdownMenuItem>
             <DropdownMenuSeparator />
            <EditCreditsDialog user={user} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
