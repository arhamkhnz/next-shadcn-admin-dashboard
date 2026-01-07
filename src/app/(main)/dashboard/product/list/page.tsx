"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProductTable } from "../_components/product-table";
import { AddProductDialog } from "../_components/add-product-dialog";
import type { Product } from "../_components/schema";

const initialProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    brand: "Apple",
    price: "999",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "Galaxy S24",
    brand: "Samsung",
    price: "899",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Pixel 8 Pro",
    brand: "Google",
    price: "799",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    name: "OnePlus 12",
    brand: "OnePlus",
    price: "699",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    name: "Xiaomi 14",
    brand: "Xiaomi",
    price: "599",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop",
  },
  {
    id: "6",
    name: "MacBook Pro 16",
    brand: "Apple",
    price: "2499",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
  },
  {
    id: "7",
    name: "Dell XPS 15",
    brand: "Dell",
    price: "1799",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
  },
  {
    id: "8",
    name: "Surface Laptop 5",
    brand: "Microsoft",
    price: "1299",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
  },
  {
    id: "9",
    name: "iPad Pro",
    brand: "Apple",
    price: "1099",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3a8f15d?w=100&h=100&fit=crop",
  },
  {
    id: "10",
    name: "Samsung Galaxy Tab S9",
    brand: "Samsung",
    price: "899",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3a8f15d?w=100&h=100&fit=crop",
  },
];

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>(initialProducts);

  const handleAdd = React.useCallback((data: { name: string; brand: string; price: string; image?: File }) => {
    const productId = Date.now().toString();
    
    if (data.image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProduct: Product = {
          id: productId,
          name: data.name,
          brand: data.brand,
          price: data.price,
          image: reader.result as string,
        };
        setProducts((prev) => [...prev, newProduct]);
      };
      reader.readAsDataURL(data.image);
    } else {
      const newProduct: Product = {
        id: productId,
        name: data.name,
        brand: data.brand,
        price: data.price,
        image: undefined,
      };
      setProducts((prev) => [...prev, newProduct]);
    }
  }, []);

  const handleEdit = React.useCallback((id: string, data: Omit<Product, "id" | "image">) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...data } : product))
    );
  }, []);

  const handleDelete = React.useCallback((id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  }, []);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <AddProductDialog
          onAdd={handleAdd}
          trigger={
            <Button>
              <Plus className="mr-2 size-4" />
              Add Product
            </Button>
          }
        />
      </div>
      <ProductTable data={products} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
