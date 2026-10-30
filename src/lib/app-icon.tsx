import { ImageResponse } from "next/og";

import { AppLogo } from "@/components/app-logo";

export function createAppIcon(size: number) {
  const logoWidth = size * 0.72;
  const logoHeight = logoWidth * (308 / 356);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "black",
        color: "white",
      }}
    >
      <AppLogo viewBox="72 96 356 308" width={logoWidth} height={logoHeight} />
    </div>,
    { width: size, height: size },
  );
}
