export type Franchise = {
  id: string;
  name: string;
  status: "active" | "inactive";
  created_at: string;
};

export type Branch = {
  id: string;
  name: string;
  franchise_id: string;
  location: string;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  branch_id: string;
  price: number;
  duration: number;
  created_at: string;
};

export type Washer = {
  id: string;
  name: string;
  branch_id: string;
  status: "active" | "inactive";
  rating: number;
  created_at: string;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
};

export type Car = {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  branch_id: string;
  service_id: string;
  car_id: string;
  washer_id: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  booking_time: string;
  created_at: string;
};
