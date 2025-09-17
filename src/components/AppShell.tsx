"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GanttChartSquare, User } from "lucide-react";
import {
  mainNav,
  bottomNav,
  tools,
  categories,
  type Tool,
  type NavLink,
  type ToolCategory,
} from "@/lib/tools";
import { useAuth } from "@/context/AuthContext";

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";

const NavItem = ({
  link,
  pathname,
}: {
  link: NavLink;
  pathname: string;
}) => {
  const Icon = link.icon;
  return (
    <SidebarMenuItem>
      <Link href={link.href} passHref>
        <SidebarMenuButton
          asChild
          isActive={pathname === link.href}
          tooltip={link.title}
        >
          <div>
            <Icon />
            <span>{link.title}</span>
          </div>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};

const ToolItem = ({ tool, pathname }: { tool: Tool; pathname: string }) => {
  const Icon = tool.icon;
  return (
    <SidebarMenuItem>
      <Link href={tool.href} passHref>
        <SidebarMenuButton
          asChild
          isActive={pathname === tool.href}
          tooltip={tool.title}
        >
          <div>
            <Icon />
            <span>{tool.title}</span>
          </div>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  )
};

function UserNav() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? "User"} />
            <AvatarFallback>
              {user.email?.[0].toUpperCase() ?? <User />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName ?? 'Anonymous'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const toolsByCategory = categories.map((category) => ({
    category,
    tools: tools.filter((tool) => tool.category === category),
  }));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarHeader>
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="HP Labs Home"
              >
                <GanttChartSquare className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold font-headline text-foreground">
                  HP Labs
                </span>
              </Link>
            </SidebarHeader>
            <SidebarMenu className="flex-1">
              {mainNav.map((link) => (
                <NavItem key={link.href} link={link} pathname={pathname} />
              ))}
              <SidebarSeparator />
              {toolsByCategory.map(({ category, tools }) => (
                <SidebarGroup key={category}>
                  <SidebarGroupLabel>{category}</SidebarGroupLabel>
                  {tools.map((tool) => (
                    <ToolItem key={tool.href} tool={tool} pathname={pathname} />
                  ))}
                </SidebarGroup>
              ))}
            </SidebarMenu>
            <SidebarSeparator />
            <SidebarFooter>
              <SidebarMenu>
                {bottomNav.map((link) => (
                  <NavItem key={link.href} link={link} pathname={pathname} />
                ))}
              </SidebarMenu>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
           <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-background px-6">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="flex-1" />
            <UserNav />
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
