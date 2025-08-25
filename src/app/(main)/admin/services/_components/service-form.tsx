/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable complexity */

"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Tag, DollarSign, Clock, Image, Hash, FileText, List } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";
import { Service } from "@/types/database";

import { AvailabilityList } from "./availability/availability-list";
import { PicturesField } from "./pictures-field";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  duration_min: z.coerce.number().min(0, "Duration must be positive"),
  todos: z.string().optional(),
  include: z.string().optional(),
  pictures: z.union([z.array(z.string()), z.string()]).optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service;
  onClose: () => void;
}

export function ServiceForm({ service, onClose }: ServiceFormProps) {
  const { branches, fetchBranches } = useBranchStore();
  const addService = useServiceStore((state) => state.addService);
  const addGlobalService = useServiceStore((state) => state.addGlobalService);
  const updateService = useServiceStore((state) => state.updateService);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const form = useForm<ServiceFormValues & { branchId?: string; is_global: boolean }>({
    resolver: zodResolver(
      serviceSchema.extend({
        branchId: z.string().optional(),
        is_global: z.boolean().default(false),
      }),
    ),
    defaultValues: service
      ? {
          name: service.name ?? "",
          description: service.description ?? "",
          price: service.price ?? 0,
          duration_min: service.duration_min ?? 30,
          todos: service.todos ? service.todos.join(", ") : "",
          include: service.include ? service.include.join(", ") : "",
          is_global: service.is_global ?? false,
          pictures: service.pictures ?? [],
        }
      : {
          name: "",
          description: "",
          price: 0,
          duration_min: 30,
          todos: "",
          include: "",
          is_global: false,
          pictures: [],
        },
  });

  const onSubmit = (data: ServiceFormValues & { branchId?: string; is_global: boolean }) => {
    // Process the todos, include, and pictures fields
    const processedData = {
      ...data,
      todos: data.todos ? data.todos.split(",").map((item) => item.trim()) : [],
      include: data.include ? data.include.split(",").map((item) => item.trim()) : [],
      // Pictures are already handled as an array by the PicturesField component
      pictures: Array.isArray(data.pictures)
        ? data.pictures
        : data.pictures
          ? data.pictures.split(",").map((item) => item.trim())
          : [],
    };

    if (service) {
      updateService({
        ...service,
        ...processedData,
      });
    } else {
      if (data.is_global) {
        // Create global service
        addGlobalService(processedData);
      } else if (data.branchId) {
        // Create branch-specific service
        addService({
          ...processedData,
          branchId: data.branchId,
        });
      }
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {service ? (
          <>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="availability" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Availability
                </TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Service description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="todos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          To-Dos
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Comma-separated list of to-dos" {...field} />
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
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Include
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Comma-separated list of included items" {...field} />
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
                      <PicturesField
                        form={form}
                        name="pictures"
                        label="Pictures"
                        placeholder="Comma-separated URLs of service pictures"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="todos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          To-Dos
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Comma-separated list of to-dos" {...field} />
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
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Include
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Comma-separated list of included items" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="availability" className="mt-4">
                {service && <AvailabilityList serviceId={service.id} />}
              </TabsContent>
            </Tabs>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{service ? "Update" : "Create"}</Button>
            </div>
          </>
        ) : (
          <>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Service description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <FormField
                  control={form.control}
                  name="pictures"
                  render={() => (
                    <FormItem>
                      <PicturesField
                        form={form}
                        name="pictures"
                        label="Pictures"
                        placeholder="Comma-separated URLs of service pictures"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="todos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <List className="h-4 w-4" />
                          To-Dos
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Comma-separated list of to-dos" {...field} />
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
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Include
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Comma-separated list of included items" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4 space-y-4">
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
                            ? "This service will be available at all branches"
                            : "This service will only be available at selected branch"}
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={form.watch("is_global")}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!service && !form.watch("is_global") && !form.watch("branchId")}>
                {service ? "Update" : "Create"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
