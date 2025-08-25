"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore, Service } from "@/stores/franchise-dashboard/service-store";

import { ServiceCard } from "./service-card";

export function ServiceManagementPage() {
  const { branches, fetchBranches } = useFranchiseBranchStore();
  const { services, fetchServices } = useFranchiseServiceStore();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchBranches();
    fetchServices();
  }, [fetchBranches, fetchServices]);

  useEffect(() => {
    if (selectedBranchId === "all") {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((service) => service.branchId === selectedBranchId || service.is_global));
    }
  }, [selectedBranchId, services]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Service Management</h2>
        <p className="text-muted-foreground">Manage services across all branches in your franchise.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Services</CardTitle>
              <CardDescription>View and manage services for your branches.</CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => <ServiceCard key={service.id} service={service} branches={branches} />)
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  {selectedBranchId === "all" ? "No services found." : "No services available for the selected branch."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
