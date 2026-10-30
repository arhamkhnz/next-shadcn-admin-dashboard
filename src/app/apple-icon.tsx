import { createAppIcon } from "@/lib/app-icon";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return createAppIcon(size.width);
}
