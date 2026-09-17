import Link from "next/link";

import { Separator } from "@/components/ui/separator";

import { Footer } from "./_components/footer";
import { Intro } from "./_components/intro";
import { LandingThemeSwitcher } from "./_components/landing-theme-switcher";
import { Overview } from "./_components/overview";
import { Showcase } from "./_components/showcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground" data-landing-page>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 sm:gap-8 sm:p-6 md:p-8">
        <header className="flex items-start justify-between gap-4 sm:items-center sm:gap-6">
          <Link className="font-medium text-base tracking-tight" href="/" aria-label="Studio Admin home">
            Studio Admin
          </Link>
          <LandingThemeSwitcher />
        </header>
        <Intro />
        <Showcase />
        <Separator />
        <Overview />
        <Separator />
        <Footer />
      </div>
    </main>
  );
}
