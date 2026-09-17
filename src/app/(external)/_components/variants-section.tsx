import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const variants = [
  {
    name: "Radix UI",
    description: "The primary Studio Admin edition and the publicly hosted live demo.",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard",
  },
  {
    name: "Base UI",
    description: "The same dashboard direction built on Base UI primitives.",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui",
  },
  {
    name: "React Aria",
    description: "An accessibility-focused edition built with React Aria components.",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard-aria",
  },
  {
    name: "TanStack Start",
    description: "A framework variant for teams building in the TanStack ecosystem.",
    repository: "https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard",
  },
];

export function VariantsSection() {
  return (
    <>
      <section id="variants" aria-labelledby="variants-title">
        <Separator />
        <div className="grid gap-8 py-20 sm:grid-cols-[3rem_1fr] sm:gap-8 sm:py-24">
          <Badge className="size-10 rounded-full p-0 tabular-nums" variant="outline">
            2
          </Badge>

          <div>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl" id="variants-title">
              Four foundations
            </h2>

            <div className="mt-12 space-y-12 sm:mt-14 sm:space-y-14">
              {variants.map((variant) => (
                <article className="max-w-2xl" key={variant.name}>
                  <a
                    className="inline-flex items-center gap-1.5 text-lg font-medium tracking-tight underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground sm:text-xl"
                    href={variant.repository}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {variant.name}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                  <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                    {variant.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="pb-10 sm:pb-12">
        <Separator />
        <div className="flex flex-col gap-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Studio Admin · Open-source dashboard template</p>
          <div className="flex items-center gap-5">
            <Button asChild size="sm" variant="ghost">
              <Link href="/dashboard/default">Live demo</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <a href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard" target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}
