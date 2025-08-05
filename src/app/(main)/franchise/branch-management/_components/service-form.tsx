"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Tag, DollarSign, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore, Service } from "@/stores/franchise-dashboard/service-store";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  duration_min: z.coerce.number().int().min(5, "Duration must be at least 5 minutes."),
});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  branchId: string;
  service?: Service;
  onSuccess: () => void;
}

export function ServiceForm({ branchId, service, onSuccess }: ServiceFormProps) {
  const { addService, updateService } = useFranchiseServiceStore();
  const { fetchBranches } = useFranchiseBranchStore();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name ?? "",
      price: service?.price ?? 0,
      duration_min: service?.duration_min ?? 30,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      if (service) {
        await updateService({ ...service, ...data });
        toast.success("Service updated successfully!");
      } else {
        await addService({ ...data, branch_id: branchId });
        toast.success("Service created successfully!");
      }
      await fetchBranches(); // Refetch branches to get updated service lists
      onSuccess();
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
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
