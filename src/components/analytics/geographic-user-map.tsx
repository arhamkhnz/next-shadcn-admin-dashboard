"use client";

import * as React from "react";

import { Download, Globe, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { topRegions } from "./data/geographic-data";
import { MapVisualization } from "./map-visualization";
import { RegionsTable } from "./regions-table";

export function GeographicUserMap() {
  const [mapView, setMapView] = React.useState("world");
  const [timeRange, setTimeRange] = React.useState("30d");
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter regions based on search query
  const filteredRegions = React.useMemo(() => {
    if (!searchQuery.trim()) return topRegions;

    const query = searchQuery.toLowerCase();
    return topRegions.filter(
      (region) => region.name.toLowerCase().includes(query) || region.code.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // Calculate total users
  const totalUsers = topRegions.reduce((sum, region) => sum + region.users, 0);
  const totalNewUsers = topRegions.reduce((sum, region) => sum + region.newUsers, 0);

  // Handle zoom in/out
  const handleZoomIn = () => {
    if (zoomLevel < 2) setZoomLevel((prev) => prev + 0.25);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) setZoomLevel((prev) => prev - 0.25);
  };

  return (
    <Card className="@container/map flex h-full flex-col">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="flex items-center gap-1.5 text-sm">
          <Globe className="size-4" />
          Geographic User Distribution
        </CardTitle>
        <CardDescription className="text-xs">User distribution across regions</CardDescription>
        <CardAction className="flex gap-1.5">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="h-7 w-[110px] text-xs" size="sm">
              <SelectValue placeholder="Last 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Download className="mr-1.5 size-3.5" />
            Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-hidden pt-0">
        <Tabs defaultValue="map" className="flex w-full flex-1 flex-col">
          <TabsList className="mb-2 grid h-8 w-full flex-shrink-0 grid-cols-2">
            <TabsTrigger value="map" className="py-1 text-xs">
              Map View
            </TabsTrigger>
            <TabsTrigger value="table" className="py-1 text-xs">
              Table View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="flex flex-1 flex-col space-y-2 overflow-hidden">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Select value={mapView} onValueChange={setMapView}>
                  <SelectTrigger className="h-7 w-[110px] text-xs" size="sm">
                    <SelectValue placeholder="World View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="world">World View</SelectItem>
                    <SelectItem value="na">North America</SelectItem>
                    <SelectItem value="eu">Europe</SelectItem>
                    <SelectItem value="as">Asia</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-6"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 0.5}
                  >
                    <ZoomOut className="size-3.5" />
                  </Button>
                  <span className="text-[10px] tabular-nums">{Math.round(zoomLevel * 100)}%</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-6"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2}
                  >
                    <ZoomIn className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* World Map Visualization */}
              <MapVisualization mapView={mapView} zoomLevel={zoomLevel} totalUsers={totalUsers} />
            </div>

            <div className="grid grid-cols-1 gap-2 @lg/map:grid-cols-3">
              <div className="rounded-lg border p-2">
                <div className="text-muted-foreground text-[10px]">Total Users</div>
                <div className="mt-0.5 text-base font-semibold">{totalUsers.toLocaleString()}</div>
                <div className="text-muted-foreground mt-0.5 text-[10px]">Across {topRegions.length} regions</div>
              </div>

              <div className="rounded-lg border p-2">
                <div className="text-muted-foreground text-[10px]">New Users</div>
                <div className="mt-0.5 text-base font-semibold">{totalNewUsers.toLocaleString()}</div>
                <div className="text-muted-foreground mt-0.5 text-[10px]">
                  Last {timeRange === "7d" ? "7 days" : timeRange === "30d" ? "30 days" : "90 days"}
                </div>
              </div>

              <div className="rounded-lg border p-2">
                <div className="text-muted-foreground text-[10px]">Top Region</div>
                <div className="mt-0.5 text-base font-semibold">{topRegions[0].name}</div>
                <div className="text-muted-foreground mt-0.5 text-[10px]">
                  {Math.round((topRegions[0].users / totalUsers) * 100)}% of total users
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="flex flex-1 flex-col space-y-2 overflow-hidden">
            <RegionsTable regions={filteredRegions} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
