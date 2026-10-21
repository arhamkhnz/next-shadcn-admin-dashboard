"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { type Category, categories, type Product, type ProductStatus, statuses } from "./data";

interface ProductFormProps {
  product: Product | null;
  products: Product[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

export function ProductForm({ product, products, onClose, onSave }: ProductFormProps) {
  const [category, setCategory] = useState<Category>(product?.category ?? "Clothing");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "Draft");
  const [error, setError] = useState("");

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>Update your demo catalog. Changes last until you reload this page.</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const name = String(form.get("name") ?? "").trim();
            const sku = String(form.get("sku") ?? "")
              .trim()
              .toUpperCase();
            const price = Number(form.get("price"));
            const stock = Number(form.get("stock"));
            if (!name || !sku || !Number.isFinite(price) || price < 0 || !Number.isSafeInteger(stock) || stock < 0) {
              setError("Enter a name, unique SKU, valid price, and whole-number stock quantity.");
              return;
            }
            if (products.some((p) => p.id !== product?.id && p.sku.toUpperCase() === sku)) {
              setError("This SKU is already in use. Enter a unique SKU.");
              return;
            }
            onSave({
              id: product?.id ?? crypto.randomUUID(),
              name,
              sku,
              category,
              status,
              price,
              stock,
              sold: product?.sold ?? 0,
            });
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="product-name">Product name</FieldLabel>
              <Input id="product-name" name="name" defaultValue={product?.name} required maxLength={100} />
            </Field>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
              <Input
                id="product-sku"
                name="sku"
                defaultValue={product?.sku}
                required
                maxLength={40}
                aria-invalid={!!error}
                aria-describedby={error ? "product-error" : undefined}
                onChange={() => setError("")}
              />
              {error && <FieldError id="product-error">{error}</FieldError>}
            </Field>
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="product-category">Category</FieldLabel>
                <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                  <SelectTrigger id="product-category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="product-status">Status</FieldLabel>
                <Select value={status} onValueChange={(value) => setStatus(value as ProductStatus)}>
                  <SelectTrigger id="product-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statuses.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="product-price">Price (USD)</FieldLabel>
                <Input
                  id="product-price"
                  name="price"
                  type="number"
                  min="0"
                  max="1000000"
                  step="0.01"
                  defaultValue={product?.price}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="product-stock">Stock quantity</FieldLabel>
                <Input
                  id="product-stock"
                  name="stock"
                  type="number"
                  min="0"
                  max="1000000"
                  step="1"
                  defaultValue={product?.stock ?? 0}
                  required
                />
              </Field>
            </FieldGroup>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">{product ? "Save changes" : "Add product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
