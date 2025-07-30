"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  Building2,
  MapPin,
  UsersRound,
  Users,
  CreditCard,
  ClipboardList,
  Star,
  Calendar,
  Ticket,
} from "lucide-react";

import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/franchises", label: "Franchises", icon: Building2 },
  { href: "/admin/branches", label: "Branches", icon: MapPin },
  { href: "/admin/services", label: "Services", icon: ClipboardList },
  { href: "/admin/washers", label: "Washers", icon: UsersRound },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/schedule", label: "Schedule", icon: Calendar },
  { href: "/admin/promotions", label: "Promotions", icon: Ticket },
];

export function NavAdmin() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {adminNavItems.map((item) => (
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
