import Link from "next/link";

const includedScreens = [
  { name: "Analytics", href: "/dashboard/analytics" },
  { name: "CRM", href: "/dashboard/crm" },
  { name: "Finance", href: "/dashboard/finance" },
  { name: "E-commerce", href: "/dashboard/ecommerce" },
  { name: "Productivity", href: "/dashboard/productivity" },
  { name: "File manager", href: "/dashboard/file-manager" },
  { name: "Calendar", href: "/dashboard/calendar" },
];

const editions = [
  {
    name: "Radix UI",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard",
  },
  {
    name: "Base UI",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui",
  },
  {
    name: "React Aria",
    repository: "https://github.com/arhamkhnz/next-shadcn-admin-dashboard-aria",
  },
  {
    name: "TanStack Start",
    repository: "https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard",
  },
];

export function Overview() {
  return (
    <section aria-labelledby="overview-title">
      <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-16">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <p className="font-medium text-muted-foreground text-xs">About</p>
            <h2 className="text-pretty text-xl leading-7 tracking-tight" id="overview-title">
              Studio Admin is an open-source admin dashboard template with configurable layouts, customizable themes,
              and editions built on multiple React UI foundations.
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-medium text-muted-foreground text-xs">My approach</p>
            <p className="font-medium text-primary text-sm">“One design, many stacks.”</p>
            <p className="text-muted-foreground text-sm leading-6">
              Each edition keeps the same visual language while staying native to its framework and component
              foundation.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-medium text-muted-foreground text-xs">Designed to adapt</p>
            <p className="text-muted-foreground text-sm leading-6">
              Every screen is built with standard shadcn/ui components kept intact, so the foundation stays familiar and
              easy to adapt. Four visual presets and configurable page and sidebar layouts let you shape it around your
              use case.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-muted-foreground text-xs">25+ screens</h3>
            <ul className="flex flex-col gap-1 text-sm">
              {includedScreens.map((screen) => (
                <li key={screen.name}>
                  <Link
                    className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    href={screen.href}
                  >
                    {screen.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground text-xs">More coming.</p>
          </div>

          <div className="flex flex-col gap-4" id="variants">
            <h3 className="font-medium text-muted-foreground text-xs">Editions</h3>
            <ul className="flex flex-col gap-1 text-sm">
              {editions.map((edition) => (
                <li key={edition.name}>
                  <a
                    className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    href={edition.repository}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {edition.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
