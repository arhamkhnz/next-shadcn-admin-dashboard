"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { worldRegions, cityData } from "./data/geographic-data";

interface MapVisualizationProps {
  mapView: string;
  zoomLevel: number;
  totalUsers: number;
}

export function MapVisualization({ mapView, zoomLevel, totalUsers }: MapVisualizationProps) {
  return (
    <div
      className="bg-muted/20 relative min-h-[200px] flex-1 overflow-hidden rounded-lg border"
      style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
    >
      {/* This is a simplified map representation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[80%] w-[90%]">
          {worldRegions.map((region) => {
            // Position regions on the "map"
            const positions: Record<string, { top: string; left: string; width: string; height: string }> = {
              na: { top: "15%", left: "15%", width: "25%", height: "25%" },
              sa: { top: "50%", left: "25%", width: "20%", height: "30%" },
              eu: { top: "20%", left: "48%", width: "15%", height: "15%" },
              af: { top: "40%", left: "48%", width: "20%", height: "30%" },
              as: { top: "25%", left: "65%", width: "25%", height: "30%" },
              oc: { top: "65%", left: "75%", width: "15%", height: "15%" },
            };

            const position = positions[region.id];
            const densityColors = ["bg-chart-1/20", "bg-chart-1/40", "bg-chart-1/60", "bg-chart-1/80"];

            return (
              <TooltipProvider key={region.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "border-border/50 absolute rounded-lg border",
                        densityColors[region.density - 1],
                        mapView === region.id && "ring-primary ring-1",
                      )}
                      style={{
                        top: position.top,
                        left: position.left,
                        width: position.width,
                        height: position.height,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="px-2 py-1 text-[10px]">
                    <div className="space-y-0.5">
                      <p className="font-medium">{region.name}</p>
                      <p>{region.users.toLocaleString()} users</p>
                      <p>{Math.round((region.users / totalUsers) * 100)}% of total users</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}

          {/* Add city markers */}
          {cityData.map((city, index) => {
            // Simplified city positioning (in a real app, would use geo coordinates)
            const cityPositions = [
              { top: "22%", left: "22%" }, // New York
              { top: "20%", left: "48%" }, // London
              { top: "35%", left: "68%" }, // Mumbai
              { top: "70%", left: "80%" }, // Sydney
              { top: "20%", left: "20%" }, // Toronto
              { top: "22%", left: "50%" }, // Berlin
              { top: "23%", left: "47%" }, // Paris
              { top: "60%", left: "30%" }, // São Paulo
              { top: "30%", left: "85%" }, // Tokyo
              { top: "30%", left: "18%" }, // Mexico City
            ];

            const position = cityPositions[index];

            return (
              <TooltipProvider key={city.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="bg-primary absolute size-1.5 rounded-full shadow-sm"
                      style={{
                        top: position.top,
                        left: position.left,
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="px-2 py-1 text-[10px]">
                    <div className="space-y-0.5">
                      <p className="font-medium">
                        {city.name}, {city.country}
                      </p>
                      <p>{city.users.toLocaleString()} users</p>
                      <p className="flex items-center gap-1">
                        Growth:
                        <Badge variant={city.growth > 10 ? "default" : "secondary"} className="px-1 py-0 text-[8px]">
                          +{city.growth}%
                        </Badge>
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      {/* Map overlay with legend */}
      <div className="bg-background/90 absolute bottom-2 left-2 rounded-md p-1.5 shadow-sm">
        <div className="text-[10px] font-medium">User Density</div>
        <div className="mt-0.5 flex items-center gap-0.5">
          <div className="bg-chart-1/20 size-2 rounded-sm" />
          <div className="bg-chart-1/40 size-2 rounded-sm" />
          <div className="bg-chart-1/60 size-2 rounded-sm" />
          <div className="bg-chart-1/80 size-2 rounded-sm" />
          <span className="text-[10px]">High</span>
        </div>
      </div>
    </div>
  );
}
