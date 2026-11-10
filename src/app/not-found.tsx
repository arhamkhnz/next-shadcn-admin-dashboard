"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center space-y-2 text-center">
      <h1 className="font-semibold text-2xl">Página não encontrada.</h1>
      <p className="text-muted-foreground">A página que você está procurando não pôde ser encontrada.</p>
      <Link prefetch={false} replace href="/dashboard/default">
        <Button variant="outline">Voltar ao início</Button>
      </Link>
    </div>
  );
}
