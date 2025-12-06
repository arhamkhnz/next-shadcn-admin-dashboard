import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { ThemeBootScript } from "@/scripts/theme-boot";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="light" data-theme-preset="default" suppressHydrationWarning>
      <head>
        {/* RootLayout stays static. Theme (mode + preset) is applied with this script to avoid extra RSC calls and cookie-based rerenders. */}
        <ThemeBootScript />
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <PreferencesStoreProvider themeMode="light" themePreset="default">
          {children}
          <Toaster />
        </PreferencesStoreProvider>
      </body>
    </html>
  );
}
