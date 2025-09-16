"use client";

import { useState, useMemo, useTransition } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Sparkles, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { suggestPassword } from "@/ai/flows/password-suggestion-flow";

function Criteria({ check, text }: { check: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 transition-colors ${
        check ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {check ? (
        <CheckCircle className="w-4 h-4 text-chart-2" />
      ) : (
        <XCircle className="w-4 h-4" />
      )}
      <span>{text}</span>
    </div>
  );
}

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const { strength, strengthText, progressColor } = useMemo(() => {
    if (!password) {
      return { strength: 0, strengthText: "...", progressColor: "bg-muted" };
    }
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let text = "Very Weak";
    let color = "bg-red-500";
    if (score > 2) {
      text = "Weak";
      color = "bg-orange-500";
    }
    if (score > 3) {
      text = "Medium";
      color = "bg-yellow-500";
    }
    if (score > 4) {
      text = "Strong";
      color = "bg-green-500";
    }
    if (score > 5) {
      text = "Very Strong";
      color = "bg-emerald-500";
    }

    return { strength: score, strengthText: text, progressColor: color };
  }, [password]);

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  const handleSuggestPassword = () => {
    if (password.length > 0 && strength < 5) {
      startTransition(async () => {
        try {
          const result = await suggestPassword({ currentPassword: password });
          setPassword(result.suggestion);
          toast({
            title: "Password Suggestion",
            description: "Here is a stronger password suggestion.",
          });
        } catch (e) {
          toast({
            title: "Error",
            description: "Could not generate a password suggestion.",
            variant: "destructive",
          });
        }
      });
    } else if (strength >= 5) {
        toast({
            title: "Already Strong!",
            description: "Your current password is secure enough.",
        });
    } else {
      toast({
        title: "Input needed",
        description: "Please enter a password first.",
        variant: "destructive",
      })
    }
  };

  return (
    <ToolLayout
      title="Password Strength Checker"
      description="Analyze the strength of your password to ensure your accounts are secure."
    >
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password-input">Enter Password</Label>
              <Input
                id="password-input"
                type="text"
                placeholder="Type a password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-code"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Strength</span>
                <span className="text-sm font-bold">{strengthText}</span>
              </div>
              <Progress value={(strength / 6) * 100} className={`h-2 [&>div]:${progressColor}`} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm pt-4">
              <Criteria check={checks.length} text="At least 8 characters" />
              <Criteria check={checks.uppercase} text="Contains an uppercase letter" />
              <Criteria check={checks.lowercase} text="Contains a lowercase letter" />
              <Criteria check={checks.number} text="Contains a number" />
              <Criteria check={checks.symbol} text="Contains a symbol" />
            </div>
             <div className="pt-4">
              <Button onClick={handleSuggestPassword} disabled={isPending} className="w-full">
                {isPending ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isPending ? "Generating..." : "Suggest a Stronger Password"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
}
