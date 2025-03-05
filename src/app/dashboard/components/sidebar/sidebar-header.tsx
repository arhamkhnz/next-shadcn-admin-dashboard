import Link from "next/link";

import Logo from "@/components/icons/logo";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { PROJECT_CONFIG } from "@/config/project-config";

export default function SidebarBrandHeader() {
  return (
    <Link href="/dashboard">
      <SidebarMenuButton className="pointer-events-none">
        <Logo height="25" width="25" />
        <span className="text-lg font-semibold dark:text-white">{PROJECT_CONFIG.name}</span>
      </SidebarMenuButton>
    </Link>
  );
}
