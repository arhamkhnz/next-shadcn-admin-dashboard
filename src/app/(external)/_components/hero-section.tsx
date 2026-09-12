import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight, Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import dashboardImage from "../../../../media/dashboard.png";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
        <div className="grid border border-border bg-muted/30 lg:grid-cols-12">
          <div className="flex min-h-[480px] flex-col justify-between border-b border-border p-6 sm:p-10 lg:col-span-7 lg:min-h-[620px] lg:border-r lg:border-b-0 lg:p-14">
            <div className="flex items-center justify-between gap-5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span>Open-source admin system</span>
              <span>Est. 2024</span>
            </div>

            <div className="py-16 sm:py-24 lg:py-16">
              <p className="mb-6 text-sm text-muted-foreground">Studio / 01</p>
              <h1
                className="max-w-4xl text-balance text-5xl leading-[1.02] font-medium tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-8xl"
                id="hero-title"
              >
                A dashboard foundation designed to be changed.
              </h1>
            </div>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Start with a polished interface, then make every screen, component, theme, and workflow your own.
            </p>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-5 lg:p-14">
            <div>
              <p className="max-w-lg text-2xl leading-snug tracking-[-0.025em] sm:text-3xl">
                Built for real admin products—not just a collection of disconnected cards.
              </p>
              <div className="mt-8 border-t border-border pt-6">
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui, with four maintained implementations to match
                  the foundation your team prefers.
                </p>
              </div>
            </div>

            <div className="mt-16 flex flex-wrap gap-3 lg:mt-10">
              <Button asChild className="h-11 px-5" size="lg">
                <Link href="/dashboard/default">
                  Open live demo
                  <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild className="h-11 px-5" size="lg" variant="outline">
                <a href={repositoryUrl} target="_blank" rel="noreferrer">
                  <Code2 aria-hidden="true" data-icon="inline-start" />
                  View source
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div className="mb-6 grid gap-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground sm:grid-cols-2">
            <span>Selected interface / Radix UI</span>
            <span className="sm:text-right">The public edition</span>
          </div>
          <Link
            className="group relative block overflow-hidden border border-border bg-card"
            href="/dashboard/default"
            aria-label="Open the Studio Admin live demo"
          >
            <Image
              alt="Studio Admin interface showing dashboard, authentication, and layout customization screens"
              className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
              placeholder="blur"
              priority
              sizes="(max-width: 768px) 100vw, 1440px"
              src={dashboardImage}
            />
            <span className="absolute right-4 bottom-4 grid size-12 place-items-center border border-border bg-background/95 backdrop-blur sm:right-7 sm:bottom-7 sm:size-14">
              <ArrowUpRight
                className="size-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
