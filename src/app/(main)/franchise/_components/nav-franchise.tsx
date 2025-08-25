import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart3, FileText, MapPin, UsersRound, History, Wrench, Tag } from "lucide-react";

import { cn } from "@/lib/utils";

const franchiseNavItems = [
  { href: "/franchise/analytics", label: "Franchise Analytics", icon: BarChart3 },
  { href: "/franchise/branch-analytics", label: "Branch Analytics", icon: BarChart3 },
  { href: "/franchise/promotions", label: "Promotions", icon: Tag },
  { href: "/franchise/reports", label: "Reports", icon: FileText },
  { href: "/franchise/branch-management", label: "Branch Management", icon: MapPin },
  { href: "/franchise/washer-management", label: "Washer Management", icon: UsersRound },
  { href: "/franchise/booking-history", label: "Booking History", icon: History },
];

export function NavFranchise() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {franchiseNavItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <span
            className={cn(
              "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
              pathname === item.href ? "bg-accent" : "transparent",
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
