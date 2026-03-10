import { useMutation } from "@tanstack/react-query";
import { collection, addDoc, doc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Cost } from "@/types/tripio";

export const useCreateCost = () => {
  return useMutation({
    mutationFn: async ({ tripId, data }: { tripId: string; data: Omit<Cost, "id" | "createdAt"> }) => {
      const expensesRef = collection(db, "trips", tripId, "costs");
      const docRef = await addDoc(expensesRef, {
        ...data,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    },
  });
};

export const useDeleteCost = () => {
  return useMutation({
    mutationFn: async ({ tripId, costId }: { tripId: string; costId: string }) => {
      const costRef = doc(db, "trips", tripId, "costs", costId);
      await deleteDoc(costRef);
    },
  });
};
