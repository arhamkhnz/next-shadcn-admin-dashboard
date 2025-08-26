import { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminAccountSwitcher } from "@/app/(main)/admin/_components/admin-account-switcher";
import { AdminSidebar } from "@/app/(main)/admin/_components/admin-sidebar";
import { LayoutControls } from "@/app/(main)/dashboard/_components/sidebar/layout-controls";
import { SearchDialog } from "@/app/(main)/dashboard/_components/sidebar/search-dialog";
import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { isAdmin } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";
import {
  SIDEBAR_VARIANT_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  CONTENT_LAYOUT_VALUES,
  type SidebarVariant,
  type SidebarCollapsible,
  type ContentLayout,
} from "@/types/preferences/layout";

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/admin/login");
  }

  // Verify admin role - redirect to user dashboard if not admin
  const isAdminUser = await isAdmin(user.id);
  if (!isAdminUser) {
    redirect("/dashboard");
  }

  // Check if the admin is associated with a franchise
  const { data: franchise, error: franchiseError } = await supabase
    .from("franchises")
    .select("id")
    .eq("admin_id", user.id)
    .limit(1)
    .single();

  // If this admin manages a franchise, they should use the franchise login
  if (franchise || (franchiseError && franchiseError.code !== "PGRST116")) {
    redirect("/unauthorized");
  }

  // Set default values in case the preferences can't be loaded
  let sidebarVariant: SidebarVariant = "inset";
  let sidebarCollapsible: SidebarCollapsible = "icon";
  let contentLayout: ContentLayout = "centered";
  let defaultOpen = false;

  try {
    defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

    const preferences = await Promise.all([
      getPreference<SidebarVariant>("sidebar_variant", SIDEBAR_VARIANT_VALUES, "inset"),
      getPreference<SidebarCollapsible>("sidebar_collapsible", SIDEBAR_COLLAPSIBLE_VALUES, "icon"),
      getPreference<ContentLayout>("content_layout", CONTENT_LAYOUT_VALUES, "centered"),
    ]);

    [sidebarVariant, sidebarCollapsible, contentLayout] = preferences;
  } catch (error) {
    console.error("Error loading preferences:", error);
    // Use default values defined above
  }

  const layoutPreferences = {
    contentLayout,
    variant: sidebarVariant,
    collapsible: sidebarCollapsible,
  };

  const currentUser = {
    id: user.id,
    name: user.email ?? "Admin", // Or fetch from a 'profiles' table
    email: user.email ?? "",
    avatar: "", // Add a default avatar or fetch from profile
    role: "admin",
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
      <SidebarInset
        data-content-layout={contentLayout}
        className={cn(
          "data-[content-layout=centered]:!mx-auto data-[content-layout=centered]:max-w-screen-2xl",
          "max-[113rem]:peer-data-[variant=inset]:!mr-2 min-[101rem]:peer-data-[variant=inset]:peer-data-[state=collapsed]:!mr-auto",
        )}
      >
        <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
              <SearchDialog />
            </div>
            <div className="flex items-center gap-2">
              <LayoutControls {...layoutPreferences} />
              <ThemeSwitcher />
              <AdminAccountSwitcher user={currentUser} />
            </div>
          </div>
        </header>
        <div className="h-full p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
