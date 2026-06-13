"use client";

import * as React from "react";

export function useVisibleCenterPosition(
  parentRef: React.RefObject<HTMLElement | null>,
  childRef: React.RefObject<HTMLElement | null>,
  padding = 16,
) {
  const [top, setTop] = React.useState<number | null>(null);

  React.useEffect(() => {
    function updateTop() {
      const parent = parentRef.current;
      const child = childRef.current;
      if (!parent || !child) return;

      const parentRect = parent.getBoundingClientRect();
      const visibleTop = Math.max(parentRect.top, 0);
      const visibleBottom = Math.min(parentRect.bottom, window.innerHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleCenter =
        visibleHeight > 0 ? visibleTop + visibleHeight / 2 - parentRect.top : parent.clientHeight / 2;
      const maxTop = Math.max(padding, parent.clientHeight - child.offsetHeight - padding);
      const nextTop = Math.min(Math.max(visibleCenter - child.offsetHeight / 2, padding), maxTop);

      if (process.env.NODE_ENV === "development") {
        console.log("Invoice preview spacing", {
          above: Math.round(nextTop),
          below: Math.round(parent.clientHeight - nextTop - child.offsetHeight),
        });
      }

      setTop(nextTop);
    }

    updateTop();
    window.addEventListener("scroll", updateTop, { passive: true });
    window.addEventListener("resize", updateTop);

    return () => {
      window.removeEventListener("scroll", updateTop);
      window.removeEventListener("resize", updateTop);
    };
  }, [childRef, padding, parentRef]);

  return top;
}
