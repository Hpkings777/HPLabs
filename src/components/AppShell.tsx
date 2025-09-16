"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Fingerprint,
  LockKeyhole,
  QrCode,
  FileCog,
  GanttChartSquare,
  Home,
  Hash,
} from "lucide-react";

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
} from "@/components/ui/sidebar";

const tools = [
  {
    title: "Home",
    href: "/",
    icon: <Home />,
  },
  {
    title: "Base64 Tool",
    href: "/base64",
    icon: <FileText />,
  },
  {
    title: "Fake ID Generator",
    href: "/fake-id",
    icon: <Fingerprint />,
  },
  {
    title: "Password Strength",
    href: "/password-strength",
    icon: <LockKeyhole />,
  },
  {
    title: "QR Code Generator",
    href: "/qr-generator",
    icon: <QrCode />,
  },
  {
    title: "File Engineer",
    href: "/file-engineer",
    icon: <FileCog />,
  },
  {
    title: "Hash Generator",
    href: "/hash-generator",
    icon: <Hash />,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.href}>
                  <Link href={tool.href} passHref>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === tool.href}
                      tooltip={tool.title}
                    >
                      <div>
                        {tool.icon}
                        <span>{tool.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <header className="md:hidden py-4 px-4 border-b">
            <SidebarTrigger />
          </header>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
