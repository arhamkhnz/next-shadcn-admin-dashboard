"use client";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminStore } from "@/stores/admin-dashboard/admin-store";
import { useFranchiseStore } from "@/stores/admin-dashboard/franchise-store";

import { Franchise } from "./types";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Franchise name must be at least 2 characters.",
    }),
    status: z.enum(["active", "inactive"]),
    branches: z.coerce.number().min(0),
    washers: z.coerce.number().min(0),
    adminEmail: z
      .string()
      .email({
        message: "Please enter a valid email address.",
      })
      .optional(),
    adminPassword: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .optional(),
  })
  .refine(
    (data) => {
      // If creating a new franchise, both adminEmail and adminPassword are required
      if (!data.adminEmail && !data.adminPassword) {
        return true; // Allow empty for existing franchises
      }
      return data.adminEmail && data.adminPassword;
    },
    {
      message: "Both admin email and password are required for new franchises.",
      path: ["adminEmail"], // This will attach the error to the adminEmail field
    },
  );

type FranchiseFormValues = z.infer<typeof formSchema>;

interface FranchiseFormProps {
  franchise?: Franchise;
  onSuccess: () => void;
}

export function FranchiseForm({ franchise, onSuccess }: FranchiseFormProps) {
  const { addFranchise, updateFranchise } = useFranchiseStore();
  const { admins, fetchAdmins } = useAdminStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FranchiseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: franchise
      ? {
          name: franchise.name,
          status: franchise.status as "active" | "inactive",
          branches: franchise.branches,
          washers: franchise.washers,
        }
      : {
          name: "",
          status: "inactive",
          branches: 0,
          washers: 0,
          adminEmail: "",
          adminPassword: "",
        },
  });

  // Fetch admins for the select dropdown when editing a franchise
  useEffect(() => {
    if (franchise && admins.length === 0) {
      fetchAdmins();
    }
  }, [franchise, admins.length, fetchAdmins]);

  const onSubmit = async (data: FranchiseFormValues) => {
    setIsLoading(true);
    try {
      if (franchise) {
        // For existing franchises, we're just updating the details
        await updateFranchise({
          ...franchise,
          name: data.name,
          status: data.status,
          branches: data.branches,
          washers: data.washers,
        });
      } else {
        // For new franchises, we need to create an admin user first
        // This is a simplified approach - in a real app, you'd want to handle this more securely
        await addFranchise({
          name: data.name,
          status: data.status,
          branches: data.branches,
          washers: data.washers,
          adminEmail: data.adminEmail!,
          adminPassword: data.adminPassword!,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show notification)
    } finally {
      setIsLoading(false);
    }
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
                <Input placeholder="e.g., Karwi Erbil" {...field} />
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

        {!franchise && (
          <>
            <FormField
              control={form.control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Email</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., admin@karwi-erbil.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : franchise ? "Update" : "Create"} Franchise
        </Button>
      </form>
    </Form>
  );
}
