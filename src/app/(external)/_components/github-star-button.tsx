"use client";

import { StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useGitHubStarCount } from "../_hooks/use-github-star-count";

type GitHubStarButtonProps = {
  initialCount: number | null;
  repositoryUrl: string;
};

export function GitHubStarButton({ initialCount, repositoryUrl }: GitHubStarButtonProps) {
  const starCount = useGitHubStarCount(initialCount);

  return (
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
  );
}
