"use client";

import { useTheme } from "next-themes";
import { ToolLayout } from "@/components/ToolLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paintbrush, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();

  return (
    <ToolLayout
      title="Settings"
      description="Customize your HP Labs experience."
    >
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Change the look and feel of the application. More themes coming
            soon!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4" />
                <span>Theme</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Select a theme for the dashboard.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="icon"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-5 w-5" />
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="icon"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
