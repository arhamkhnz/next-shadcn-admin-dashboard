import { create } from "zustand";

import { Review } from "@/types/database";

type ReviewState = {
  reviews: Review[];
  deleteReview: (id: string) => void;
};

const initialReviews: Review[] = [
  { id: "1", userId: "1", bookingId: "1", rating: 5, comment: "Great service!" },
  { id: "2", userId: "2", bookingId: "2", rating: 4, comment: "Good job, but a bit slow." },
  { id: "3", userId: "3", bookingId: "3", rating: 5, comment: "My car looks brand new!" },
  { id: "4", userId: "4", bookingId: "4", rating: 3, comment: "It was okay." },
];

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: initialReviews,
  deleteReview: (id) =>
    set((state) => ({
      reviews: state.reviews.filter((review) => review.id !== id),
    })),
}));
