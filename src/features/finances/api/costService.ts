import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Cost } from "@/types/models";

const TRIPS_COLLECTION = "trips";

export const costService = {
  /**
   * Obtiene todos los gastos de un viaje
   */
  async getTripCosts(tripId: string): Promise<Cost[]> {
    const costsRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/costs`);
    const snapshot = await getDocs(costsRef);
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        } as Cost;
      })
      .sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime());
  },

  /**
   * Agrega un nuevo gasto a un viaje
   */
  async addCost(
    tripId: string,
    userId: string,
    data: Omit<Cost, "id" | "createdBy" | "createdAt">
  ): Promise<string> {
    const costsRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/costs`);
    const newCostRef = doc(costsRef);

    const costData: Partial<Cost> = {
      ...data,
      id: newCostRef.id,
      createdBy: userId,
      createdAt: serverTimestamp() as unknown as Timestamp,
    };

    if (data.date instanceof Date) {
      costData.date = Timestamp.fromDate(data.date);
    } else if (data.date instanceof Timestamp) {
      costData.date = data.date;
    } else if (typeof data.date === "string" || typeof data.date === "number") {
      costData.date = Timestamp.fromDate(new Date(data.date));
    }

    await setDoc(newCostRef, costData);
    return newCostRef.id;
  },

  /**
   * Elimina un gasto
   */
  async deleteCost(tripId: string, costId: string): Promise<void> {
    const costRef = doc(db, `${TRIPS_COLLECTION}/${tripId}/costs`, costId);
    await deleteDoc(costRef);
  },
};
