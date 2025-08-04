"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFranchiseBranchStore, Branch } from "@/stores/franchise-dashboard/branch-store";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Branch name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
});

type BranchFormValues = z.infer<typeof formSchema>;

interface BranchFormProps {
  branch?: Branch;
  onSuccess: () => void;
}

export function BranchForm({ branch, onSuccess }: BranchFormProps) {
  const { addBranch, updateBranch } = useFranchiseBranchStore();
  const form = useForm<BranchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: branch ?? {
      name: "",
      location: "",
    },
  });

  const onSubmit = (data: BranchFormValues) => {
    if (branch) {
      updateBranch({ ...branch, ...data });
    } else {
      addBranch({ ...data, services: [] });
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
        <Button type="submit">{branch ? "Update" : "Create"} Branch</Button>
      </form>
    </Form>
  );
}
