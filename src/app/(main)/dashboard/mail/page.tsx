import Link from "next/link";

import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-sm leading-none font-medium">Mail preview</h1>
          <p className="text-muted-foreground text-sm">
            This iframe shows the standalone mail screen. Open it in full screen for a better view.
          </p>
        </div>
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/mail" prefetch={false} target="_blank" rel="noreferrer" aria-label="Open mail in new tab">
            <ExternalLink />
          </Link>
        </Button>
      </div>

      <iframe src="/mail" title="Mail preview" className="bg-background min-h-0 flex-1 rounded-lg border" />
    </div>
  );
}
