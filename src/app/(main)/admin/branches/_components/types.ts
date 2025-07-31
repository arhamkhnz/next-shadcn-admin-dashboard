export type Branch = {
  id: string;
  name: string;
  location: string; // The geography type is a string in PostGIS
  franchise_id: string;
  franchise: string; // Franchise name for display/filter
  services: number;
  activeBookings: number;
  createdAt: Date;
};
