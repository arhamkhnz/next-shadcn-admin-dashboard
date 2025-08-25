/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable complexity */

"use client";

import { useState, useEffect } from "react";

import { Globe, Tag, Plus, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePromotionStore } from "@/stores/admin-dashboard/promotion-store";
import { Branch } from "@/stores/franchise-dashboard/branch-store";
import { useServicePromotionStore } from "@/stores/franchise-dashboard/service-promotion-store";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";
import { Service } from "@/types/database";

interface ServicePricePromotionFormProps {
  service: Service;
  branches: Branch[];
  selectedBranchId: string;
}

export function ServicePricePromotionForm({ service, branches, selectedBranchId }: ServicePricePromotionFormProps) {
  const { updateService } = useFranchiseServiceStore();
  const { promotions, fetchPromotions } = usePromotionStore();
  const { servicePromotions, fetchServicePromotions, addServicePromotion, removeServicePromotion } =
    useServicePromotionStore();

  const [price, setPrice] = useState<string>(service.price?.toString() ?? "0");
  const [isEditing, setIsEditing] = useState(false);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingPromotion, setIsAddingPromotion] = useState(false);
  const [isRemovingPromotion, setIsRemovingPromotion] = useState<string | null>(null);
  const [promotionToRemove, setPromotionToRemove] = useState<{ id: string; code: string } | null>(null);

  // Find the branch name for display
  const branchName = branches.find((b) => b.id === service.branchId)?.name ?? "Unknown Branch";

  // Get promotions for this service
  const servicePromotionsList = servicePromotions.filter((sp) => sp.serviceId === service.id);
  const associatedPromotions = servicePromotionsList
    .map((sp) => {
      const promotion = promotions.find((p) => p.id === sp.promotionId);
      return promotion ? { ...sp, promotion } : null;
    })
    .filter(Boolean);

  useEffect(() => {
    fetchPromotions();
    fetchServicePromotions(service.id);
  }, [fetchPromotions, fetchServicePromotions, service.id]);

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

  const handleAddPromotion = async () => {
    if (!selectedPromotionId) return;

    setIsAddingPromotion(true);
    try {
      await addServicePromotion(service.id, selectedPromotionId);
      toast.success("Promotion added to service!");
      setSelectedPromotionId("");
      setIsPromotionDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message ?? "Failed to add promotion to service.");
      console.error("Error adding promotion:", error);
    } finally {
      setIsAddingPromotion(false);
    }
  };

  const handleRemovePromotion = async () => {
    if (!promotionToRemove) return;

    setIsRemovingPromotion(promotionToRemove.id);
    try {
      await removeServicePromotion(promotionToRemove.id);
      toast.success("Promotion removed from service!");
      setPromotionToRemove(null);
    } catch (error: any) {
      toast.error(error.message ?? "Failed to remove promotion from service.");
      console.error("Error removing promotion:", error);
    } finally {
      setIsRemovingPromotion(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              {service.name}
              {service.is_global && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Global
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {service.is_global ? "Available at all branches" : `Branch: ${branchName}`}
            </CardDescription>
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
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor={`price-${service.id}`}>Price</Label>
              {isEditing ? (
                <div className="relative mt-1">
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
              ) : (
                <div className="mt-1">
                  <p className="text-2xl font-bold">${service.price?.toFixed(2) ?? "0.00"}</p>
                </div>
              )}
            </div>

            <div>
              <Label>Duration</Label>
              <p className="text-muted-foreground">{service.duration_min} minutes</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Label>Promotions</Label>
                <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Promotion
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Promotion</DialogTitle>
                      <DialogDescription>Select a promotion to associate with this service.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="promotion-select">Promotion</Label>
                        <Select value={selectedPromotionId} onValueChange={setSelectedPromotionId}>
                          <SelectTrigger id="promotion-select">
                            <SelectValue placeholder="Select a promotion" />
                          </SelectTrigger>
                          <SelectContent>
                            {promotions
                              .filter((p) => !servicePromotionsList.some((sp) => sp.promotionId === p.id))
                              .map((promotion) => (
                                <SelectItem key={promotion.id} value={promotion.id}>
                                  {promotion.code} - {promotion.discount}% off
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddPromotion} disabled={!selectedPromotionId || isAddingPromotion}>
                          {isAddingPromotion === true ? "Adding..." : "Add Promotion"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-2 space-y-2">
                {associatedPromotions.length > 0 ? (
                  associatedPromotions.map((sp: any) => (
                    <div key={sp.id} className="flex items-center justify-between rounded-md border p-2">
                      <div className="flex items-center gap-2">
                        <Tag className="text-muted-foreground h-4 w-4" />
                        <span>{sp.promotion.code}</span>
                        <Badge variant="secondary">{sp.promotion.discount}% off</Badge>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPromotionToRemove({ id: sp.id, code: sp.promotion.code })}
                            disabled={isRemovingPromotion === sp.id}
                          >
                            {isRemovingPromotion === sp.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Promotion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove the promotion &quot;{sp.promotion.code}&quot; from this
                              service? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemovePromotion}>Remove</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No promotions associated with this service.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
