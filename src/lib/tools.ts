import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Fingerprint,
  LockKeyhole,
  QrCode,
  FileCog,
  Hash,
  Cog,
  Home,
  User,
  Wand2,
  Link,
} from "lucide-react";

export type ToolCategory = "Security" | "Developer" | "Utility" | "Premium";

export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: ToolCategory;
  isPremium?: boolean;
}

export const tools: Tool[] = [
  {
    title: "HP AI",
    description: "Use AI to upscale and enhance your images. (Premium)",
    href: "/hp-ai",
    icon: Wand2,
    category: "Premium",
    isPremium: true,
  },
  {
    title: "Base64 Tool",
    description: "Encode and decode data between plain text and Base64.",
    href: "/base64",
    icon: FileText,
    category: "Developer",
  },
  {
    title: "URL Shortener",
    description: "Create short, shareable links from long URLs.",
    href: "/url-shortener",
    icon: Link,
    category: "Utility",
  },
  {
    title: "Fake ID Generator",
    description: "Generate random user data for development and testing.",
    href: "/fake-id",
    icon: Fingerprint,
    category: "Utility",
  },
  {
    title: "Password Strength",
    description: "Check the strength of your password to enhance security.",
    href: "/password-strength",
    icon: LockKeyhole,
    category: "Security",
  },
  {
    title: "QR Code Generator",
    description: "Instantly create QR codes from text or URLs for easy sharing.",
    href: "/qr-generator",
    icon: QrCode,
    category: "Utility",
  },
  {
    title: "File Engineer",
    description: "Convert files to Base64 data URIs.",
    href: "/file-engineer",
    icon: FileCog,
    category: "Developer",
  },
  {
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.",
    href: "/hash-generator",
    icon: Hash,
    category: "Security",
  },
];

export interface NavLink {
  title: string;
  href: string;
  icon: LucideIcon;
  isTool?: boolean;
}

export const mainNav: NavLink[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    isTool: false,
  },
];

export const bottomNav: NavLink[] = [
    {
        title: "Settings",
        href: "/settings",
        icon: Cog,
        isTool: false,
    }
]

export const categories: ToolCategory[] = ["Premium", "Developer", "Security", "Utility"];
