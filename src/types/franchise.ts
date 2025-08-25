export type Franchise = {
  id: string;
  name: string;
  admin_id: string;
  status: string;
  created_at: string;
};

export type Branch = {
  id: string;
  name: string;
  location: string;
  franchise_id: string;
  services: Service[];
  active_bookings: number;
  created_at: string;
};

export type Washer = {
  id: string;
  name: string;
  branch_id: string;
  status: string;
  rating: number;
  completed_bookings: number;
};

export type Booking = {
  id: string;
  user_id: string;
  branch_id: string;
  service_id: string;
  washer_id: string;
  status: string;
  scheduled_at: string;
  created_at: string;
};

export type Service = {
  id: string;
  branch_id: string | null;
  name: string;
  price: number;
  duration_min: number;
  description?: string;
  todos?: string[];
  include?: string[];
  is_global?: boolean;
  created_at?: string;
};
