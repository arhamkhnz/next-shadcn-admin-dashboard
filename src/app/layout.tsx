import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { PROJECT_CONFIG } from "@/config/project-config";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: PROJECT_CONFIG.name,
  description: "",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="dark" lang="en">
      <ToastProvider>
        <body className={`${inter.className} min-h-screen`}>
          {children}
          <Toaster />
        </body>
      </ToastProvider>
    </html>
  );
}
