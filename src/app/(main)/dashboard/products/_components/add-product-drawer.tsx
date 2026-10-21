"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { categories, statuses } from "./data";
import { maxProductImageSize, ProductImagesField, productImageTypes } from "./product-images-field";

const productSchema = z.object({
  name: z.string().trim().min(1, "Enter a product name.").max(100, "Use 100 characters or fewer."),
  description: z.string().trim().min(1, "Enter a product description.").max(2000, "Use 2,000 characters or fewer."),
  images: z
    .array(z.custom<File>((value) => typeof File !== "undefined" && value instanceof File))
    .max(5, "Select up to 5 images.")
    .refine((files) => files.every((file) => productImageTypes.includes(file.type)), "Use JPG, PNG, or WebP images.")
    .refine(
      (files) => files.every((file) => file.size > 0 && file.size <= maxProductImageSize),
      "Each image must be non-empty and no larger than 5 MB.",
    ),
  sku: z
    .string()
    .trim()
    .min(1, "Enter a SKU.")
    .max(40, "Use 40 characters or fewer.")
    .regex(/^[A-Za-z0-9_-]+$/, "Use letters, numbers, hyphens, or underscores."),
  category: z.enum(categories),
  status: z.enum(statuses),
  price: z
    .string()
    .min(1, "Enter a price.")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a non-negative price with up to two decimal places.")
    .refine((value) => Number(value) <= 1_000_000, "Price must not exceed $1,000,000."),
  stock: z
    .string()
    .min(1, "Enter a stock quantity.")
    .regex(/^\d+$/, "Enter a non-negative whole number.")
    .refine((value) => Number(value) <= 1_000_000, "Stock must not exceed 1,000,000."),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductDrawer() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      images: [],
      sku: "",
      category: "Clothing",
      status: "Draft",
      price: "",
      stock: "0",
    },
  });
  const { errors } = form.formState;

  return (
    <Drawer
      direction="right"
      onOpenChange={(open) => {
        if (!open) form.reset();
      }}
    >
      <DrawerTrigger asChild>
        <Button size="sm">
          <PackagePlus data-icon="inline-start" />
          Add product
        </Button>
      </DrawerTrigger>
      <DrawerContent className="data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-lg">
        <DrawerHeader className="shrink-0 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <DrawerTitle>Add product</DrawerTitle>
              <DrawerDescription>Enter product details, pricing, and inventory.</DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Close add product">
                <X />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={form.handleSubmit(() => undefined)}>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="add-product-name">Product name</FieldLabel>
                <Input
                  id="add-product-name"
                  placeholder="e.g. Organic Cotton Crew Tee"
                  autoComplete="off"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "add-product-name-error" : undefined}
                  {...form.register("name")}
                />
                {errors.name && <FieldError id="add-product-name-error">{errors.name.message}</FieldError>}
              </Field>
              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="add-product-description">Description</FieldLabel>
                <Textarea
                  id="add-product-description"
                  rows={4}
                  className="max-h-48 min-h-24"
                  placeholder="Describe the product, materials, and key features."
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "add-product-description-error" : undefined}
                  {...form.register("description")}
                />
                {errors.description && (
                  <FieldError id="add-product-description-error">{errors.description.message}</FieldError>
                )}
              </Field>
              <Controller
                name="images"
                control={form.control}
                defaultValue={[]}
                render={({ field, fieldState }) => (
                  <ProductImagesField
                    files={field.value}
                    inputRef={field.ref}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    onChange={(files) => {
                      form.setValue("images", files, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                    }}
                  />
                )}
              />
              <Field data-invalid={!!errors.sku}>
                <FieldLabel htmlFor="add-product-sku">SKU</FieldLabel>
                <Input
                  id="add-product-sku"
                  placeholder="e.g. CL-TEE-105"
                  autoComplete="off"
                  aria-invalid={!!errors.sku}
                  aria-describedby={errors.sku ? "add-product-sku-error" : undefined}
                  {...form.register("sku")}
                />
                {errors.sku && <FieldError id="add-product-sku-error">{errors.sku.message}</FieldError>}
              </Field>
              <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="add-product-category">Category</FieldLabel>
                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="add-product-category"
                          ref={field.ref}
                          onBlur={field.onBlur}
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                          aria-describedby={fieldState.error ? "add-product-category-error" : undefined}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError id="add-product-category-error">{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="add-product-status">Status</FieldLabel>
                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="add-product-status"
                          ref={field.ref}
                          onBlur={field.onBlur}
                          className="w-full"
                          aria-invalid={fieldState.invalid}
                          aria-describedby={fieldState.error ? "add-product-status-error" : undefined}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError id="add-product-status-error">{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
                <Field data-invalid={!!errors.price}>
                  <FieldLabel htmlFor="add-product-price">Price (USD)</FieldLabel>
                  <Input
                    id="add-product-price"
                    type="number"
                    min="0"
                    max="1000000"
                    step="0.01"
                    placeholder="0.00"
                    aria-invalid={!!errors.price}
                    aria-describedby={errors.price ? "add-product-price-error" : undefined}
                    {...form.register("price")}
                  />
                  {errors.price && <FieldError id="add-product-price-error">{errors.price.message}</FieldError>}
                </Field>
                <Field data-invalid={!!errors.stock}>
                  <FieldLabel htmlFor="add-product-stock">Stock quantity</FieldLabel>
                  <Input
                    id="add-product-stock"
                    type="number"
                    min="0"
                    max="1000000"
                    step="1"
                    aria-invalid={!!errors.stock}
                    aria-describedby={errors.stock ? "add-product-stock-error" : undefined}
                    {...form.register("stock")}
                  />
                  {errors.stock && <FieldError id="add-product-stock-error">{errors.stock.message}</FieldError>}
                </Field>
              </FieldGroup>
              {form.formState.isSubmitSuccessful && form.formState.isValid && (
                <FieldDescription role="status">Product details are valid.</FieldDescription>
              )}
            </FieldGroup>
          </div>
          <DrawerFooter className="shrink-0 border-t sm:flex-row sm:justify-end">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button type="submit">Validate product</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
