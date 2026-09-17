"use client";

import Link from "next/link";

import { ArrowUpRight, StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useGitHubStarCount } from "../_hooks/use-github-star-count";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";

export function Intro() {
  const starCount = useGitHubStarCount();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-balance font-medium text-2xl leading-snug tracking-tight sm:text-3xl" id="hero-title">
          A polished admin dashboard built to fit your stack and the way you work.
        </h1>
        <p className="text-muted-foreground text-sm leading-6 sm:text-base">
          Choose Radix UI, Base UI, React Aria, or TanStack Start, all with the same polished experience.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button asChild>
          <Link href="/dashboard/default">
            Live demo
            <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        </Button>
        <Button asChild className="pe-0" variant="outline">
          <a href={repositoryUrl} target="_blank" rel="noreferrer">
            <StarIcon aria-hidden="true" data-icon="inline-start" />
            Star
            <span
              className="relative ms-1 px-2 font-medium text-muted-foreground text-xs before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border"
              aria-live="polite"
            >
              {starCount === null ? "—" : new Intl.NumberFormat("en-US").format(starCount)}
            </span>
          </a>
        </Button>
      </div>
    </div>
  );
}
