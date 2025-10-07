"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { type RegionData } from "./data/geographic-data";

interface RegionsTableProps {
  regions: RegionData[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function RegionsTable({ regions, searchQuery, onSearchChange }: RegionsTableProps) {
  return (
    <div className="flex flex-1 flex-col space-y-2 overflow-hidden">
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1.5 left-1.5 size-3.5" />
          <Input
            placeholder="Search regions..."
            className="h-7 pl-7 text-xs"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border">
        <div className="h-full overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="px-3 py-2 text-left text-xs font-medium">Region</th>
                <th className="px-3 py-2 text-right text-xs font-medium">Users</th>
                <th className="hidden px-3 py-2 text-right text-xs font-medium @md/map:table-cell">New Users</th>
                <th className="hidden px-3 py-2 text-right text-xs font-medium @md/map:table-cell">Growth</th>
                <th className="hidden px-3 py-2 text-right text-xs font-medium @lg/map:table-cell">Revenue</th>
                <th className="hidden px-3 py-2 text-right text-xs font-medium @lg/map:table-cell">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region.id} className="border-b">
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="bg-muted flex size-5 items-center justify-center rounded text-xs font-medium">
                        {region.code}
                      </div>
                      <span className="text-xs font-medium">{region.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-right text-xs font-medium tabular-nums">
                    {region.users.toLocaleString()}
                  </td>
                  <td className="hidden px-3 py-1.5 text-right text-xs tabular-nums @md/map:table-cell">
                    {region.newUsers.toLocaleString()}
                  </td>
                  <td className="hidden px-3 py-1.5 text-right @md/map:table-cell">
                    <Badge variant={region.growth > 15 ? "default" : "secondary"} className="px-1.5 py-0 text-[10px]">
                      +{region.growth}%
                    </Badge>
                  </td>
                  <td className="hidden px-3 py-1.5 text-right text-xs font-medium tabular-nums @lg/map:table-cell">
                    ${region.revenue.toLocaleString()}
                  </td>
                  <td className="hidden px-3 py-1.5 text-right @lg/map:table-cell">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="bg-muted h-1 w-12 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full"
                          style={{ width: `${(region.engagementScore / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs tabular-nums">{region.engagementScore}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {regions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Search className="text-muted-foreground/50 size-8" />
          <h3 className="mt-2 text-sm font-medium">No regions found</h3>
          <p className="text-muted-foreground mt-1 text-xs">Try adjusting your search query</p>
        </div>
      )}
    </div>
  );
}
