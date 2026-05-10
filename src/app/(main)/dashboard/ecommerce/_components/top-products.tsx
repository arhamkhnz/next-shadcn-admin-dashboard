import { ArrowUpRight } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const categories = [
  {
    name: "Apparel",
    share: 44,
    color: "var(--chart-3)",
  },
  {
    name: "Accessories",
    share: 32,
    color: "var(--chart-2)",
  },
  {
    name: "Home",
    share: 24,
    color: "var(--chart-1)",
  },
] as const;

const products = [
  {
    name: "Linen Overshirt",
    category: "Apparel",
    share: "31%",
    sales: "$14,820",
  },
  {
    name: "Everyday Tote",
    category: "Accessories",
    share: "24%",
    sales: "$11,460",
  },
  {
    name: "Ceramic Planter",
    category: "Home",
    share: "18%",
    sales: "$8,930",
  },
] as const;

export function TopProducts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-muted-foreground text-sm">Top Products</CardTitle>
        <CardDescription className="text-foreground text-xl tabular-nums leading-none tracking-tight">
          73% of sales
        </CardDescription>
        <CardAction>
          <ArrowUpRight className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div aria-label="Sales by category" className="flex h-2 gap-1 overflow-hidden bg-muted" role="img">
            {categories.map((category) => (
              <div
                aria-hidden="true"
                key={category.name}
                className="rounded-md"
                style={{
                  backgroundColor: category.color,
                  width: `${category.share}%`,
                }}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <div className="flex items-center gap-1" key={category.name}>
                <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-muted-foreground text-xs">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-3">
          <div className="text-muted-foreground text-xs">Products</div>
          <div className="text-muted-foreground text-xs">Share</div>
          <div className="text-muted-foreground text-xs">Sales</div>

          {products.map((product) => (
            <div className="contents text-sm" key={product.name}>
              <div className="min-w-0">
                <div className="truncate font-medium">{product.name}</div>
                <div className="text-muted-foreground text-xs">{product.category}</div>
              </div>
              <div className="self-center text-muted-foreground tabular-nums">{product.share}</div>
              <div className="self-center font-medium tabular-nums">{product.sales}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
