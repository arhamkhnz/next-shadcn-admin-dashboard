"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productSchema } from "./schema";
import type { Product } from "./schema";
import { imageOptimizer } from "next/dist/server/image-optimizer";

const editProductSchema = productSchema.omit({ id: true, image: true });

interface ProductColumnsProps {
  onEdit: (id: string, data: Omit<Product, "id" | "image">) => void;
  onDelete: (id: string) => void;
}

export function createProductColumns({ onEdit, onDelete }: ProductColumnsProps): ColumnDef<Product>[] {
  return [
    {
      id: "select",
      header: ({ table }) => {
        const isAllSelected = table.getIsAllPageRowsSelected();
        const isSomeSelected = table.getIsSomePageRowsSelected();
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={isAllSelected || (isSomeSelected && "indeterminate")}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-sm">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Avatar className="size-10">
            <AvatarImage src={product.image} alt={product.name} />
            <AvatarFallback>
              <Smartphone className="size-4" />
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{product.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "brand",
      header: "Brand",
      cell: ({ row }) => row.original.brand,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.original.price);
        return `$${price.toLocaleString()}`;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />;
      },
    },
  ];
}

function ProductActions({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (id: string, data: Omit<Product, "id" | "image">) => void;
  onDelete: (id: string) => void;
}) {
  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      brand: product.brand,
      price: product.price,
    },
  });

  const onSubmit = (data: z.infer<typeof editProductSchema>) => {
    onEdit(product.id, data);
    toast.success("Product updated successfully");
  };

  const handleDelete = () => {
    onDelete(product.id);
    toast.success("Product deleted successfully");
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <Edit className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product information below.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <Trash2 className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this product? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
