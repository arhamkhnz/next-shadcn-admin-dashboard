"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranchStore } from "@/stores/admin-dashboard/branch-store";
import { useWasherStore } from "@/stores/admin-dashboard/washer-store";

import { Washer } from "./types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Washer name must be at least 2 characters.",
  }),
  branch: z.string({
    required_error: "Please select a branch.",
  }),
  status: z.enum(["active", "inactive"]),
  rating: z.coerce.number().min(0).max(5),
});

type WasherFormValues = z.infer<typeof formSchema>;

interface WasherFormProps {
  washer?: Washer;
  onSuccess: () => void;
}

export function WasherForm({ washer, onSuccess }: WasherFormProps) {
  const { addWasher, updateWasher } = useWasherStore();
  const { branches } = useBranchStore();
  const form = useForm<WasherFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: washer ?? {
      name: "",
      status: "inactive",
      rating: 0,
    },
  });

  const onSubmit = (data: WasherFormValues) => {
    if (washer) {
      updateWasher({ ...washer, ...data });
    } else {
      addWasher(data);
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
              <FormLabel>Washer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mohammed Ahmed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
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
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{washer ? "Update" : "Create"} Washer</Button>
      </form>
    </Form>
  );
}
