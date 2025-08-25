/* eslint-disable complexity */
"use client";

import React from "react";

import { MapPin, Phone, Star } from "lucide-react";

import { BranchTimeSlots } from "@/app/(main)/admin/branches/_components/branch-time-slots";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";

export default function BranchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { branches, fetchBranches } = useBranchStore();
  // Resolve the params promise to get the actual id value
  const resolvedParams = React.use(params);
  const branch = branches.find((b) => b.id === resolvedParams.id);

  React.useEffect(() => {
    if (branches.length === 0) {
      fetchBranches();
    }
  }, [fetchBranches, branches.length]);

  if (!branch) {
    return <div>Branch not found</div>;
  }

  // Parse location for map link
  const parseLocation = (locationStr: string | null | undefined): { lat: number; lng: number } | undefined => {
    if (!locationStr) return undefined;

    // Handle stringified JSON format
    if (typeof locationStr === "string" && locationStr.startsWith("{")) {
      try {
        const parsed = JSON.parse(locationStr);
        if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
          return { lat: parsed.lat, lng: parsed.lng };
        }
      } catch (e) {
        // Not a JSON string, continue to other formats
      }
    }

    // Check for WKT format (POINT(lng lat))
    const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
    if (match && match.length === 3) {
      return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }

    // Handle GeoJSON format if stored as string
    if (typeof locationStr === "string" && locationStr.includes('"type":"Point"')) {
      try {
        const parsed = JSON.parse(locationStr);
        if (parsed.type === "Point" && Array.isArray(parsed.coordinates) && parsed.coordinates.length === 2) {
          return { lng: parsed.coordinates[0], lat: parsed.coordinates[1] };
        }
      } catch (e) {
        // Not a valid GeoJSON string
      }
    }

    return undefined;
  };

  const location = parseLocation(branch.location);
  const mapUrl = location
    ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
    : undefined;

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Branch Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{branch.name}</CardTitle>
            <p className="text-muted-foreground">{branch.franchise}</p>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">Location</p>
              {location ? (
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
            {branch.address && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">Address</p>
                <p>{branch.address}</p>
              </div>
            )}
            {branch.city && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">City</p>
                <p>{branch.city}</p>
              </div>
            )}
            {branch.phone_number && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <p>{branch.phone_number}</p>
                </div>
              </div>
            )}
            {branch.ratings !== undefined && branch.ratings > 0 && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">Rating</p>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <p>{branch.ratings.toFixed(1)}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">Services Offered</p>
                {branch.services ? (
                  <p className="text-lg font-semibold">{branch.services.length}</p>
                ) : (
                  <p className="text-muted-foreground">Loading...</p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">Active Bookings</p>
                <p className="text-lg font-semibold">{branch.activeBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <BranchTimeSlots branchId={branch.id} showSaveButton={false} className="h-full" />
          </CardContent>
        </Card>
      </div>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          {branch.services === undefined ? (
            <p className="text-muted-foreground">Loading services...</p>
          ) : branch.services.length > 0 ? (
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
