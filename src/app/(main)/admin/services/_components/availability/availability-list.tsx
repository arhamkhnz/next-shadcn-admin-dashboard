"use client";

import { useEffect, useState } from "react";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useServiceAvailabilityStore } from "@/stores/admin-dashboard/service-availability-store";
import { ServiceAvailability } from "@/types/database";

import { AvailabilityForm } from "./availability-form";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface AvailabilityListProps {
  serviceId: string;
}

export function AvailabilityList({ serviceId }: AvailabilityListProps) {
  const { availability, fetchAvailabilityForService, deleteAvailability } = useServiceAvailabilityStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<ServiceAvailability | undefined>(undefined);

  useEffect(() => {
    fetchAvailabilityForService(serviceId);
  }, [serviceId, fetchAvailabilityForService]);

  const handleEdit = (avail: ServiceAvailability) => {
    setEditingAvailability(avail);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAvailability(id);
    } catch (error) {
      console.error("Error deleting availability:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingAvailability(undefined);
    }
  };

  // Group availability by day of week
  const groupedAvailability = availability.reduce(
    (acc, avail) => {
      if (!acc[avail.dayOfWeek]) {
        acc[avail.dayOfWeek] = [];
      }
      acc[avail.dayOfWeek].push(avail);
      return acc;
    },
    {} as Record<number, ServiceAvailability[]>,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Service Availability</CardTitle>
            <CardDescription>Manage when this service is available</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingAvailability(undefined)}>Add Availability</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAvailability ? "Edit Availability" : "Add Availability"}</DialogTitle>
              </DialogHeader>
              <AvailabilityForm
                serviceId={serviceId}
                availability={editingAvailability}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedAvailability).length === 0 ? (
          <p className="text-muted-foreground py-4 text-center">
            No availability set. Add time slots when this service is available.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedAvailability)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([day, availabilities]) => (
                <div key={day}>
                  <h3 className="font-medium">{daysOfWeek[Number(day)]}</h3>
                  <div className="mt-2 space-y-2">
                    {availabilities
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((avail) => (
                        <div key={avail.id} className="flex items-center justify-between rounded-md border p-3">
                          <div className="flex items-center gap-2">
                            <span>
                              {avail.startTime} - {avail.endTime}
                            </span>
                            {!avail.isActive && (
                              <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs">Inactive</span>
                            )}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(avail)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(avail.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
