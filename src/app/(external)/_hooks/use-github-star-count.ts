"use client";

import { useEffect, useState } from "react";

const repositoryStarsUrl = "https://api.github.com/repos/arhamkhnz/next-shadcn-admin-dashboard/stargazers/count";

type GitHubStarsResponse = {
  count: number;
};

export function useGitHubStarCount() {
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
        return;
      }
    }

    void loadStarCount();

    return () => controller.abort();
  }, []);

  return starCount;
}
