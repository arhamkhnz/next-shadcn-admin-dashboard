/* eslint-disable complexity */
/* eslint-disable max-lines */

"use client";

import { useMemo, useRef } from "react";

import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, MapPin, Phone, Star, Hash, FileText, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";

import { BranchPicturesField } from "./branch-pictures-field";
import { BranchTimeSlots } from "./branch-time-slots";
import { Branch } from "./types";

const formSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters."),
  franchise_id: z.string().uuid({ message: "Please select a franchise." }),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .refine((data) => data.lat && data.lng, {
      message: "Please select a location on the map.",
    }),
  address: z.string().optional(),
  city: z.string().optional(),
  phone_number: z.string().optional(),
  ratings: z.coerce.number().min(0).max(5).optional(),
  pictures: z.union([z.array(z.string()), z.string()]).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
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
  const { franchises } = useFranchiseStore();

  const LocationPicker = useMemo(
    () =>
      dynamic(() => import("./location-picker").then((mod) => mod.LocationPicker), {
        ssr: false,
        loading: () => <p className="text-muted-foreground text-sm">Loading map...</p>,
      }),
    [],
  );

  const isEditMode = !!branch;
  const timeSlotsFormRef = useRef<{ handleSaveAll:() => Promise<boolean> }>(null);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: branch?.name ?? "",
      franchise_id: branch?.franchise_id ?? "",
      location: parseLocation((branch as any)?.location),
      address: branch?.address ?? "",
      city: branch?.city ?? "",
      phone_number: branch?.phone_number ?? "",
      ratings: branch?.ratings ?? 0,
      pictures: branch?.pictures ?? [],
      latitude: branch?.latitude ?? 0,
      longitude: branch?.longitude ?? 0,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: BranchFormValues) => {
    // Process the pictures field
    const processedData = {
      ...data,
      pictures: Array.isArray(data.pictures)
        ? data.pictures
        : data.pictures
          ? data.pictures.split(",").map((item) => item.trim())
          : [],
    };

    const locationString = `POINT(${data.location.lng} ${data.location.lat})`;

    try {
      if (isEditMode && branch) {
        await updateBranch({
          ...branch,
          name: data.name,
          franchise_id: data.franchise_id,
          location: locationString,
          address: processedData.address,
          city: processedData.city,
          phone_number: processedData.phone_number,
          ratings: processedData.ratings,
          pictures: processedData.pictures,
          latitude: processedData.latitude,
          longitude: processedData.longitude,
        });

        // Save time slots if there are any unsaved changes
        if (timeSlotsFormRef.current) {
          const saveSuccess = await timeSlotsFormRef.current.handleSaveAll();
          if (!saveSuccess) {
            toast.error("Branch updated but failed to save operating hours.");
            return;
          }
        }

        toast.success("Branch details updated successfully!");
      } else {
        // Create the branch first
        await addBranch({
          name: data.name,
          franchise_id: data.franchise_id,
          location: locationString,
          franchise: franchises.find((f) => f.id === data.franchise_id)?.name ?? "",
          services: [],
          activeBookings: 0,
          address: processedData.address,
          city: processedData.city,
          phone_number: processedData.phone_number,
          ratings: processedData.ratings,
          pictures: processedData.pictures,
          latitude: processedData.latitude,
          longitude: processedData.longitude,
        });

        toast.success("Branch created successfully!");
      }
      await fetchBranches();
      onSuccess();
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? "update" : "create"} branch.`);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isEditMode ? (
            <>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </TabsTrigger>
                  <TabsTrigger value="hours" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Operating Hours
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input placeholder="e.g., Karwi Downtown Branch" {...field} className="h-12 pl-10" />
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
                            <SelectTrigger className="h-12">
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input placeholder="Contact phone number" {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ratings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ratings</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Star className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                placeholder="Branch rating (0-5)"
                                {...field}
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="pictures"
                    render={() => (
                      <FormItem>
                        <BranchPicturesField
                          form={form}
                          name="pictures"
                          label="Pictures"
                          placeholder="Comma-separated URLs of branch pictures"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="location" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input placeholder="Branch address" {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Branch city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input
                                type="number"
                                step="any"
                                placeholder="Geographic latitude"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input
                                type="number"
                                step="any"
                                placeholder="Geographic longitude"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Map Location</FormLabel>
                        <FormControl>
                          <LocationPicker
                            onLocationSelect={(location) => {
                              field.onChange(location);
                              // Update latitude and longitude fields when map location changes
                              form.setValue("latitude", location.lat);
                              form.setValue("longitude", location.lng);
                              // Update address and city if provided by geocoding
                              if (location.address) {
                                form.setValue("address", location.address);
                              }
                              if (location.city) {
                                form.setValue("city", location.city);
                              }
                            }}
                            initialPosition={field.value}
                            className="h-[250px] w-full overflow-hidden rounded-lg md:h-[300px] lg:h-[350px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="hours" className="mt-4">
                  <BranchTimeSlots
                    ref={timeSlotsFormRef}
                    branchId={branch.id}
                    className="h-full"
                    showSaveButton={false}
                  />
                </TabsContent>
              </Tabs>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Branch
                </Button>
              </div>
            </>
          ) : (
            <>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input placeholder="e.g., Karwi Downtown Branch" {...field} className="h-12 pl-10" />
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
                            <SelectTrigger className="h-12">
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
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input placeholder="Contact phone number" {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ratings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ratings</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Star className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                placeholder="Branch rating (0-5)"
                                {...field}
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="pictures"
                    render={() => (
                      <FormItem>
                        <BranchPicturesField
                          form={form}
                          name="pictures"
                          label="Pictures"
                          placeholder="Comma-separated URLs of branch pictures"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="location" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input placeholder="Branch address" {...field} className="pl-10" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Branch city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input
                                type="number"
                                step="any"
                                placeholder="Geographic latitude"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Hash className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                              <Input
                                type="number"
                                step="any"
                                placeholder="Geographic longitude"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                  field.onChange(value);
                                }}
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Map Location</FormLabel>
                        <FormControl>
                          <LocationPicker
                            onLocationSelect={(location) => {
                              field.onChange(location);
                              // Update latitude and longitude fields when map location changes
                              form.setValue("latitude", location.lat);
                              form.setValue("longitude", location.lng);
                              // Update address and city if provided by geocoding
                              if (location.address) {
                                form.setValue("address", location.address);
                              }
                              if (location.city) {
                                form.setValue("city", location.city);
                              }
                            }}
                            initialPosition={field.value}
                            className="h-[250px] w-full overflow-hidden rounded-lg md:h-[300px] lg:h-[350px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Branch
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
