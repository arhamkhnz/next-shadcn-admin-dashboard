import { create } from "zustand";

import { Service } from "@/types/database";

type ServiceState = {
  services: Service[];
  addService: (service: Omit<Service, "id">) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
};

const initialServices: Service[] = [
  { id: "1", branchId: "1", name: "Basic Wash", price: 25, duration_min: 30 },
  { id: "2", branchId: "1", name: "Deluxe Wash", price: 45, duration_min: 45 },
  { id: "3", branchId: "2", name: "Basic Wash", price: 25, duration_min: 30 },
  { id: "4", branchId: "2", name: "Interior Detail", price: 75, duration_min: 90 },
  { id: "5", branchId: "3", name: "Premium Package", price: 120, duration_min: 120 },
];

export const useServiceStore = create<ServiceState>((set) => ({
  services: initialServices,
  addService: (service) =>
    set((state) => ({
      services: [...state.services, { ...service, id: `${state.services.length + 1}` }],
    })),
  updateService: (updatedService) =>
    set((state) => ({
      services: state.services.map((service) => (service.id === updatedService.id ? updatedService : service)),
    })),
  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((service) => service.id !== id),
    })),
}));
