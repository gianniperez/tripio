import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Cost } from "@/types/tripio";
import { useSyncTripSummary } from "@/features/trips/hooks";

export const useCreateCost = (tripId: string) => {
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: async ({
      data,
    }: {
      data: Omit<Cost, "id" | "createdAt">;
    }) => {
      const expensesRef = collection(db, "trips", tripId, "costs");
      const docRef = await addDoc(expensesRef, {
        ...data,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      syncSummary(tripId);
    },
  });
};

export const useDeleteCost = (tripId: string) => {
  const { mutate: syncSummary } = useSyncTripSummary();

  return useMutation({
    mutationFn: async (costId: string) => {
      const costRef = doc(db, "trips", tripId, "costs", costId);
      await deleteDoc(costRef);
    },
    onSuccess: () => {
      syncSummary(tripId);
    },
  });
};
