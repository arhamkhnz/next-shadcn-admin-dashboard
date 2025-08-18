"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Service } from "@/types/database";

import { ServiceForm } from "./service-form";

interface ServiceDialogProps {
  branchId: string;
  service?: Service;
  children: React.ReactNode;
  onServiceAdd?: (service: any) => void; // For adding services to new branches
}

export function ServiceDialog({ branchId, service, children, onServiceAdd }: ServiceDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = (newService?: any) => {
    setOpen(false);
    // If this is for a new branch and we have a callback, call it with the new service
    if (!branchId && onServiceAdd && newService) {
      onServiceAdd(newService);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{service ? "Edit" : "Add"} Service</DialogTitle>
          <DialogDescription>
            {service ? "Update the details of this service." : "Add a new service to this branch."}
          </DialogDescription>
        </DialogHeader>
        <ServiceForm branchId={branchId} service={service} onSuccess={(newService) => handleSuccess(newService)} />
      </DialogContent>
    </Dialog>
  );
}
