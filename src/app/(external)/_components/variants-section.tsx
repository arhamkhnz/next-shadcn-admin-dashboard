import Link from "next/link";

import { ArrowRight, ArrowUpRight, Code2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const variants = [
  {
    name: "Radix UI",
    stack: "Next.js · shadcn/ui · Radix",
    description: "The primary edition and the only publicly hosted live demo.",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard",
    live: true,
  },
  {
    name: "Base UI",
    stack: "Next.js · shadcn/ui · Base UI",
    description: "The same product direction built on Base UI primitives.",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui",
    live: false,
  },
  {
    name: "React Aria",
    stack: "Next.js · shadcn/ui · React Aria",
    description: "An accessibility-focused implementation using React Aria components.",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard-aria",
    live: false,
  },
  {
    name: "TanStack Start",
    stack: "TanStack Start · shadcn/ui",
    description: "A framework variant for teams building with the TanStack ecosystem.",
    repository: "https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard",
    live: false,
  },
];

export function VariantsSection() {
  return (
    <>
      <section className="bg-muted/30" id="variants" aria-labelledby="variants-title">
        <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                02 / Choose your base
              </p>
            </div>
            <div className="lg:col-span-9">
              <h2
                className="max-w-4xl text-balance text-4xl leading-tight font-medium tracking-[-0.04em] sm:text-5xl lg:text-6xl"
                id="variants-title"
              >
                One design language, expressed through four foundations.
              </h2>
            </div>
          </div>

          <div className="mt-16 border-t border-border lg:mt-24">
            {variants.map((variant, index) => (
              <article
                className="group grid gap-6 border-b border-border py-8 lg:grid-cols-12 lg:items-center lg:py-10"
                key={variant.name}
              >
                <div className="flex items-center gap-5 lg:col-span-3">
                  <span className="text-xs text-muted-foreground">0{index + 1}</span>
                  <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{variant.name}</h3>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-sm font-medium">{variant.stack}</p>
                  <Badge className="mt-3 rounded-full" variant={variant.live ? "default" : "outline"}>
                    {variant.live ? "Live demo + source" : "Source available"}
                  </Badge>
                </div>
                <p className="max-w-md text-base leading-relaxed text-muted-foreground lg:col-span-4">
                  {variant.description}
                </p>
                <div className="flex items-center gap-2 lg:col-span-2 lg:justify-end">
                  {variant.live ? (
                    <Button asChild className="rounded-full" size="icon" variant="outline">
                      <Link href="/dashboard/default" aria-label="Open the Radix UI live demo">
                        <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </Button>
                  ) : null}
                  <Button asChild className="rounded-full" size="icon" variant="outline">
                    <a
                      href={variant.repository}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View the ${variant.name} source code`}
                    >
                      <Code2 aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border" id="about">
        <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-20 sm:px-8 sm:pt-28 lg:px-12 lg:pt-36">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">03 / Open source</p>
            </div>
            <div className="lg:col-span-9">
              <h2 className="max-w-5xl text-balance text-5xl leading-[0.95] font-medium tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                Start closer to done.
              </h2>
              <div className="mt-12 flex flex-col gap-8 border-t border-border pt-7 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Explore the public build, inspect every component, and shape Studio Admin around the product you are
                  making.
                </p>
                <Button asChild className="h-12 shrink-0 rounded-full px-6" size="lg">
                  <Link href="/dashboard/default">
                    Visit the dashboard
                    <ArrowRight aria-hidden="true" data-icon="inline-end" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>Studio Admin · Open-source dashboard template</p>
            <div className="flex gap-6">
              <a
                className="transition-colors hover:text-foreground"
                href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <Link className="transition-colors hover:text-foreground" href="/dashboard/default">
                Live demo
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
