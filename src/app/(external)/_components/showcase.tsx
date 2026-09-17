import Link from "next/link";

import dashboardImage from "../../../../media/dashboard.png";
import { LandingThemeSwitcher } from "./landing-theme-switcher";

export function Showcase() {
  return (
    <>
      <header className="flex items-center justify-between gap-6">
        <div className="flex items-baseline gap-4">
          <Link className="font-medium text-base tracking-tight" href="/" aria-label="Studio Admin home">
            Studio Admin
          </Link>
          <span className="text-base text-muted-foreground">One design, many stacks</span>
        </div>
        <LandingThemeSwitcher />
      </header>
      <Link
        className="group block overflow-hidden rounded-lg border border-border bg-card"
        href="/dashboard/default"
        aria-label="Open the Studio Admin live demo"
      >
        {/* biome-ignore lint/performance/noImgElement: This landing image intentionally uses the native img element. */}
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
