import { doc, Timestamp, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Invitation, Participant } from "@/types/tripio";

/**
 * Acepta una invitación y agrega al usuario al viaje
 */
export const acceptInvitation = async (
  tokenId: string,
  userId: string,
  invitation: Invitation,
): Promise<void> => {
  const tripParticipantRef = doc(
    db,
    "trips",
    invitation.tripId,
    "participants",
    userId,
  );
  const invitationRef = doc(db, "invitations", tokenId);

  await runTransaction(db, async (transaction) => {
    // 1. Verificar si ya es participante (opcional, Firestore setDoc lo sobreescribiría pero es mejor validar)
    const participantSnap = await transaction.get(tripParticipantRef);
    if (participantSnap.exists()) {
      throw new Error("Ya eres miembro de este viaje");
    }

    // 2. Crear el documento de participante
    const newParticipant: Participant = {
      id: userId,
      uid: userId,
      role: invitation.role,
      joinedAt: Timestamp.now(),
      invitedBy: invitation.invitedByToken,
      invitationToken: tokenId,
      budgetLimit: null,
    };

    transaction.set(tripParticipantRef, newParticipant);

    // 3. Marcar invitación como aceptada
    transaction.update(invitationRef, {
      status: "accepted",
      usedBy: userId,
    });
  });
};
