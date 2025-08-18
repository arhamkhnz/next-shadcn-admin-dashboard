/* eslint-disable complexity */
"use client";
import { useEffect, useMemo, useState } from "react";

import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Building2, Loader2, PlusCircle, Trash2, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";
import { Database } from "@/types/database";

import { ServiceDialog } from "./service-dialog";
import { Branch } from "./types";

// Define the type for the onServiceAdd prop
type ServiceDialogProps = React.ComponentProps<typeof ServiceDialog>;

const formSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters."),
  franchise_id: z.string().min(1, "Please select a franchise."),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .refine((data) => data.lat && data.lng, {
      message: "Please select a location on the map.",
    }),
});

type BranchFormValues = z.infer<typeof formSchema>;

interface BranchFormProps {
  branch?: Branch;
  onSuccess: () => void;
}

// Helper to parse location string
const parseLocation = (locationStr: string | null | undefined): { lat: number; lng: number } | undefined => {
  if (!locationStr) return undefined;
  // Check for WKT format
  const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }
  // Check for GeoJSON format (from location picker)
  try {
    const parsed = JSON.parse(locationStr);
    if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
      return parsed;
    }
  } catch (e) {
    // Not a JSON string, ignore
  }
  return undefined;
};

export function BranchForm({ branch, onSuccess }: BranchFormProps) {
  const { addBranch, updateBranch, fetchBranches } = useBranchStore();
  const { deleteService, addService } = useServiceStore();
  const { franchises } = useFranchiseStore();

  const LocationPicker = useMemo(
    () =>
      dynamic(() => import("./location-picker").then((mod) => mod.LocationPicker), {
        ssr: false,
        loading: () => <p>Loading map...</p>,
      }),
    [],
  );

  const isEditMode = !!branch;
  const [newServices, setNewServices] = useState<any[]>([]);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: branch?.name ?? "",
      franchise_id: branch?.franchise_id ?? "",
      location: parseLocation((branch as any)?.location),
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: BranchFormValues) => {
    const locationString = `POINT(${data.location.lng} ${data.location.lat})`;

    try {
      if (isEditMode && branch) {
        await updateBranch({
          ...branch,
          name: data.name,
          franchise_id: data.franchise_id,
          location: locationString,
        });
        toast.success("Branch details updated successfully!");
      } else {
        // Create the branch first
        const newBranch = await addBranch({
          name: data.name,
          franchise_id: data.franchise_id,
          location: locationString,
        });

        // If branch creation was successful and we have new services, add them
        if (newBranch && newServices.length > 0) {
          const servicePromises = newServices.map((service) =>
            addService({
              ...service,
              branch_id: newBranch.id,
            }),
          );
          await Promise.all(servicePromises);
          toast.success("Branch and services created successfully!");
        } else {
          toast.success("Branch created successfully!");
        }
      }
      onSuccess();
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} branch.`);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      await fetchBranches(); // Refetch to update the service list
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete service.");
    }
  };

  const handleAddService = (service: any) => {
    if (isEditMode && branch) {
      // For existing branches, we would use the ServiceDialog which handles this
      // This is just for the new branch case
    } else {
      // For new branches, add to local state
      setNewServices((prev) => [...prev, service]);
    }
  };

  const handleRemoveNewService = (index: number) => {
    setNewServices((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
      {/* Branch Details Form */}
      <div className="lg:col-span-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branch Details</CardTitle>
                <CardDescription>
                  {isEditMode
                    ? "Update the name and location for this branch."
                    : "Enter the details for the new branch."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          <Input placeholder="e.g., Karwi Downtown Branch" {...field} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="franchise_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Franchise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a franchise" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {franchises.map((franchise) => (
                            <SelectItem key={franchise.id} value={franchise.id}>
                              {franchise.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <LocationPicker
                          onLocationSelect={field.onChange}
                          initialPosition={field.value}
                          className="h-[300px] w-full md:h-[400px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update Branch Details" : "Add Branch"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Service Management Section */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Manage Services</CardTitle>
              <CardDescription>
                {isEditMode ? "Add, edit, or remove services for this branch." : "Add services for this new branch."}
              </CardDescription>
            </div>
            {!isEditMode && (
              <ServiceDialog branchId="" onServiceAdd={handleAddService}>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </ServiceDialog>
            )}
            {isEditMode && branch && (
              <ServiceDialog branchId={branch.id}>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </ServiceDialog>
            )}
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            <ScrollArea className="h-full w-full rounded-md border">
              <div className="space-y-4 p-4">
                {isEditMode ? (
                  // Existing branch services
                  branch.services && branch.services.length > 0 ? (
                    branch.services.map((service) => (
                      <div
                        key={service.id}
                        className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4"
                      >
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-muted-foreground text-sm">
                            ${service.price} &middot; {service.duration_min} mins
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <ServiceDialog branchId={branch.id} service={service}>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </ServiceDialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the &quot;{service.name}&quot; service. This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteService(service.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      // eslint-disable-next-line max-lines
                    ))
                  ) : (
                    <div className="text-muted-foreground flex h-[200px] items-center justify-center text-center">
                      No services have been added to this branch yet.
                    </div>
                  )
                ) : // New branch services (from local state)
                newServices.length > 0 ? (
                  newServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4"
                    >
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-muted-foreground text-sm">
                          ${service.price} &middot; {service.duration_min} mins
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleRemoveNewService(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground flex h-[200px] items-center justify-center text-center">
                    No services have been added to this branch yet.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
