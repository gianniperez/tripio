import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const TRIPS_COLLECTION = "trips";

export type ProposalType = "activity" | "accommodation" | "transport" | "inventory";

export interface UnifiedProposal {
  id: string;
  type: ProposalType;
  title: string;
  description: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date | null;
  votes: Record<string, string>;
  estimatedCost: number | null;
  rawData: Record<string, unknown>; // Entire original doc
}

export const proposalsService = {
  /**
   * Obtiene todas las propuestas pendientes de las 4 subcolecciones.
   */
  async getAllProposals(tripId: string): Promise<UnifiedProposal[]> {
    const collectionsMap: Record<ProposalType, string> = {
      activity: "activities_proposals",
      accommodation: "accommodation_proposals",
      transport: "transport_proposals",
      inventory: "inventory_proposals",
    };

    const promises = Object.entries(collectionsMap).map(async ([type, collName]) => {
      const collRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/${collName}`);
      const snapshot = await getDocs(collRef);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        const title = data.title || data.name || "Sin Título";

        return {
          id: doc.id,
          type: type as ProposalType,
          title,
          description: data.description || data.notes || null,
          createdBy: data.createdBy,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
          votes: data.votes || {},
          estimatedCost: data.estimatedCost ?? data.priceEstimate ?? data.costImpact ?? null,
          rawData: data,
        } as UnifiedProposal;
      });
    });

    const results = await Promise.all(promises);
    const flattened = results.flat();

    // Sort desc by createdAt
    return flattened.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  /**
   * Crea una nueva propuesta en la subcolección correspondiente
   */
  async createProposal(
    tripId: string,
    type: ProposalType,
    userId: string,
    data: Record<string, unknown>
  ): Promise<string> {
    const collName = this.getCollectionNameForType(type);
    const ref = collection(db, `${TRIPS_COLLECTION}/${tripId}/${collName}`);
    const newDocRef = doc(ref);

    const baseData = {
      id: newDocRef.id,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      votes: { [userId]: "yes" }, // Creador vota a favor por defecto
      status: "pending",
      ...data,
    };

    await setDoc(newDocRef, baseData);
    return newDocRef.id;
  },

  /**
   * Actualiza una propuesta existente en la subcolección correspondiente
   */
  async updateProposal(
    tripId: string,
    type: ProposalType,
    proposalId: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const collName = this.getCollectionNameForType(type);
    const ref = doc(db, `${TRIPS_COLLECTION}/${tripId}/${collName}`, proposalId);

    // Filter out undefined values to avoid Firebase errors
    const cleanData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));

    await updateDoc(ref, {
      ...cleanData,
      updatedAt: serverTimestamp(),
    });
  },

  /**
   * Elimina una propuesta según su ID y Tipo
   */
  async deleteProposal(tripId: string, type: ProposalType, proposalId: string): Promise<void> {
    const collName = this.getCollectionNameForType(type);
    const ref = doc(db, `${TRIPS_COLLECTION}/${tripId}/${collName}`, proposalId);
    await deleteDoc(ref);
  },

  /**
   * Confirma una propuesta, migrándola a la colección definitiva ("_confirmed" o "events")
   * y eliminándola de la bandeja de propuestas ("_proposals").
   */
  async confirmProposal(
    tripId: string,
    type: ProposalType,
    proposalId: string,
    rawData: Record<string, unknown>
  ): Promise<void> {
    let targetCollection = "";
    const formattedData: Record<string, unknown> = {
      ...rawData,
      updatedAt: serverTimestamp(),
    };

    // Prevent 'votes' from polluting the confirmed document if not needed,
    // though for MVP keeping it doesn't break anything. We remove it for clean data.
    delete formattedData.votes;
    delete formattedData.status; // Pending status no longer needed

    if (type === "activity") {
      targetCollection = "events";
      // Ensure 'category' is set for events if not present
      formattedData.category = formattedData.category || "activity";
      // Ensure 'rsvp' mapping exists
      formattedData.rsvp = {};
    } else if (type === "accommodation") {
      targetCollection = "accommodation_confirmed";
    } else if (type === "transport") {
      targetCollection = "transport_confirmed";
      formattedData.passengers = []; // Initialize empty passengers
      // capacity is expected from rawData or defaults
      formattedData.capacity = rawData.capacity || 0;
    } else if (type === "inventory") {
      targetCollection = "inventory_confirmed";
      formattedData.status = "needed";
      formattedData.assignedTo = null;
    }

    const targetRef = doc(db, `${TRIPS_COLLECTION}/${tripId}/${targetCollection}`, proposalId);
    await setDoc(targetRef, formattedData);

    // Delete the original proposal
    await this.deleteProposal(tripId, type, proposalId);
  },

  /**
   * Modifica el voto en una propuesta.
   * Firebase no permite merge fácil en objetos anidados sin usar set con merge,
   * o dot notation updateDoc({"votes.userId": voteValue})
   */
  async voteProposal(
    tripId: string,
    type: ProposalType,
    proposalId: string,
    userId: string,
    voteValue: string
  ): Promise<void> {
    const collName = this.getCollectionNameForType(type);
    const ref = doc(db, `${TRIPS_COLLECTION}/${tripId}/${collName}`, proposalId);

    await updateDoc(ref, {
      [`votes.${userId}`]: voteValue,
    });
  },

  /**
   * Utils interno
   */
  getCollectionNameForType(type: ProposalType): string {
    switch (type) {
      case "activity":
        return "activities_proposals";
      case "accommodation":
        return "accommodation_proposals";
      case "transport":
        return "transport_proposals";
      case "inventory":
        return "inventory_proposals";
      default:
        throw new Error(`Unknown proposal type ${type}`);
    }
  },
};
