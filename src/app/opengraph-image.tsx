import { createSocialImage } from "./_lib/create-social-image";

export const alt = "Studio Admin open source shadcn/ui dashboard preview with layout controls";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return createSocialImage(size);
}
