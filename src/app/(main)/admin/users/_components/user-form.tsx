"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/admin-dashboard/user-store";

import { User } from "./types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "User name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  cars: z.coerce.number().min(0),
  bookings: z.coerce.number().min(0),
  totalWashes: z.coerce.number().min(0),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  user: User;
  onSuccess: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { updateUser } = useUserStore();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: user,
  });

  const onSubmit = (data: UserFormValues) => {
    updateUser({ ...user, ...data });
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mohammed Ahmed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cars"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cars</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bookings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bookings</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalWashes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Washes</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update User</Button>
      </form>
    </Form>
  );
}
