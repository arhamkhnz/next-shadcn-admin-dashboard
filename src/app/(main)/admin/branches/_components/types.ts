import { Service } from "@/types/database";

export type Branch = {
  id: string;
  name: string;
  location: string; // The geography type is a string in PostGIS
  location_text?: string;
  franchise_id: string;
  franchise: string; // Franchise name for display/filter
  services: Service[];
  activeBookings: number;
  createdAt: Date;
  address?: string;
  city?: string;
  phone_number?: string;
  ratings?: number;
  pictures?: string[];
  latitude?: number;
  longitude?: number;
};
