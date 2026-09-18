import { ImageResponse } from "next/og";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

const dashboardImageData = await readFile(join(process.cwd(), "media/default/default-light.webp"), "base64");
const dashboardImageSrc = `data:image/webp;base64,${dashboardImageData}`;

export function createSocialImage(size: { width: number; height: number }) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#090909",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse requires a native img element. */}
      <img
        alt=""
        src={dashboardImageSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>,
    size,
  );
}
