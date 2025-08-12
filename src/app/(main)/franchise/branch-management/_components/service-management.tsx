"use client";

import { Edit, PlusCircle, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFranchiseBranchStore, Branch } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";

import { ServiceDialog } from "./service-dialog";

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
          <CardDescription>Add, edit, or remove services for this branch.</CardDescription>
        </div>
        <ServiceDialog branchId={branch.id}>
          <Button variant="outline" size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </ServiceDialog>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 w-full rounded-md border lg:h-[450px]">
          <div className="space-y-4 p-4">
            {branch.services && branch.services.length > 0 ? (
              branch.services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4"
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-muted-foreground text-sm">
                      ${service.price} &middot; {service.duration_min} mins
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <ServiceDialog branchId={branch.id} service={service}>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </ServiceDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the &quot;{service.name}&quot; service. This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteService(service.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
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
