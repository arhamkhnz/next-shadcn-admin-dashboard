"use client";

import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";

export default function BranchDetailPage({ params }: { params: { id: string } }) {
  const { branches } = useBranchStore();
  const branch = branches.find((b) => b.id === params.id);

  if (!branch) {
    return <div>Branch not found</div>;
  }

  // Parse location for map link
  const parseLocation = (locationStr: string | null | undefined): { lat: number; lng: number } | undefined => {
    if (!locationStr) return undefined;
    // Check for WKT format
    const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (match && match.length === 3) {
      return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }
    return undefined;
  };

  const location = parseLocation(branch.location);
  const mapUrl = location ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}` : null;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{branch.name}</CardTitle>
          <p className="text-muted-foreground">{branch.franchise}</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Location</p>
            {mapUrl ? (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-2 hover:underline"
              >
                <MapPin className="h-4 w-4" />
                View on Map
              </a>
            ) : (
              <p className="text-muted-foreground">Location not set</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Services Offered</p>
            <p className="text-lg font-semibold">{branch.services?.length || 0}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">Active Bookings</p>
            <p className="text-lg font-semibold">{branch.activeBookings}</p>
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          {branch.services && branch.services.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {branch.services.map((service) => (
                <div key={service.id} className="rounded-lg border p-4">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    ${service.price} &middot; {service.duration_min} mins
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No services offered at this branch.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
