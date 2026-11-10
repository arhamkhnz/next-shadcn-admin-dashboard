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
          <h1 className="font-medium text-sm leading-none">Pré-visualização do e-mail</h1>
          <p className="text-muted-foreground text-sm">
            Este iframe mostra a tela de e-mail independente. Abra em tela cheia para uma melhor visualização.
          </p>
        </div>
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/mail" prefetch={false} target="_blank" rel="noreferrer" aria-label="Abrir e-mail em nova aba">
            <ExternalLink />
          </Link>
        </Button>
      </div>

      <iframe
        src="/mail"
        title="Pré-visualização do e-mail"
        className="min-h-0 flex-1 rounded-lg border bg-background"
      />
    </div>
  );
}
