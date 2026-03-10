import { 
  collectionGroup, 
  query, 
  where, 
  getDocs, 
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trip } from "@/types/tripio";

export const getTripsByUserId = async (userId: string): Promise<Trip[]> => {
  try {
    // Buscamos en la subcolección 'participants' de todos los trips
    const participantsQuery = query(
      collectionGroup(db, "participants"),
      where("uid", "==", userId)
    );

    const participantSnapshots = await getDocs(participantsQuery);
    
    const tripPromises = participantSnapshots.docs.map(async (participantDoc) => {
      // El padre de 'participants/{userId}' es 'trips/{tripId}'
      const tripRef = participantDoc.ref.parent.parent;
      if (!tripRef) return null;
      
      const tripSnap = await getDoc(tripRef);
      if (!tripSnap.exists()) return null;
      
      return {
        id: tripSnap.id,
        ...tripSnap.data()
      } as Trip;
    });

    const trips = await Promise.all(tripPromises);
    return trips.filter((t): t is Trip => t !== null);
  } catch (error) {
    console.error("Error al obtener viajes (posible falta de índice):", error);
    throw error;
  }
};
