import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import { GitHubStarButton } from "./github-star-button";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";
const repositoryStarsUrl = "https://api.github.com/repos/arhamkhnz/next-shadcn-admin-dashboard/stargazers/count";

type GitHubStarsResponse = {
  count: number;
};

async function getGitHubStarCount() {
  try {
    const response = await fetch(repositoryStarsUrl, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "arhamkhnz-studio-admin",
        "X-GitHub-Api-Version": "2026-03-10",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as GitHubStarsResponse;
    return Number.isFinite(data.count) ? data.count : null;
  } catch {
    return null;
  }
}

export async function Intro() {
  const starCount = await getGitHubStarCount();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h1 className="text-balance font-medium text-2xl leading-snug tracking-tight sm:text-3xl" id="hero-title">
          Um painel administrativo caprichado que se adapta à sua stack e ao seu jeito de trabalhar.
        </h1>
        <p className="text-muted-foreground text-sm leading-6 sm:text-base">
          Escolha Radix UI, Base UI, React Aria ou TanStack Start, todos com a mesma experiência caprichada.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button asChild>
          <Link href="/dashboard/default" prefetch={false}>
            Demonstração
            <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
          </Link>
        </Button>
        <GitHubStarButton initialCount={starCount} repositoryUrl={repositoryUrl} />
      </div>
    </div>
  );
}
