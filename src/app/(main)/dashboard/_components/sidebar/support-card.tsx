import Link from "next/link";

import { siX } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportCard() {
  return (
    <Card size="sm" className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 px-4">
        <CardTitle className="truncate text-sm">Tem algo em mente?</CardTitle>
        <CardDescription className="line-clamp-3">
          Sugira um recurso ou converse sobre um trabalho personalizado comigo no&nbsp;
          <Link
            href="https://x.com/arhamkhnz"
            target="_blank"
            rel="noreferrer"
            aria-label="Fale comigo no X"
            className="inline-flex items-center text-foreground"
          >
            <SimpleIcon icon={siX} aria-hidden className="size-3 fill-foreground" />
          </Link>
          &nbsp;ou por{" "}
          <Link
            href="https://github.com/arhamkhnz#want-to-connect"
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:underline"
          >
            e-mail
          </Link>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
