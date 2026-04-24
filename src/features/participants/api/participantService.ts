import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { ParticipantWithUser } from "../types";

import { db } from "@/lib/firebase";
import { Participant } from "@/types/models";

const TRIPS_COLLECTION = "trips";

export const participantService = {
  /**
   * Obtiene la participación de un usuario en un viaje
   */
  async getParticipant(tripId: string, userId: string): Promise<Participant | null> {
    const participantRef = doc(db, `${TRIPS_COLLECTION}/${tripId}/participants`, userId);
    const snap = await getDoc(participantRef);
    if (snap.exists()) {
      return snap.data() as Participant;
    }
    return null;
  },

  /**
   * Obtiene todos los participantes de un viaje con la informacion del usuario
   */
  async getParticipants(tripId: string): Promise<ParticipantWithUser[]> {
    const participantsRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/participants`);
    const snap = await getDocs(participantsRef);
    
    if (snap.empty) return [];

    const participantsData = snap.docs.map(doc => doc.data() as Participant);
    
    // Fetch users for each participant
    const participantsWithUser = await Promise.all(
      participantsData.map(async (participant) => {
        const userRef = doc(db, "users", participant.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : { displayName: "Usuario Desconocido", photoURL: null, email: "unknown@example.com" };
        
        return {
          ...participant,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          email: userData.email,
        } as ParticipantWithUser;
      })
    );

    return participantsWithUser;
  },

  /**
   * Actualiza el límite de presupuesto personal de un participante en un viaje
   */
  async updateParticipantBudget(tripId: string, userId: string, budgetLimit: number | null) {
    const participantRef = doc(db, `${TRIPS_COLLECTION}/${tripId}/participants`, userId);
    await setDoc(participantRef, { budgetLimit }, { merge: true });
  }
};

