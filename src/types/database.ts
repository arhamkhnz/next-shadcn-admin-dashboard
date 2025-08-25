export type Service = {
  id: string;
  branchId: string;
  name: string;
  price: number;
  duration_min: number;
  description?: string;
  todos?: string[];
  include?: string[];
  is_global?: boolean;
  created_at?: string;
  pictures?: string[];
};

export type Review = {
  id: string;
  userId: string;
  bookingId: string;
  rating: number;
  comment: string;
};

export type Promotion = {
  id: string;
  code: string;
  discount: number;
  startDate: string;
  endDate: string;
  active: boolean;
};

export type ServicePromotion = {
  id: string;
  serviceId: string;
  promotionId: string;
  createdAt: Date;
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: Date;
};

export type BranchHours = {
  id: string;
  branchId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM"
};

export type WasherSchedule = {
  id: string;
  washerId: string;
  branchId: string;
  startTime: Date;
  endTime: Date;
};

export type ServiceAvailability = {
  id: string;
  serviceId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  isActive: boolean;
  createdAt: Date;
};
