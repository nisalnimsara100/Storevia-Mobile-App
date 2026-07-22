import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface SubmittedReview {
  key: string;
  orderId: number;
  productId: number;
  productName: string;
  productImage: string;
  variant?: string;
  rating: number;
  comment: string;
  images: string[];
  anonymous: boolean;
  gemsEarned: number;
  createdAt: string;
}

interface ReviewsState {
  submittedReviews: SubmittedReview[];
  addSubmittedReview: (review: SubmittedReview) => void;
  isReviewed: (orderId: number, productId: number) => boolean;
}

export const reviewKey = (orderId: number, productId: number) => `${orderId}-${productId}`;

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      submittedReviews: [],
      addSubmittedReview: (review) =>
        set((state) => ({
          submittedReviews: [
            review,
            ...state.submittedReviews.filter((r) => r.key !== review.key),
          ],
        })),
      isReviewed: (orderId, productId) =>
        get().submittedReviews.some((r) => r.key === reviewKey(orderId, productId)),
    }),
    {
      name: 'storevia-submitted-reviews',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
