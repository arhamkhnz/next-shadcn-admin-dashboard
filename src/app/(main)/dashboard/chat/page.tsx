import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-medium text-sm leading-none">Chat preview</h1>
          <p className="text-muted-foreground text-sm">
            This iframe shows the standalone chat screen. Open it in full screen for a better view.
          </p>
        </div>
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/chat" target="_blank" rel="noreferrer" aria-label="Open chat in new tab">
            <ExternalLink />
          </Link>
        </Button>
      </div>

      <iframe src="/chat" title="Chat preview" className="min-h-0 flex-1 rounded-lg border bg-background" />
    </div>
  );
}
