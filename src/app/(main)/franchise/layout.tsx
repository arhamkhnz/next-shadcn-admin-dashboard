import { ReactNode } from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { LayoutControls } from "@/app/(main)/dashboard/_components/sidebar/layout-controls";
import { SearchDialog } from "@/app/(main)/dashboard/_components/sidebar/search-dialog";
import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";
import { FranchiseAccountSwitcher } from "@/app/(main)/franchise/_components/franchise-account-switcher";
import { FranchiseSidebar } from "@/app/(main)/franchise/_components/franchise-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";
import {
  CONTENT_LAYOUT_VALUES,
  SIDEBAR_COLLAPSIBLE_VALUES,
  SIDEBAR_VARIANT_VALUES,
  type ContentLayout,
  type SidebarCollapsible,
  type SidebarVariant,
} from "@/types/preferences/layout";

export default async function FranchiseLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/franchise/login");
  }

  // Check if user is an admin
  const { data: adminProfile, error: adminError } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .single();

  if (adminError || !adminProfile) {
    // User is not an admin
    redirect("/unauthorized");
  }

  // Check if the admin is associated with a franchise
  const { data: franchise, error: franchiseError } = await supabase
    .from("franchises")
    .select("id")
    .eq("admin_id", adminProfile.id)
    .limit(1)
    .single();

  if (franchiseError || !franchise) {
    // This admin doesn't manage a franchise
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
    name: user.email ?? "Franchise User", // Or fetch from a 'profiles' table
    email: user.email ?? "",
    avatar: "", // Add a default avatar or fetch from profile
    role: "franchise",
  };

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <FranchiseSidebar variant={sidebarVariant} collapsible={sidebarCollapsible} />
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
              <FranchiseAccountSwitcher user={currentUser} />
            </div>
          </div>
        </header>
        <main className="h-full p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
