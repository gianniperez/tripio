"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ParticipantsManager } from "@/features/participants/components/ParticipantsManager";
import { Participant, Trip } from "@/types/tripio";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, doc, getDoc } from "firebase/firestore";
import { createInvitation } from "@/features/participants/api";
import { useAuth } from "@/features/auth/hooks";
import { Loader2 } from "lucide-react";

export default function TripParticipants() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;

    // Fetch Trip Info
    const fetchTrip = async () => {
      const tripSnap = await getDoc(doc(db, "trips", tripId));
      if (tripSnap.exists()) {
        setTrip({ id: tripSnap.id, ...tripSnap.data() } as Trip);
      }
    };
    fetchTrip();

    // Subscribe to Participants
    const q = query(collection(db, "trips", tripId, "participants"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const parts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Participant[];
      setParticipants(parts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tripId]);

  const handleInvite = async (role: Participant["role"]) => {
    if (!trip || !user) return null;
    try {
      return await createInvitation(
        trip.id,
        trip.name,
        role,
        user.uid,
        user.displayName || "Un amigo",
      );
    } catch (error) {
      console.error("Error creating invitation:", error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[--primary-color]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[--text-color] mb-8">
        Participantes
      </h1>
      <div className="bg-[--bg-color] p-6 rounded-[20px] shadow-[8px_8px_16px_var(--shadow-dark),-8px_-8px_16px_var(--shadow-light)]">
        <ParticipantsManager
          participants={participants}
          currentUserId={user?.uid || ""}
          onUpdateRole={(id, role) => console.log("Update role:", id, role)}
          onUpdatePermissions={(id, perms) =>
            console.log("Update perms:", id, perms)
          }
          onRemoveParticipant={(id) => console.log("Remove:", id)}
          onInviteParticipant={handleInvite}
        />
      </div>
    </div>
  );
}
