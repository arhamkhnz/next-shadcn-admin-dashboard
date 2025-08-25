"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";
import { Service } from "@/types/database";

interface ServicePricePromotionManagerProps {
  service: Service;
  onServiceUpdate: () => void;
}

export function ServicePricePromotionManager({ service, onServiceUpdate }: ServicePricePromotionManagerProps) {
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
      onServiceUpdate();
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
    <div className="space-y-4">
      <div>
        <Label htmlFor={`price-${service.id}`}>Price</Label>
        {isEditing ? (
          <div className="mt-1 flex gap-2">
            <div className="relative flex-1">
              <span className="text-muted-foreground absolute inset-y-0 left-0 flex items-center pl-3">$</span>
              <Input
                id={`price-${service.id}`}
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-8"
                disabled={isUpdating}
              />
            </div>
            <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-2">
            <p className="text-2xl font-bold">${service.price?.toFixed(2) ?? "0.00"}</p>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
