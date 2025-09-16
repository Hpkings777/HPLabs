import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolCard } from "@/components/ToolCard";
import {
  FileText,
  Fingerprint,
  LockKeyhole,
  QrCode,
  FileCog,
} from "lucide-react";

const tools = [
  {
    title: "Base64 Tool",
    description: "Encode and decode data between plain text and Base64.",
    href: "/base64",
    icon: <FileText className="w-8 h-8" />,
  },
  {
    title: "Fake ID Generator",
    description: "Generate random user data for development and testing.",
    href: "/fake-id",
    icon: <Fingerprint className="w-8 h-8" />,
  },
  {
    title: "Password Strength",
    description: "Check the strength of your password to enhance security.",
    href: "/password-strength",
    icon: <LockKeyhole className="w-8 h-8" />,
  },
  {
    title: "QR Code Generator",
    description: "Instantly create QR codes from text or URLs for easy sharing.",
    href: "/qr-generator",
    icon: <QrCode className="w-8 h-8" />,
  },
  {
    title: "File Engineer",
    description: "Advanced file operations and manipulations. Coming soon!",
    href: "/file-engineer",
    icon: <FileCog className="w-8 h-8" />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 md:px-6 py-16">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
              Welcome to Tool Hub
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A curated collection of handy utilities to streamline your tasks.
              From developers to everyday users, there's a tool for everyone.
            </p>
          </section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
