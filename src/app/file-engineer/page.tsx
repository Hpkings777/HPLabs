import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { HardHat } from "lucide-react";

export default function FileEngineer() {
  return (
    <ToolLayout
      title="File Engineer"
      description="Advanced file operations, conversions, and more."
    >
      <Card>
        <CardContent className="p-12 flex flex-col items-center justify-center text-center gap-4 min-h-[250px]">
          <HardHat className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold font-headline">
            Under Construction
          </h2>
          <p className="text-muted-foreground max-w-sm">
            This tool is currently being built. Please check back later for
            exciting new file manipulation capabilities!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
