import Link from "next/link";

import dashboardImage from "../../../../media/dashboard.png";
import { LandingThemeSwitcher } from "./landing-theme-switcher";

export function Showcase() {
  return (
    <>
      <header className="flex items-start justify-between gap-4 sm:items-center sm:gap-6">
        <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
          <Link
            className="shrink-0 font-medium text-base leading-none tracking-tight sm:leading-normal"
            href="/"
            aria-label="Studio Admin home"
          >
            Studio Admin
          </Link>
          <span className="text-muted-foreground text-sm leading-none sm:text-base sm:leading-normal">
            One design, many stacks
          </span>
        </div>
        <LandingThemeSwitcher />
      </header>
      <Link
        className="group block overflow-hidden rounded-lg border border-border bg-card"
        href="/dashboard/default"
        aria-label="Open the Studio Admin live demo"
      >
        {/* biome-ignore lint/performance/noImgElement: This landing image is optimized separately. */}
        <img
          alt="Studio Admin interface showing dashboard, authentication, and layout customization screens"
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.01]"
          height={dashboardImage.height}
          src={dashboardImage.src}
          width={dashboardImage.width}
        />
      </Link>
    </>
  );
}
