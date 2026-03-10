import { collection, doc, getDoc, Timestamp, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Invitation, TripRole } from "@/types/tripio";
import { addDays } from "date-fns";

/**
 * Crea una nueva invitación en la colección raíz 'invitations'
 */
export const createInvitation = async (
  tripId: string,
  tripName: string,
  role: TripRole,
  invitedByToken: string,
  invitedByName: string,
): Promise<string> => {
  const invitationRef = collection(db, "invitations");

  const now = new Date();
  const expiresAt = addDays(now, 3); // 72 horas de validez por defecto

  const newInvitation: Omit<Invitation, "id"> = {
    tripId,
    tripName,
    role,
    invitedByToken,
    invitedByName,
    createdAt: Timestamp.fromDate(now),
    expiresAt: Timestamp.fromDate(expiresAt),
    status: "pending",
  };

  const docRef = await addDoc(invitationRef, newInvitation);
  return docRef.id;
};

/**
 * Obtiene una invitación por su ID (token)
 */
export const getInvitation = async (
  tokenId: string,
): Promise<Invitation | null> => {
  const docRef = doc(db, "invitations", tokenId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Invitation;
};
