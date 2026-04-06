import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  AccommodationConfirmed,
  TransportConfirmed,
  InventoryConfirmed,
} from "@/types/models";
import { proposalsService } from "@/features/proposals/api/proposalsService";
import { AccommodationInput, TransportInput, InventoryInput } from "../types/logisticsSchemas";

import { toDate } from "@/utils/date-utils";

const TRIPS_COLLECTION = "trips";

export const logisticsService = {
  // ACCOMMODATION
  async getAccommodations(tripId: string): Promise<AccommodationConfirmed[]> {
    const q = collection(db, `${TRIPS_COLLECTION}/${tripId}/accommodation_confirmed`);
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          checkIn: toDate(data.checkIn) || new Date(),
          checkOut: toDate(data.checkOut) || new Date(),
          createdAt: toDate(data.createdAt) || new Date(),
        } as unknown as AccommodationConfirmed;
      })
      .sort(
        (a, b) => ((a.checkIn as Date)?.getTime() || 0) - ((b.checkIn as Date)?.getTime() || 0)
      );
  },

  async updateAccommodation(
    tripId: string,
    id: string,
    data: Partial<AccommodationConfirmed>
  ): Promise<void> {
    const ref = doc(db, `${TRIPS_COLLECTION}/${tripId}/accommodation_confirmed`, id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteAccommodation(tripId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, `${TRIPS_COLLECTION}/${tripId}/accommodation_confirmed`, id));
  },

  // TRANSPORT
  async getTransports(tripId: string): Promise<TransportConfirmed[]> {
    const q = collection(db, `${TRIPS_COLLECTION}/${tripId}/transport_confirmed`);
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          departure: toDate(data.departure) || new Date(),
          arrival: toDate(data.arrival) || new Date(),
          createdAt: toDate(data.createdAt) || new Date(),
        } as unknown as TransportConfirmed;
      })
      .sort(
        (a, b) => ((a.departure as Date)?.getTime() || 0) - ((b.departure as Date)?.getTime() || 0)
      );
  },

  async updateTransport(tripId: string, id: string, data: Partial<TransportConfirmed>): Promise<void> {
    const ref = doc(db, `${TRIPS_COLLECTION}/${tripId}/transport_confirmed`, id);
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async updateTransportPassengers(
    tripId: string,
    transportId: string,
    newPassengers: string[]
  ): Promise<void> {
    const ref = doc(db, `${TRIPS_COLLECTION}/${tripId}/transport_confirmed`, transportId);
    await updateDoc(ref, {
      passengers: newPassengers,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteTransport(tripId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, `${TRIPS_COLLECTION}/${tripId}/transport_confirmed`, id));
  },

  // INVENTORY
  async getInventory(tripId: string): Promise<InventoryConfirmed[]> {
    const q = collection(db, `${TRIPS_COLLECTION}/${tripId}/inventory_confirmed`);
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: toDate(data.createdAt) || new Date(),
        } as unknown as InventoryConfirmed;
      })
      .sort(
        (a, b) => ((a.createdAt as Date)?.getTime() || 0) - ((b.createdAt as Date)?.getTime() || 0)
      );
  },

  async updateInventory(
    tripId: string,
    inventoryId: string,
    updates: Partial<InventoryConfirmed>
  ): Promise<void> {
    const ref = doc(db, `${TRIPS_COLLECTION}/${tripId}/inventory_confirmed`, inventoryId);
    await updateDoc(ref, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async deleteInventory(tripId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, `${TRIPS_COLLECTION}/${tripId}/inventory_confirmed`, id));
  },

  async updateInventoryStatus(
    tripId: string,
    inventoryId: string,
    updates: Partial<InventoryConfirmed>
  ): Promise<void> {
    return this.updateInventory(tripId, inventoryId, updates);
  },

  // CREATION METHODS
  async createAccommodation(
    tripId: string,
    userId: string,
    data: AccommodationInput
  ): Promise<string> {
    if (data.requiresVoting) {
      const proposalData = { ...data };
      delete (proposalData as Record<string, unknown>).requiresVoting;
      return proposalsService.createProposal(
        tripId,
        "accommodation",
        userId,
        proposalData as Record<string, unknown>
      );
    }

    const ref = collection(db, `${TRIPS_COLLECTION}/${tripId}/accommodation_confirmed`);
    const newDocRef = doc(ref);
    const confirmedData = { ...data };
    delete (confirmedData as Record<string, unknown>).requiresVoting;

    await setDoc(newDocRef, {
      ...confirmedData,
      id: newDocRef.id,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newDocRef.id;
  },

  async createTransport(tripId: string, userId: string, data: TransportInput): Promise<string> {
    if (data.requiresVoting) {
      const proposalData = { ...data };
      delete (proposalData as Record<string, unknown>).requiresVoting;
      return proposalsService.createProposal(
        tripId,
        "transport",
        userId,
        proposalData as Record<string, unknown>
      );
    }

    const ref = collection(db, `${TRIPS_COLLECTION}/${tripId}/transport_confirmed`);
    const newDocRef = doc(ref);
    const confirmedData = { ...data };
    delete (confirmedData as Record<string, unknown>).requiresVoting;

    await setDoc(newDocRef, {
      ...confirmedData,
      id: newDocRef.id,
      passengers: [],
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newDocRef.id;
  },

  async createInventory(tripId: string, userId: string, data: InventoryInput): Promise<string> {
    if (data.requiresVoting) {
      const proposalData = { ...data };
      delete (proposalData as Record<string, unknown>).requiresVoting;
      return proposalsService.createProposal(
        tripId,
        "inventory",
        userId,
        proposalData as Record<string, unknown>
      );
    }

    const ref = collection(db, `${TRIPS_COLLECTION}/${tripId}/inventory_confirmed`);
    const newDocRef = doc(ref);
    const confirmedData = { ...data };
    delete (confirmedData as Record<string, unknown>).requiresVoting;

    await setDoc(newDocRef, {
      ...confirmedData,
      id: newDocRef.id,
      status: "needed",
      assignedTo: null,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newDocRef.id;
  },
};
