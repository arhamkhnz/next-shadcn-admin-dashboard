import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";

export function HeroSection() {
  return (
    <section
      className="flex min-h-[34rem] flex-col justify-end pb-20 sm:min-h-[42rem] sm:pb-24"
      aria-labelledby="hero-title"
    >
      <h1
        className="max-w-2xl text-balance text-2xl leading-snug font-medium tracking-tight sm:text-3xl"
        id="hero-title"
      >
        Studio Admin is an open-source dashboard built for teams that want a polished starting point without giving up
        control.
      </h1>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg" variant="outline">
          <Link href="/dashboard/default">
            Live demo
            <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="#features">Features</a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href="#variants">Variants</a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            Source
          </a>
        </Button>
      </div>
    </section>
  );
}
