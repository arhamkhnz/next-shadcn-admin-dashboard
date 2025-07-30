"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";

import { Franchise } from "./types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Franchise name must be at least 2 characters.",
  }),
  status: z.enum(["active", "inactive"]),
  branches: z.coerce.number().min(0),
  washers: z.coerce.number().min(0),
});

type FranchiseFormValues = z.infer<typeof formSchema>;

interface FranchiseFormProps {
  franchise?: Franchise;
  onSuccess: () => void;
}

export function FranchiseForm({ franchise, onSuccess }: FranchiseFormProps) {
  const { addFranchise, updateFranchise } = useFranchiseStore();
  const form = useForm<FranchiseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: franchise ?? {
      name: "",
      status: "inactive",
      branches: 0,
      washers: 0,
    },
  });

  const onSubmit = (data: FranchiseFormValues) => {
    if (franchise) {
      updateFranchise({ ...franchise, ...data });
    } else {
      addFranchise(data);
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
              <FormLabel>Franchise Name</FormLabel>
              <FormControl>
                <Input placeholder="Karwi Wash..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branches"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branches</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="washers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Washers</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{franchise ? "Update" : "Create"} Franchise</Button>
      </form>
    </Form>
  );
}
