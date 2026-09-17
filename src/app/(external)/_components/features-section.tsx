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
      <div className="grid grid-cols-[3rem_1fr] gap-8 py-24">
        <Badge className="size-10 rounded-full p-0 tabular-nums" variant="outline">
          1
        </Badge>

        <div>
          <h2 className="font-medium text-3xl tracking-tight" id="features-title">
            What’s inside
          </h2>

          <div className="mt-14 flex flex-col gap-14">
            {features.map((feature) => (
              <article className="max-w-2xl" key={feature.title}>
                <h3 className="font-medium text-xl tracking-tight">{feature.title}</h3>
                <p className="mt-3 text-lg text-muted-foreground leading-8">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
