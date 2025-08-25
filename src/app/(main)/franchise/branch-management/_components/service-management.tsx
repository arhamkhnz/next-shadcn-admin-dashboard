"use client";

import { Edit, PlusCircle, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFranchiseBranchStore, Branch } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";

import { ServiceDialog } from "./service-dialog";
import { ServicePriceForm } from "./service-price-form";

interface ServiceManagementProps {
  branch: Branch;
}

export function ServiceManagement({ branch }: ServiceManagementProps) {
  const { fetchBranches } = useFranchiseBranchStore();
  const { deleteService } = useFranchiseServiceStore();

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      await fetchBranches(); // Refetch to update the service list
      toast.success("Service deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete service.");
    }
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Manage Services</CardTitle>
          <CardDescription>Edit or remove services for this branch.</CardDescription>
        </div>
        {/* ADD FEATURE: Hidden as per requirements */}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border lg:h-[450px]">
          <div className="space-y-4 p-4">
            {branch.services && branch.services.length > 0 ? (
              branch.services.map((service: any) => (
                <ServicePriceForm key={service.id} service={service} branchId={branch.id} />
              ))
            ) : (
              <div className="text-muted-foreground flex h-[200px] items-center justify-center text-center">
                No services have been added to this branch yet.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
