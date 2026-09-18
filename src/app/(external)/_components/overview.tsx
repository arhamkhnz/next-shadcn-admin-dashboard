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
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:gap-16">
        <div className="flex flex-col gap-10 md:gap-12">
          <div className="flex flex-col gap-4">
            <p className="font-medium text-muted-foreground text-xs">About</p>
            <h2 className="text-pretty text-xl leading-7 tracking-tight" id="overview-title">
              An open-source admin dashboard with 25+ screens, ready to make your own.
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-medium text-muted-foreground text-xs">Make it yours</p>
            <p className="text-muted-foreground text-sm leading-6">
              Customize the fonts, themes, content width, navbar, and sidebar layout. Each edition stays native to its
              foundation while keeping the design consistent.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-10">
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-muted-foreground text-xs">Featured screens</h3>
            <ul className="flex flex-col gap-1 text-sm">
              {includedScreens.map((screen) => (
                <li key={screen.name}>
                  <Link
                    className="underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    href={screen.href}
                    prefetch={false}
                  >
                    {screen.name}
                  </Link>
                </li>
              ))}
            </ul>
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
