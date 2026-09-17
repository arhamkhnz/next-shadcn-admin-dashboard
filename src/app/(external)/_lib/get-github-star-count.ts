const repositoryStarsUrl = "https://api.github.com/repos/arhamkhnz/next-shadcn-admin-dashboard/stargazers/count";

type GitHubStarsResponse = {
  count: number;
};

export async function getGitHubStarCount() {
  try {
    const response = await fetch(repositoryStarsUrl, {
      cache: "force-cache",
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GitHubStarsResponse;
    return data.count;
  } catch {
    return null;
  }
}
