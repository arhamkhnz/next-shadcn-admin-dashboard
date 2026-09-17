import Link from "next/link";

import { ArrowUpRight, StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getGitHubStarCount } from "@/lib/get-github-star-count";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";

export async function Intro() {
  const starCount = await getGitHubStarCount();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-balance font-medium text-3xl leading-snug tracking-tight" id="hero-title">
        A polished admin experience, thoughtfully designed and available across multiple stacks.
      </h1>

      <div className="flex flex-wrap gap-3">
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
            <span className="relative ms-1 px-2 font-medium text-muted-foreground text-xs before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-border">
              {starCount === null ? "—" : new Intl.NumberFormat("en-US").format(starCount)}
            </span>
          </a>
        </Button>
      </div>
    </div>
  );
}
