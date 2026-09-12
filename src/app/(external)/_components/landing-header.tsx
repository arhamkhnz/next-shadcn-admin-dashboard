import Link from "next/link";

import { ArrowUpRight, Code2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const repositoryUrl = "https://github.com/arhamkhnz/next-shadcn-admin-dashboard";

export function LandingHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link className="flex items-center gap-2.5 font-medium tracking-tight" href="/" aria-label="Studio Admin home">
          <span className="size-2 bg-orange-500" aria-hidden="true" />
          <span>Studio Admin</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
          <a className="transition-colors hover:text-foreground" href="#features">
            Features
          </a>
          <a className="transition-colors hover:text-foreground" href="#variants">
            Variants
          </a>
          <a className="transition-colors hover:text-foreground" href="#about">
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="icon" variant="ghost">
            <a href={repositoryUrl} target="_blank" rel="noreferrer" aria-label="View Studio Admin on GitHub">
              <Code2 aria-hidden="true" />
            </a>
          </Button>
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/dashboard/default">
              Explore demo
              <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
