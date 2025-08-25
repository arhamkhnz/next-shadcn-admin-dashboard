"use client";

import { useState } from "react";

import { Globe, DollarSign } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";
import { Service } from "@/types/database";

interface ServicePriceFormProps {
  service: Service & { is_global?: boolean };
  branchId: string;
}

export function ServicePriceForm({ service, branchId }: ServicePriceFormProps) {
  const { updateService } = useFranchiseServiceStore();

  const [price, setPrice] = useState<string>(service.price?.toString() ?? "0");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateService({
        ...service,
        price: parseFloat(price),
      });
      toast.success("Service price updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message ?? "Failed to update service price.");
      console.error("Error updating service:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setPrice(service.price?.toString() ?? "0");
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{service.name}</span>
          {service.is_global && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Global
            </Badge>
          )}
        </div>
        <div className="mt-1">
          {isEditing ? (
            <div className="relative">
              <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-10"
                disabled={isUpdating}
              />
            </div>
          ) : (
            <p className="text-lg font-bold">${service.price?.toFixed(2) ?? "0.00"}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Price</Button>
        )}
      </div>
    </div>
  );
}
