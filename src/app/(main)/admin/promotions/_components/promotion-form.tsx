"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePromotionStore } from "@/stores/admin-dashboard/promotion-store";
import { Promotion } from "@/types/database";

const promotionSchema = z.object({
  code: z.string().min(1, "Code is required"),
  discount: z.coerce.number().min(0, "Discount must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  active: z.boolean(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

interface PromotionFormProps {
  promotion?: Promotion;
  onClose: () => void;
}

export function PromotionForm({ promotion, onClose }: PromotionFormProps) {
  const addPromotion = usePromotionStore((state) => state.addPromotion);
  const updatePromotion = usePromotionStore((state) => state.updatePromotion);

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: promotion ?? {
      code: "",
      discount: 0,
      startDate: "",
      endDate: "",
      active: false,
    },
  });

  const onSubmit = (data: PromotionFormValues) => {
    if (promotion) {
      updatePromotion({ ...promotion, ...data });
    } else {
      addPromotion(data);
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount (%)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{promotion ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}
