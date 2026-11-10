import { Card } from "@/components/ui/card";

import defaultDarkImage from "../../../../media/default/default-dark.webp";
import defaultLightImage from "../../../../media/default/default-light.webp";

export function Showcase() {
  return (
    <section aria-label="Prévia do Studio Admin">
      <Card className="rounded-lg py-0" data-landing-dashboard-preview>
        {/* biome-ignore lint/performance/noImgElement: These landing images are optimized separately. */}
        <img
          alt="Dashboard padrão do Studio Admin com os controles de personalização de layout abertos"
          className="h-auto w-full rounded-lg! dark:hidden"
          height={defaultLightImage.height}
          src={defaultLightImage.src}
          width={defaultLightImage.width}
        />
        {/* biome-ignore lint/performance/noImgElement: These landing images are optimized separately. */}
        <img
          alt="Dashboard padrão do Studio Admin com os controles de personalização de layout abertos"
          className="hidden h-auto w-full rounded-lg! dark:block"
          height={defaultDarkImage.height}
          src={defaultDarkImage.src}
          width={defaultDarkImage.width}
        />
      </Card>
    </section>
  );
}
