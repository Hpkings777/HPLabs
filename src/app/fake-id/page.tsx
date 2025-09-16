"use client";

import { useState, useEffect, type ReactNode } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateFakeId } from "@/lib/fake-data";
import { User, MapPin, Phone, Cake, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type FakeId = {
  name: string;
  address: string;
  phone: string;
  birthDate: string;
  email: string;
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        {value ? (
          <span className="font-medium">{value}</span>
        ) : (
          <Skeleton className="h-5 w-48 mt-1" />
        )}
      </div>
    </div>
  );
}

export default function FakeIdGenerator() {
  const [fakeId, setFakeId] = useState<FakeId | null>(null);

  const generateNewId = () => {
    setFakeId(generateFakeId());
  };

  useEffect(() => {
    generateNewId();
  }, []);

  return (
    <ToolLayout
      title="Fake ID Generator"
      description="Create random user data for testing and development purposes."
    >
      <Card>
        <CardHeader>
          <CardTitle>Generated Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DetailRow
            icon={<User className="h-5 w-5" />}
            label="Name"
            value={fakeId?.name}
          />
          <DetailRow
            icon={<MapPin className="h-5 w-5" />}
            label="Address"
            value={fakeId?.address}
          />
          <DetailRow
            icon={<Phone className="h-5 w-5" />}
            label="Phone"
            value={fakeId?.phone}
          />
          <DetailRow
            icon={<Cake className="h-5 w-5" />}
            label="Date of Birth"
            value={fakeId?.birthDate}
          />
          <DetailRow
            icon={<Mail className="h-5 w-5" />}
            label="Email"
            value={fakeId?.email}
          />
        </CardContent>
      </Card>
      <div className="flex justify-center mt-6">
        <Button onClick={generateNewId} size="lg">
          Generate New Identity
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-4 max-w-md mx-auto">
        Disclaimer: The data generated is completely random and fictitious. For
        development and testing purposes only.
      </p>
    </ToolLayout>
  );
}
