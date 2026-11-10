import { Quote } from "lucide-react";

export function QuoteCard() {
  return (
    <section className="bg-card rounded-2xl border p-6 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="text-muted-foreground grid size-8 shrink-0 place-items-center">
          <Quote className="size-6" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xl leading-none tracking-tight">Ações pequenas e consistentes geram grandes resultados.</p>
          <p className="text-muted-foreground">Continue aparecendo. Você consegue.</p>
        </div>
      </div>
    </section>
  );
}
