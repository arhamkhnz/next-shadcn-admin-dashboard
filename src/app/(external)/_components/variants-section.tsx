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
        <div className="grid grid-cols-[3rem_1fr] gap-8 py-24">
          <Badge className="size-10 rounded-full p-0 tabular-nums" variant="outline">
            2
          </Badge>

          <div>
            <h2 className="font-medium text-3xl tracking-tight" id="variants-title">
              Four foundations
            </h2>

            <div className="mt-14 flex flex-col gap-14">
              {variants.map((variant) => (
                <article className="max-w-2xl" key={variant.name}>
                  <a
                    className="inline-flex items-center gap-1.5 font-medium text-xl tracking-tight underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    href={variant.repository}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {variant.name}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                  <p className="mt-3 text-lg text-muted-foreground leading-8">{variant.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <Separator />
        <div className="flex flex-row items-center justify-between gap-6 pt-8 text-muted-foreground text-sm">
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
