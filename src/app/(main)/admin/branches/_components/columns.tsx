"use client";

import { ColumnDef } from "@tanstack/react-table";

import { BranchActions } from "./branch-actions";
import { Branch } from "./types";

export const columns: ColumnDef<Branch>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "franchise", header: "Franchise" },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const location = row.original.location;
      // Helper to decode WKB hex to coordinates
      // Decodes PostGIS WKB hex (Point, 4326) to {lng, lat}
      function decodeWKBHexToLngLat(hex: string): { lng: number; lat: number } | null {
        // Typical WKB hex for Point: 0101000020E6100000 + 16 bytes (8 for lng, 8 for lat)
        if (!/^0101000020E6100000[a-fA-F0-9]{32}$/.test(hex)) return null;
        try {
          // Extract 8 bytes for lng, then 8 bytes for lat (little-endian)
          function hexLEToFloat64(h: string) {
            const bytes = new Uint8Array(h.match(/../g)!.map((b) => parseInt(b, 16)));
            bytes.reverse();
            return new DataView(bytes.buffer).getFloat64(0, true);
          }
          const lng = hexLEToFloat64(hex.slice(18, 34));
          const lat = hexLEToFloat64(hex.slice(34, 50));
          if (isNaN(lng) || isNaN(lat)) return null;
          return { lng, lat };
        } catch {
          return null;
        }
      }
      // Try to decode as WKB, else fallback
      const wkbCoords = decodeWKBHexToLngLat(location);
      const parts = location ? location.split(",") : [];
      let display, mapLink;
      if (wkbCoords) {
        display = `Lat: ${wkbCoords.lat.toFixed(6)}, Lng: ${wkbCoords.lng.toFixed(6)}`;
        // Use the recommended Google Maps search URL for coordinates
        mapLink = `https://www.google.com/maps/search/?api=1&query=${wkbCoords.lat},${wkbCoords.lng}`;
      } else if (location) {
        display =
          parts.length > 1
            ? parts.map((p, i) => (
                <span key={i}>
                  {p.trim()}
                  {i !== parts.length - 1 && <br />}
                </span>
              ))
            : location;
        // Use the recommended Google Maps search URL for address
        mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
      }
      return (
        <div style={{ display: "flex", alignItems: "start", gap: 6 }}>
          <span style={{ marginTop: 2, color: "#888" }}>
            {/* Use a simple SVG pin icon inline for portability */}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                fill="#888"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"
              />
            </svg>
          </span>
          <span style={{ whiteSpace: "pre-line", fontSize: 14 }}>
            {mapLink ? (
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline", color: "#1976d2" }}
              >
                {display}
              </a>
            ) : (
              display
            )}
          </span>
        </div>
      );
    },
  },
  { accessorKey: "services", header: "Services" },
  { accessorKey: "activeBookings", header: "Active Bookings" },
  {
    id: "actions",
    cell: ({ row }) => {
      const branch = row.original;
      return <BranchActions branch={branch} />;
    },
  },
];
