import { Boxes, LayoutDashboard, Paintbrush2, PanelsTopLeft } from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "A complete product surface",
    description:
      "Move beyond a single overview screen with focused experiences for analytics, CRM, finance, ecommerce, tasks, mail, and more.",
  },
  {
    icon: PanelsTopLeft,
    title: "Layouts that adapt",
    description:
      "Responsive navigation, compact modes, and considered content density give the interface room to fit different products and teams.",
  },
  {
    icon: Paintbrush2,
    title: "Designed to become yours",
    description:
      "Theme presets, typography choices, and semantic design tokens make customization deliberate without fighting the system underneath.",
  },
  {
    icon: Boxes,
    title: "Components you own",
    description:
      "The interface is composed from local shadcn/ui components, so the implementation stays inspectable, editable, and under your control.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b border-border" id="features" aria-labelledby="features-title">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:px-12 lg:py-36">
        <div className="lg:col-span-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">01 / The foundation</p>
        </div>

        <div className="lg:col-span-9">
          <div className="grid gap-8 lg:grid-cols-3">
            <h2
              className="text-balance text-4xl leading-tight font-medium tracking-[-0.04em] sm:text-5xl lg:col-span-2 lg:text-6xl"
              id="features-title"
            >
              Made for the work after the starter.
            </h2>
            <p className="max-w-sm self-end text-base leading-relaxed text-muted-foreground">
              Studio Admin provides enough structure to move quickly, without turning your product into a copy of the
              template.
            </p>
          </div>

          <div className="mt-16 grid border-t border-border sm:grid-cols-2 lg:mt-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <article
                  className="border-b border-border py-8 sm:odd:pr-8 sm:even:border-l sm:even:pl-8 lg:py-10"
                  key={feature.title}
                >
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                    <span className="text-xs text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="mt-12 text-xl font-medium tracking-tight sm:text-2xl">{feature.title}</h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
