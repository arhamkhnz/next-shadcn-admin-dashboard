/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable complexity */

"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Tag, DollarSign, Clock, Globe } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { ServicePromotionManagement } from "@/app/(main)/franchise/services/_components/service-promotion-management";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore, Service } from "@/stores/franchise-dashboard/service-store";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  duration_min: z.coerce.number().int().min(5, "Duration must be at least 5 minutes."),
  todos: z.string().optional(),
  include: z.string().optional(),
  is_global: z.boolean().default(false),
});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  branchId: string;
  service?: Service & { is_global?: boolean };
  onSuccess: () => void;
}

export function ServiceForm({ branchId, service, onSuccess }: ServiceFormProps) {
  const { addService, addGlobalService, updateService } = useFranchiseServiceStore();
  const { fetchBranches } = useFranchiseBranchStore();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      price: service?.price ?? 0,
      duration_min: service?.duration_min ?? 30,
      todos: service?.todos?.join(", ") ?? "",
      include: service?.include?.join(", ") ?? "",
      is_global: service?.is_global ?? false,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Handle form submission for both add and edit operations
  const onSubmit = async (data: ServiceFormValues) => {
    try {
      // Process the todos and include fields
      const processedData = {
        ...data,
        todos: data.todos ? data.todos.split(",").map((item) => item.trim()) : [],
        include: data.include ? data.include.split(",").map((item) => item.trim()) : [],
      };

      if (service) {
        // EDIT FEATURE: Update existing service with new data
        await updateService({ ...service, ...processedData });
        toast.success("Service updated successfully!");
      } else {
        if (data.is_global) {
          // ADD FEATURE: Create global service that applies to all branches
          await addGlobalService({
            ...processedData,
            name: processedData.name,
            price: processedData.price,
            duration_min: processedData.duration_min,
          });
          toast.success("Global service created successfully! It will be available at all branches.");
        } else {
          // ADD FEATURE: Create branch-specific service
          await addService({
            ...processedData,
            branchId: branchId,
            is_global: false,
          });
          toast.success("Service created successfully!");
        }
      }
      await fetchBranches(); // Refetch branches to get updated service lists
      onSuccess();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  // Watch the is_global field to control other fields
  const isGlobal = form.watch("is_global");
  const isEditing = !!service;

  // For global services, only allow editing the price
  const isGlobalServiceEditing = isEditing && service.is_global;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isGlobalServiceEditing ? (
          // Simplified form for editing global service prices with promotion management
          <>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      This is a global service. You can only modify the price for this branch.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input type="number" step="0.01" placeholder="e.g., 25.00" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="promotions" className="mt-4">
                {service && <ServicePromotionManagement serviceId={service.id} />}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Price
              </Button>
            </div>
          </>
        ) : service ? (
          <>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {isEditing && service.is_global
                        ? "This is a global service. You can only modify the price for this branch."
                        : "You can only modify the price for this service."}
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input type="number" step="0.01" placeholder="e.g., 25.00" {...field} className="pl-10" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Display other service details as read-only */}
                  <div className="space-y-2">
                    <div>
                      <FormLabel>Description</FormLabel>
                      <p className="text-muted-foreground">{service.description ?? "No description provided"}</p>
                    </div>
                    <div>
                      <FormLabel>Duration</FormLabel>
                      <p className="text-muted-foreground">{service.duration_min ?? "N/A"} minutes</p>
                    </div>
                    {service.todos && service.todos.length > 0 && (
                      <div>
                        <FormLabel>To-Dos</FormLabel>
                        <ul className="text-muted-foreground list-inside list-disc">
                          {service.todos.map((todo: string, index: number) => (
                            <li key={index}>{todo}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {service.include && service.include.length > 0 && (
                      <div>
                        <FormLabel>Includes</FormLabel>
                        <ul className="text-muted-foreground list-inside list-disc">
                          {service.include.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="promotions" className="mt-4">
                {service && <ServicePromotionManagement serviceId={service.id} />}
              </TabsContent>
            </Tabs>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Price
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input placeholder="e.g., Standard Wash" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Service description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input type="number" step="0.01" placeholder="e.g., 25.00" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input type="number" step="5" placeholder="e.g., 45" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="todos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To-Dos</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma-separated list of to-dos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="include"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Include</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma-separated list of included items" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_global"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center text-base">
                        <Globe className="mr-2 h-4 w-4" />
                        Global Service
                      </FormLabel>
                      <p className="text-muted-foreground text-sm">
                        {field.value
                          ? "This service will be available at all branches in your franchise"
                          : "This service will only be available at this branch"}
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {service ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
