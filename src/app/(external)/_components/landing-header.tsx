import Link from "next/link";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";

export function LandingHeader() {
  return (
    <header className="flex items-center gap-6 py-10 text-sm sm:gap-8 sm:py-12">
      <Link className="font-medium tracking-tight" href="/" aria-label="Studio Admin home">
        Studio Admin
      </Link>
      <a
        className="text-muted-foreground transition-colors hover:text-foreground"
        href={repositoryUrl}
        target="_blank"
        rel="noreferrer"
      >
        Open source
      </a>
    </header>
  );
}
