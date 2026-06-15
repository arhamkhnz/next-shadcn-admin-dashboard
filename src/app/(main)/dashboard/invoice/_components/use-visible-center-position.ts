"use client";

import * as React from "react";

export function useVisibleCenterPosition(
  parentRef: React.RefObject<HTMLElement | null>,
  {
    height,
    maxScale,
    padding = 16,
    width,
  }: {
    height: number;
    maxScale: number;
    padding?: number;
    width: number;
  },
) {
  const [layout, setLayout] = React.useState<{ scale: number; top: number } | null>(null);

  React.useEffect(() => {
    function updateLayout() {
      const parent = parentRef.current;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const visibleTop = Math.max(parentRect.top, 0);
      const visibleBottom = Math.min(parentRect.bottom, window.innerHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleCenter =
        visibleHeight > 0 ? visibleTop + visibleHeight / 2 - parentRect.top : parent.clientHeight / 2;

      const availableWidth = Math.max(0, parent.clientWidth - padding * 2);
      const availableHeight = Math.max(0, parent.clientHeight - padding * 2);
      const scale = Math.min(maxScale, availableWidth / width, availableHeight / height);
      const nextScale = Number.isFinite(scale) ? Math.max(0.1, scale) : maxScale;
      const scaledHeight = height * nextScale;
      const maxTop = Math.max(padding, parent.clientHeight - scaledHeight - padding);
      const nextTop = Math.min(Math.max(visibleCenter - scaledHeight / 2, padding), maxTop);

      if (process.env.NODE_ENV === "development") {
        console.log("Invoice preview spacing", {
          above: Math.round(nextTop),
          below: Math.round(parent.clientHeight - nextTop - scaledHeight),
          scale: Number(nextScale.toFixed(3)),
        });
      }

      setLayout((currentLayout) => {
        if (currentLayout?.top === nextTop && currentLayout.scale === nextScale) {
          return currentLayout;
        }

        return { scale: nextScale, top: nextTop };
      });
    }

    updateLayout();
    window.addEventListener("scroll", updateLayout, { passive: true });
    window.addEventListener("resize", updateLayout);

    return () => {
      window.removeEventListener("scroll", updateLayout);
      window.removeEventListener("resize", updateLayout);
    };
  }, [height, maxScale, padding, parentRef, width]);

  return layout;
}
