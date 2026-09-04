"use client";

import type * as React from "react";

import { cn } from "cn";
import type { SimpleIcon as SimpleIconType } from "simple-icons";

type SimpleIconProps = {
  icon: SimpleIconType;
  className?: string;
} & React.SVGProps<SVGSVGElement>;

export function SimpleIcon({ icon, className, ...props }: SimpleIconProps) {
  const { title, path } = icon;

  return (
    <svg
      viewBox="0 0 24 24"
      aria-label={title}
      aria-hidden="false"
      focusable="false"
      className={cn("size-5 fill-foreground", className)}
      {...props}
    >
      <title>{title}</title>
      <path d={path} />
    </svg>
  );
}
