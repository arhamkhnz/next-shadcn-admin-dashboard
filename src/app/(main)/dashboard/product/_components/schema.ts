import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;
