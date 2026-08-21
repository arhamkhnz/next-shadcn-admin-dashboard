"use client";

import { useState } from "react";

import { Building2, CalendarClock, Handshake, PhoneCall, Plus, User, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CompanyForm } from "../../companies/_components/company-form";
import { ContactForm } from "../../contacts/_components/contact-form";
import { DealForm } from "../../deals/_components/deal-form";
import { LeadForm } from "../../leads/_components/lead-form";
import { ActivityForm } from "../activities/activity-form";

type QuickCreateTarget = "lead" | "contact" | "company" | "deal" | "activity" | "task";

const menuItems: { target: QuickCreateTarget; label: string; icon: typeof User }[] = [
  { target: "lead", label: "Lead", icon: User },
  { target: "contact", label: "Contact", icon: Users },
  { target: "company", label: "Company", icon: Building2 },
  { target: "deal", label: "Deal", icon: Handshake },
  { target: "activity", label: "Activity", icon: PhoneCall },
  { target: "task", label: "Task", icon: CalendarClock },
];

export function QuickCreateMenu() {
  const [target, setTarget] = useState<QuickCreateTarget | null>(null);
  const close = () => setTarget(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button data-icon="inline-start">
            <Plus data-icon="inline-start" />
            Quick create
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Create record</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.target} onSelect={() => setTarget(item.target)}>
              <item.icon />
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <LeadForm open={target === "lead"} onOpenChange={(open) => (open ? undefined : close())} />
      <ContactForm open={target === "contact"} onOpenChange={(open) => (open ? undefined : close())} />
      <CompanyForm open={target === "company"} onOpenChange={(open) => (open ? undefined : close())} />
      <DealForm open={target === "deal"} onOpenChange={(open) => (open ? undefined : close())} />
      <ActivityForm open={target === "activity"} onOpenChange={(open) => (open ? undefined : close())} />
      <ActivityForm
        open={target === "task"}
        onOpenChange={(open) => (open ? undefined : close())}
        defaultType="Task"
        lockType
      />
    </>
  );
}
