/* eslint-disable complexity */

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Tag, DollarSign, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useServiceStore } from "@/stores/admin-dashboard/service-store";
import { Service } from "@/types/database";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  duration_min: z.coerce.number().int().min(5, "Duration must be at least 5 minutes."),
  todos: z.string().optional(),
  include: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  branchId: string;
  service?: Service;
  onSuccess: (newService?: any) => void; // Make newService parameter optional
}

export function ServiceForm({ branchId, service, onSuccess }: ServiceFormProps) {
  const { addService, updateService } = useServiceStore();
  const { fetchBranches } = useBranchStore();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      price: service?.price ?? 0,
      duration_min: service?.duration_min ?? 30,
      todos: service?.todos?.join(", ") ?? "",
      include: service?.include?.join(", ") ?? "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      // Process the todos and include fields
      const processedData = {
        ...data,
        todos: data.todos ? data.todos.split(",").map((item) => item.trim()) : [],
        include: data.include ? data.include.split(",").map((item) => item.trim()) : [],
      };

      if (service) {
        await updateService({ ...service, ...processedData });
        toast.success("Service updated successfully!");
        await fetchBranches(); // Refetch branches to get updated service lists
        onSuccess();
      } else {
        // For new branches (when branchId is empty), just return the data
        if (!branchId) {
          toast.success("Service added successfully!");
          onSuccess(processedData); // Pass the new service data back
        } else {
          // For existing branches, add to database
          await addService({ ...processedData, branchId: branchId });
          toast.success("Service created successfully!");
          await fetchBranches(); // Refetch branches to get updated service lists
          onSuccess();
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
