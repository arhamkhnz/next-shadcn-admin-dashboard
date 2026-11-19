import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "cn";

import { SimpleIcon } from "@/components/simple-icon";
import { Badge } from "@/components/ui/badge";
import type { DataTableFeatures } from "@/lib/data-table-features";

import { type AccountActivity, cryptoAssets } from "./data";

const quantityFormatter = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 });
const statusClasses = {
  Completed: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
};
const activityClasses = {
  Buy: "bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300",
  Deposit: "bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300",
  Sell: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  Withdrawal: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  Transfer: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
};
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

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
    cell: ({ row }) => (
      <Badge variant="secondary" className={cn("rounded-sm", activityClasses[row.original.type])}>
        {row.original.type}
      </Badge>
    ),
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
        <div className="flex items-baseline justify-end gap-2 text-right">
          <span className="font-mono tabular-nums">
            {sign}
            {quantityFormatter.format(amount)}
          </span>
          <span className="text-muted-foreground w-7 shrink-0 text-left text-xs">{symbol}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary" className={cn("rounded-sm", statusClasses[row.original.status])}>
        {row.original.status}
      </Badge>
    ),
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
