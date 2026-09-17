import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    title: "A complete product surface",
    description:
      "Start with purpose-built screens for analytics, CRM, finance, ecommerce, mail, tasks, and the everyday work around them.",
  },
  {
    title: "Designed to become yours",
    description:
      "Responsive layouts, semantic design tokens, and theme presets give you a clear system to shape around your own product.",
  },
  {
    title: "Components you control",
    description:
      "Every interface is composed from local shadcn/ui components, so the source stays inspectable, editable, and in your hands.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title">
      <Separator />
      <div className="grid gap-8 py-20 sm:grid-cols-[3rem_1fr] sm:gap-8 sm:py-24">
        <Badge className="size-10 rounded-full p-0 tabular-nums" variant="outline">
          1
        </Badge>

        <div>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl" id="features-title">
            What’s inside
          </h2>

          <div className="mt-12 space-y-12 sm:mt-14 sm:space-y-14">
            {features.map((feature) => (
              <article className="max-w-2xl" key={feature.title}>
                <h3 className="text-lg font-medium tracking-tight sm:text-xl">{feature.title}</h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
