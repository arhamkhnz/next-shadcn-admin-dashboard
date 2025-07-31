import { create } from "zustand";

import { createClient } from "@/lib/supabase/client";
import { Review } from "@/types/database";

import { useUserStore } from "./user-store";

const supabase = createClient();

type ReviewState = {
  reviews: Review[];
  fetchReviews: () => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
};

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  fetchReviews: async () => {
    const { data, error } = await supabase.from("reviews").select("*");
    if (error) {
      console.error("Error fetching reviews:", error);
      return;
    }
    const { users } = useUserStore.getState();
    const transformedReviews = data.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userId: review.user_id,
      bookingId: review.booking_id,
      userName: users.find((u) => u.id === review.user_id)?.name ?? "N/A",
      createdAt: new Date(review.created_at),
    }));
    set({ reviews: transformedReviews as any[] });
  },
  deleteReview: async (id: string) => {
    await supabase.from("reviews").delete().eq("id", id);
    set((state) => ({ reviews: state.reviews.filter((r) => r.id !== id) }));
  },
}));
