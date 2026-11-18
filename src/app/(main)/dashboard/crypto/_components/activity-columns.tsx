import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "cn";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import type { DataTableFeatures } from "@/lib/data-table-features";

import { type AccountActivity, chartColors, cryptoAssets } from "./data";

const quantityFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 });
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

function activityColor(type: AccountActivity["type"]) {
  if (type === "Buy" || type === "Deposit") return chartColors.up;
  if (type === "Sell" || type === "Withdrawal") return chartColors.down;
  return undefined;
}

export const activityColumns: ColumnDef<DataTableFeatures, AccountActivity>[] = [
  {
    id: "asset",
    accessorFn: (activity) => {
      const asset = cryptoAssets.find((item) => item.symbol === activity.symbol);
      return `${asset?.name ?? ""} ${activity.symbol}`;
    },
    header: "Asset",
    cell: ({ row }) => {
      const asset = cryptoAssets.find((item) => item.symbol === row.original.symbol);
      if (!asset) return row.original.symbol;
      return (
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full",
              asset.iconBackgroundClassName,
            )}
          >
            <SimpleIcon icon={asset.icon} className={cn("size-4", asset.iconClassName)} aria-hidden="true" />
          </div>
          <span className="font-medium">{asset.name}</span>
          {asset.name !== asset.symbol && <span className="text-muted-foreground text-xs">{asset.symbol}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Activity",
    cell: ({ row }) => {
      const color = activityColor(row.original.type);
      return (
        <Badge
          variant="secondary"
          style={color ? { color, backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)` } : undefined}
        >
          {row.original.type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const { type, amount, symbol } = row.original;
      const incoming = type === "Buy" || type === "Deposit";
      const outgoing = type === "Sell" || type === "Withdrawal";
      let sign = "";
      if (incoming) sign = "+";
      else if (outgoing) sign = "−";

      return (
        <div className="text-right font-medium tabular-nums" style={{ color: activityColor(type) }}>
          {sign}
          {quantityFormatter.format(amount)}
          <span className="text-muted-foreground ml-1 text-xs font-normal">{symbol}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.status}</span>,
  },
  {
    accessorKey: "time",
    header: () => <div className="text-right">Date (UTC)</div>,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right tabular-nums">
        <time dateTime={row.original.time}>{dateFormatter.format(new Date(row.original.time))}</time>
      </div>
    ),
  },
];
