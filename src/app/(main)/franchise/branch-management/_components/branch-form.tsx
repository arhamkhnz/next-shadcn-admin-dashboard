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
import { Separator } from "@/components/ui/separator";
import { useFranchiseBranchStore, Branch } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";
import { Database } from "@/types/database";

import { ServiceDialog } from "./service-dialog";

const formSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters."),
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
  const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }
  return undefined;
};

export function BranchForm({ branch, onSuccess }: BranchFormProps) {
  const { addBranch, updateBranch, fetchBranches } = useFranchiseBranchStore();
  const { deleteService } = useFranchiseServiceStore();
  const [franchiseId, setFranchiseId] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  const LocationPicker = useMemo(
    () =>
      dynamic(() => import("./location-picker").then((mod) => mod.LocationPicker), {
        ssr: false,
        loading: () => <p>Loading map...</p>,
      }),
    [],
  );

  useEffect(() => {
    const getFranchiseId = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        console.log("Session found, fetching franchise ID for user:", session.user.id);
        const { data, error } = await supabase.from("franchises").select("id").eq("admin_id", session.user.id).single();
        if (error) {
          toast.error("Could not fetch franchise information.");
          console.error("Error fetching franchise ID:", error);
        } else if (data) {
          console.log("Franchise ID fetched successfully:", data.id);
          setFranchiseId(data.id);
        } else {
          console.log("No franchise found for this user.");
          toast.error("No franchise found for this user.");
        }
      } else {
        console.log("No active session found.");
      }
    };
    getFranchiseId();
  }, [supabase]);

  const isEditMode = !!branch;

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: branch?.name ?? "",
      location: parseLocation(branch?.location),
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: BranchFormValues) => {
    if (!isEditMode && !franchiseId) {
      toast.error("Franchise ID is not available. Cannot create branch.");
      return;
    }

    const locationString = `POINT(${data.location.lng} ${data.location.lat})`;

    try {
      if (isEditMode && branch) {
        await updateBranch({ ...branch, name: data.name, location: locationString });
        toast.success("Branch details updated successfully!");
      } else {
        await addBranch({
          name: data.name,
          franchise_id: franchiseId!,
          location: locationString,
        });
        toast.success("Branch created successfully!");
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

  return (
    <div className={`grid grid-cols-1 gap-8 ${branch ? "lg:grid-cols-2" : ""}`}>
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
                          <Input placeholder="e.g., Karwi Residential Compound" {...field} className="pl-10" />
                        </div>
                      </FormControl>
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
                          className="h-[300px] md:h-[400px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || (!isEditMode && !franchiseId)}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? "Update Branch Details" : "Add Branch"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Service Management Section */}
      {branch && (
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div className="space-y-1.5">
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>Add, edit, or remove services for this branch.</CardDescription>
              </div>
              <ServiceDialog branchId={branch.id}>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </ServiceDialog>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded-md border lg:h-[450px]">
                <div className="space-y-4 p-4">
                  {branch.services && branch.services.length > 0 ? (
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
      )}
    </div>
  );
}
