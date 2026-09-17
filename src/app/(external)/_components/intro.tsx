"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { ArrowUpRight, StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";
const repositoryStarsUrl = "https://api.github.com/repos/arhamkhnz/next-shadcn-admin-dashboard/stargazers/count";

type GitHubStarsResponse = {
  count: number;
};

export function Intro() {
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStarCount() {
      try {
        const response = await fetch(repositoryStarsUrl, {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2026-03-10",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as GitHubStarsResponse;

        if (Number.isFinite(data.count)) {
          setStarCount(data.count);
        }
      } catch {
        // Keep the neutral fallback when GitHub is unavailable.
      }
    }

    void loadStarCount();

    return () => controller.abort();
  }, []);

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <h1 className="text-balance font-medium text-2xl leading-snug tracking-tight sm:text-3xl" id="hero-title">
        A polished admin experience, thoughtfully designed and available across multiple stacks.
      </h1>

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
