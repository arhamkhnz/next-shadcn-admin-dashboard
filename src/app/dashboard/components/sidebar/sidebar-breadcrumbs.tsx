"use client";

import { usePathname } from "next/navigation";

import { House } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function SidebarBreadcrumbs() {
  const pathname = usePathname();
  const lastPathSegment = pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ");

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard/profile">
            <House className="size-4 text-gray-500" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden text-gray-400 md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Badge variant="secondary" className="capitalize">
              {lastPathSegment}
            </Badge>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
