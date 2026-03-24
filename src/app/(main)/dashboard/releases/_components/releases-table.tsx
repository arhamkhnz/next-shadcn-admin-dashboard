import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { StatusBadge } from "./status-badge";

export const releases = [
  {
    id: 1,
    track: "Midnight Protocol",
    artist: "Draylean",
    genre: "Electronic",
    streams: 142800,
    revenue: 557.0,
    date: "2025-02-14",
    status: "live",
  },
  {
    id: 2,
    track: "Neon Drift",
    artist: "Draylean",
    genre: "Electronic",
    streams: 98400,
    revenue: 384.0,
    date: "2025-01-08",
    status: "live",
  },
  {
    id: 3,
    track: "Shadow Walk",
    artist: "Drxvmxr",
    genre: "Phonk",
    streams: 67200,
    revenue: 262.0,
    date: "2024-12-20",
    status: "live",
  },
  {
    id: 4,
    track: "Celestial",
    artist: "Draylean",
    genre: "Electronic",
    streams: 54600,
    revenue: 213.0,
    date: "2024-11-30",
    status: "live",
  },
  {
    id: 5,
    track: "Phantom Code",
    artist: "Drxvmxr",
    genre: "Wave Phonk",
    streams: 31400,
    revenue: 122.0,
    date: "2024-11-05",
    status: "live",
  },
  {
    id: 6,
    track: "Aurora Phase",
    artist: "TBA",
    genre: "Electronic",
    streams: 0,
    revenue: 0,
    date: "2025-04-01",
    status: "upcoming",
  },
  {
    id: 7,
    track: "Glitch Garden",
    artist: "Draylean",
    genre: "Chill Funk",
    streams: 0,
    revenue: 0,
    date: "2025-05-10",
    status: "upcoming",
  },
] as const;

export function ReleasesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Releases</CardTitle>
        <p className="text-sm text-muted-foreground">{releases.length} total releases</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Track</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="text-right">Streams</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releases.map((r) => (
                <TableRow key={r.id} className="cursor-pointer transition-colors hover:bg-muted/40">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 rounded-md">
                        <AvatarFallback className="rounded-md bg-muted text-xs">
                          {r.track.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{r.track}</span>
                    </div>
                  </TableCell>
                  <TableCell>{r.artist}</TableCell>
                  <TableCell>{r.genre}</TableCell>
                  <TableCell className="text-right">{r.streams === 0 ? "—" : r.streams.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {r.revenue === 0 ? "—" : `$${r.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </TableCell>
                  <TableCell>
                    {new Date(r.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
