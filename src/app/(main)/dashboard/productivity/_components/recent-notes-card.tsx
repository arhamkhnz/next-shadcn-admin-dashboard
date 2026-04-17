import { format, isToday, isYesterday, subDays } from "date-fns";
import { BookOpen, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const today = new Date();

function formatNoteDate(date: Date) {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
}

const recentNotes = [
  { title: "Design principles that scale", date: formatNoteDate(today), icon: FileText },
  { title: `Content ideas – ${format(today, "MMMM")}`, date: formatNoteDate(subDays(today, 1)), icon: FileText },
  { title: "Lessons from the week", date: formatNoteDate(subDays(today, 4)), icon: FileText },
  { title: "Books I’m Reading", date: formatNoteDate(subDays(today, 5)), icon: BookOpen },
] as const;

export function RecentNotesCard() {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Recent Notes</CardTitle>
        <CardAction>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            View all
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
