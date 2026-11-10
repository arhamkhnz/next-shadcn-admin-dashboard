import { format, isToday, isYesterday, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookOpen, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const today = new Date();

function formatNoteDate(date: Date) {
  if (isToday(date)) return "Hoje";
  if (isYesterday(date)) return "Ontem";
  return format(date, "d 'de' MMM", { locale: ptBR });
}

const recentNotes = [
  { title: "Princípios de design escaláveis", date: formatNoteDate(today), icon: FileText },
  {
    title: `Ideias de conteúdo – ${format(today, "MMMM", { locale: ptBR })}`,
    date: formatNoteDate(subDays(today, 1)),
    icon: FileText,
  },
  { title: "Lições da semana", date: formatNoteDate(subDays(today, 4)), icon: FileText },
  { title: "Livros que estou lendo", date: formatNoteDate(subDays(today, 5)), icon: BookOpen },
] as const;

export function RecentNotesCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Notas recentes</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Ver todas
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {recentNotes.map((note) => (
          <div key={note.title} className="flex items-start gap-4">
            <note.icon className="size-5 text-muted-foreground" />
            <div className="min-w-0">
              <div className="truncate font-medium text-sm leading-none">{note.title}</div>
              <div className="text-muted-foreground text-xs">{note.date}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
