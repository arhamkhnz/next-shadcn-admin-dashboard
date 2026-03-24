import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const releases = [
  { track: "Midnight Protocol", artist: "Draylean", streams: 142800, revenue: 557.0, status: "live" },
  { track: "Neon Drift", artist: "Draylean", streams: 98400, revenue: 384.0, status: "live" },
  { track: "Shadow Walk", artist: "Drxvmxr", streams: 67200, revenue: 262.0, status: "live" },
  { track: "Aurora Phase", artist: "TBA", streams: 0, revenue: 0, status: "upcoming" },
] as const;

const numberFormatter = new Intl.NumberFormat("en-US");
const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function RecentReleases() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Releases</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Track</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead className="text-right">Streams</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {releases.map((release) => (
              <TableRow key={release.track}>
                <TableCell className="font-medium">{release.track}</TableCell>
                <TableCell className="text-muted-foreground">{release.artist}</TableCell>
                <TableCell className="text-right">
                  {release.streams === 0 ? "—" : numberFormatter.format(release.streams)}
                </TableCell>
                <TableCell className="text-right">
                  {release.revenue === 0 ? "—" : moneyFormatter.format(release.revenue)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      release.status === "live"
                        ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
                        : "text-amber-400 border-amber-500/40 bg-amber-500/10"
                    }
                  >
                    {release.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
