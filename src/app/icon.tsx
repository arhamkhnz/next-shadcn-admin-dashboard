import { createAppIcon } from "@/lib/app-icon";

export const dynamic = "force-static";

const iconSizes = [16, 32, 48, 128, 192, 512] as const;

export function generateImageMetadata() {
  return iconSizes.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  return createAppIcon(Number(await id));
}
