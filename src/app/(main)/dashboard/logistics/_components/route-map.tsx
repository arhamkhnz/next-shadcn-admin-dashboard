"use client";

import { useEffect, useMemo, useState } from "react";

import { type GeoPermissibleObjects, geoEqualEarth, geoGraticule, geoInterpolate, geoPath } from "d3-geo";
import { ArrowRight, Expand, LocateFixed, RefreshCw, SlidersHorizontal } from "lucide-react";
import { feature } from "topojson-client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { StatusBadge } from "./status-badge";

type WorldTopology = {
  type: "Topology";
  objects: {
    countries: unknown;
  };
};

const WIDTH = 1000;
const HEIGHT = 520;
const origin: [number, number] = [106.8456, -6.2088];
const destination: [number, number] = [103.8198, 1.3521];

function createRoutePoints(from: [number, number], to: [number, number], steps = 48) {
  const interpolate = geoInterpolate(from, to);
  return Array.from({ length: steps + 1 }, (_, index) => interpolate(index / steps));
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="mt-1 font-medium tabular-nums">{value}</div>
    </div>
  );
}

export function RouteMap() {
  const [countries, setCountries] = useState<GeoJSON.Feature[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadMap() {
      const response = await fetch("/features.json");
      const topology = (await response.json()) as WorldTopology;
      const collection = feature(
        topology as unknown as Parameters<typeof feature>[0],
        topology.objects.countries as unknown as Parameters<typeof feature>[1],
      ) as GeoJSON.FeatureCollection;
      if (!cancelled) setCountries(collection.features);
    }

    void loadMap();

    return () => {
      cancelled = true;
    };
  }, []);

  const { graticulePath, path, projectedDestination, projectedOrigin, routePath } = useMemo(() => {
    const projection = geoEqualEarth()
      .scale(1020)
      .center([107, -2.5])
      .translate([WIDTH / 2, HEIGHT / 2]);
    const pathGenerator = geoPath(projection);
    const route = {
      type: "LineString",
      coordinates: createRoutePoints(origin, destination),
    } satisfies GeoJSON.LineString;

    return {
      graticulePath: pathGenerator(geoGraticule().step([2, 2])()) ?? "",
      path: pathGenerator,
      projectedDestination: projection(destination),
      projectedOrigin: projection(origin),
      routePath: pathGenerator(route) ?? "",
    };
  }, []);

  return (
    <div className="relative h-full overflow-hidden bg-muted/20">
      <svg
        aria-label="Shipment route map"
        className="absolute inset-0 size-full"
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      >
        <path d={graticulePath} fill="none" stroke="var(--border)" strokeWidth={0.7} />
        {countries.map((country) => (
          <path
            key={String(country.id ?? country.properties?.name)}
            d={path(country as GeoPermissibleObjects) ?? undefined}
            fill="var(--muted)"
            stroke="var(--background)"
            strokeWidth={0.55}
          />
        ))}
        <path d={routePath} fill="none" stroke="var(--primary)" strokeLinecap="round" strokeWidth={5} />
        {[projectedOrigin, projectedDestination].map((point, index) =>
          point ? (
            <g key={index === 0 ? "origin" : "destination"} transform={`translate(${point[0]}, ${point[1]})`}>
              <circle r={24} fill="var(--primary)" opacity={0.12} />
              <circle r={9} fill="var(--background)" stroke="var(--primary)" strokeWidth={3} />
            </g>
          ) : null,
        )}
      </svg>
      <div className="absolute top-8 left-8 w-92 rounded-xl border bg-card p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-medium text-xl tracking-tight">NXR-2026-0712</div>
            <div className="mt-2 text-muted-foreground text-sm">
              Jakarta, IDN <ArrowRight className="inline size-3" /> Singapore, SGP
            </div>
          </div>
          <StatusBadge status="In Transit" />
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-3 divide-x">
          <SmallMetric label="Distance" value="1,128 km" />
          <SmallMetric label="Progress" value="65%" />
          <SmallMetric label="ETA" value="08:45 AM" />
        </div>
      </div>
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <Button variant="outline">Live Updates</Button>
        <Button size="icon" variant="outline">
          <RefreshCw />
        </Button>
        <Button size="icon" variant="outline">
          <SlidersHorizontal />
        </Button>
        <Button size="icon" variant="outline">
          <Expand />
        </Button>
      </div>
      <div className="absolute top-32 right-8 flex flex-col overflow-hidden rounded-xl border bg-card">
        <Button size="icon" variant="ghost" className="rounded-none">
          <LocateFixed />
        </Button>
      </div>
    </div>
  );
}
