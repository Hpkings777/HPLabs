"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GanttChartSquare } from "lucide-react";
import {
  mainNav,
  bottomNav,
  tools,
  categories,
  type Tool,
  type NavLink,
  type ToolCategory,
} from "@/lib/tools";

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

const NavItem = ({
  link,
  pathname,
}: {
  link: NavLink;
  pathname: string;
}) => (
  <SidebarMenuItem>
    <Link href={link.href} passHref>
      <SidebarMenuButton
        asChild
        isActive={pathname === link.href}
        tooltip={link.title}
      >
        <div>
          {link.icon}
          <span>{link.title}</span>
        </div>
      </SidebarMenuButton>
    </Link>
  </SidebarMenuItem>
);

const ToolItem = ({ tool, pathname }: { tool: Tool; pathname: string }) => (
  <SidebarMenuItem>
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
);

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
