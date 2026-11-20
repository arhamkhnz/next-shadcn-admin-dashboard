import { ImageResponse } from "next/og";

import { AppLogo } from "@/components/app-logo";

export function createAppIcon(size: number) {
  const logoSize = size * 0.72;

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
      <AppLogo width={logoSize} height={logoSize} />
    </div>,
    { width: size, height: size },
  );
}
