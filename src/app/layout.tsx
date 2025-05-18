import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { PROJECT_CONFIG } from "@/config/project-config";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: PROJECT_CONFIG.name,
  description: "",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
