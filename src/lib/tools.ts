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
} from "lucide-react";
import type { ReactElement } from "react";

export type ToolCategory = "Security" | "Developer" | "Utility";

export interface Tool {
  title: string;
  description: string;
  href: string;
  icon: ReactElement<any, any>;
  category: ToolCategory;
}

export const tools: Tool[] = [
  {
    title: "Base64 Tool",
    description: "Encode and decode data between plain text and Base64.",
    href: "/base64",
    icon: <FileText className="w-8 h-8" />,
    category: "Developer",
  },
  {
    title: "Fake ID Generator",
    description: "Generate random user data for development and testing.",
    href: "/fake-id",
    icon: <Fingerprint className="w-8 h-8" />,
    category: "Utility",
  },
  {
    title: "Password Strength",
    description: "Check the strength of your password to enhance security.",
    href: "/password-strength",
    icon: <LockKeyhole className="w-8 h-8" />,
    category: "Security",
  },
  {
    title: "QR Code Generator",
    description: "Instantly create QR codes from text or URLs for easy sharing.",
    href: "/qr-generator",
    icon: <QrCode className="w-8 h-8" />,
    category: "Utility",
  },
  {
    title: "File Engineer",
    description: "Convert files to Base64 data URIs.",
    href: "/file-engineer",
    icon: <FileCog className="w-8 h-8" />,
    category: "Developer",
  },
  {
    title: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.",
    href: "/hash-generator",
    icon: <Hash className="w-8 h-8" />,
    category: "Security",
  },
];

export interface NavLink {
  title: string;
  href: string;
  icon: ReactElement<any, any>;
  isTool?: boolean;
}

export const mainNav: NavLink[] = [
  {
    title: "Home",
    href: "/",
    icon: <Home />,
    isTool: false,
  },
];

export const bottomNav: NavLink[] = [
    {
        title: "Settings",
        href: "/settings",
        icon: <Cog />,
        isTool: false,
    }
]

export const categories: ToolCategory[] = ["Developer", "Security", "Utility"];
