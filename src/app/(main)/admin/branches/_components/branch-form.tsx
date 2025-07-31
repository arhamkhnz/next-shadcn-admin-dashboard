"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";

import { Branch } from "./types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Branch name must be at least 2 characters.",
  }),
  franchise: z.string({
    required_error: "Please select a franchise.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  services: z.coerce.number().min(0),
  activeBookings: z.coerce.number().min(0),
});

type BranchFormValues = z.infer<typeof formSchema>;

interface BranchFormProps {
  branch?: Branch;
  onSuccess: () => void;
}

export function BranchForm({ branch, onSuccess }: BranchFormProps) {
  const { addBranch, updateBranch } = useBranchStore();
  const { franchises } = useFranchiseStore();
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: branch ?? {
      name: "",
      franchise_id: "",
      location: "",
      services: 0,
      activeBookings: 0,
    },
  });

  const onSubmit = (data: BranchFormValues) => {
    if (branch) {
      updateBranch({ ...branch, ...data });
    } else {
      addBranch(data);
    }
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Downtown..." {...field} />
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
                    <SelectItem key={franchise.id} value={franchise.name}>
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
                <Input placeholder="123 Main St..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activeBookings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Active Bookings</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{branch ? "Update" : "Create"} Branch</Button>
      </form>
    </Form>
  );
}
