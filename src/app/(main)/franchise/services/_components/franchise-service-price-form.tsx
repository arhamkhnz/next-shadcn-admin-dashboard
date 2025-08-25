"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";
import { Service } from "@/types/database";

const priceFormSchema = z.object({
  price: z.coerce.number().min(0, "Price must be a positive number."),
});

type PriceFormValues = z.infer<typeof priceFormSchema>;

interface FranchiseServicePriceFormProps {
  service: Service;
  onSuccess: () => void;
}

export function FranchiseServicePriceForm({ service, onSuccess }: FranchiseServicePriceFormProps) {
  const { updateService } = useFranchiseServiceStore();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(priceFormSchema),
    defaultValues: {
      price: service.price ?? 0,
    },
  });

  const onSubmit = async (data: PriceFormValues) => {
    try {
      await updateService({
        ...service,
        price: data.price,
      });
      toast.success("Service price updated successfully!");
      setIsEditing(false);
      onSuccess();
    } catch (error) {
      toast.error("Failed to update service price.");
      console.error("Error updating service price:", error);
    }
  };

  if (isEditing) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" {...field} className="w-32" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="sm">
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              form.reset();
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold">${service.price?.toFixed(2) ?? "0.00"}</span>
      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
        Edit Price
      </Button>
    </div>
  );
}
