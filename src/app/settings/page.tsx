"use client";

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
import { Paintbrush } from "lucide-react";

export default function SettingsPage() {
  const handleThemeChange = (theme: string) => {
    // TODO: Implement theme switching logic
    console.log("Theme selected:", theme);
  };

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
            <Select onValueChange={handleThemeChange} defaultValue="system">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system" disabled>
                  System
                </SelectItem>
                <SelectItem value="cyberpunk" disabled>
                  Cyberpunk
                </SelectItem>
                <SelectItem value="liquid-glass" disabled>
                  Liquid Glass
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
