import Link from "next/link";

import dashboardImage from "../../../../media/dashboard.png";

export function Showcase() {
  return (
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
  );
}
