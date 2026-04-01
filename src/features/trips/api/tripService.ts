import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  Timestamp,
  writeBatch,
  deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trip, Participant, Event, AccommodationConfirmed, TransportConfirmed } from "@/types/models";
import { CreateTripInput, ItineraryItem, CreateActivityInput } from "../types";
import { toDate } from "@/utils/date-utils";

const TRIPS_COLLECTION = "trips";
const INVITES_COLLECTION = "invites";

export const tripService = {
  /**
   * Actualiza el presupuesto diario del viaje
   */
  async updateTripBudget(tripId: string, dailyBudget: number | null) {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    await setDoc(docRef, { dailyBudget, updatedAt: serverTimestamp() }, { merge: true });
  },

  /**
   * Obtiene un viaje por su ID
   */
  async getTripById(tripId: string): Promise<Trip | null> {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Trip;
    }
    return null;
  },

  /**
   * Crea un nuevo viaje y añade al creador como 'owner'
   */
  async createTrip(userId: string, data: CreateTripInput) {
    const tripRef = doc(collection(db, TRIPS_COLLECTION));
    const tripId = tripRef.id;

    const newTrip: Partial<Trip> = {
      id: tripId,
      name: data.name,
      description: data.description || null,
      startDate: data.startDate ? Timestamp.fromDate(data.startDate) : null,
      endDate: data.endDate ? Timestamp.fromDate(data.endDate) : null,
      status: "planning",
      dailyBudget: data.dailyBudget || null,
      currency: data.currency || "USD",
      createdBy: userId,
      participantIds: [userId],
      createdAt: serverTimestamp() as unknown as Timestamp,
      updatedAt: serverTimestamp() as unknown as Timestamp,
    };

    const participant: Participant = {
      id: userId,
      role: "owner",
      budgetLimit: null,
      joinedAt: serverTimestamp() as unknown as Timestamp,
      invitedBy: "system",
      customPermissions: {},
    };

    const batch = writeBatch(db);
    batch.set(tripRef, newTrip);
    batch.set(doc(db, `${TRIPS_COLLECTION}/${tripId}/participants`, userId), participant);

    await batch.commit();
    return tripId;
  },

  /**
   * Actualiza un viaje existente
   */
  async updateTrip(tripId: string, data: Partial<CreateTripInput>) {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? Timestamp.fromDate(data.startDate) : null;
    }
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? Timestamp.fromDate(data.endDate) : null;
    }

    // Firebase no acepta valores undefined, así que los eliminamos o convertimos a null
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await setDoc(docRef, updateData, { merge: true });
  },

  /**
   * Elimina un viaje (y teóricamente habría que limpiar subcolecciones, pero para el MVP con borrar el doc padre alcanza o se asume cascada de BD/Cloud Function)
   */
  async deleteTrip(tripId: string) {
    const docRef = doc(db, TRIPS_COLLECTION, tripId);
    await deleteDoc(docRef);
  },


  /**
   * Obtiene los viajes de un usuario (donde es participante)
   */
  async getTripsByUser(userId: string) {
    const q = query(
      collection(db, TRIPS_COLLECTION),
      where("participantIds", "array-contains", userId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Trip);
  },

  /**
   * Genera un token de invitación
   */
  async generateInviteToken(tripId: string, createdBy: string) {
    const inviteRef = doc(collection(db, INVITES_COLLECTION));
    await setDoc(inviteRef, {
      tripId,
      createdBy,
      createdAt: serverTimestamp(),
      active: true,
    });
    return inviteRef.id;
  },

  /**
   * Une a un usuario a un viaje usando un token
   */
  async joinTrip(userId: string, token: string) {
    const inviteRef = doc(db, INVITES_COLLECTION, token);
    const inviteSnap = await getDoc(inviteRef);

    if (!inviteSnap.exists() || !inviteSnap.data().active) {
      throw new Error("Invitación inválida o expirada");
    }

    const { tripId } = inviteSnap.data();
    
    // Update trip's participantIds array
    const tripRef = doc(db, TRIPS_COLLECTION, tripId);
    const tripSnap = await getDoc(tripRef);
    if (tripSnap.exists()) {
      const currentParticipants = tripSnap.data().participantIds || [];
      if (!currentParticipants.includes(userId)) {
        await setDoc(tripRef, {
          participantIds: [...currentParticipants, userId]
        }, { merge: true });
      }
    }

    const participant: Participant = {
      id: userId,
      role: "collaborator",
      budgetLimit: null,
      joinedAt: serverTimestamp() as unknown as Timestamp,
      invitedBy: inviteSnap.data().createdBy,
      customPermissions: {},
    };

    await setDoc(doc(db, `${TRIPS_COLLECTION}/${tripId}/participants`, userId), participant);
    return tripId;
  },

  /**
   * Obtiene todos los elementos del itinerario (actividades, alojamientos, transportes)
   */
  async getItineraryItems(tripId: string): Promise<ItineraryItem[]> {
    const eventsRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/events`);
    const accRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/accommodation_confirmed`);
    const transRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/transport_confirmed`);

    const [eventsSnap, accSnap, transSnap] = await Promise.all([
      getDocs(eventsRef),
      getDocs(accRef),
      getDocs(transRef)
    ]);

    const items: ItineraryItem[] = [];

    // 1. Actividades (Events)
    eventsSnap.forEach(doc => {
      const data = doc.data() as Event;
      const date = toDate(data.date);
      if (date) {
        items.push({
          type: "activity",
          id: doc.id,
          date,
          data: { ...data, id: doc.id }
        });
      }
    });

    // 2. Alojamientos (Check-in y Check-out)
    accSnap.forEach(doc => {
      const data = doc.data() as AccommodationConfirmed;
      const dIn = toDate(data.checkIn);
      const dOut = toDate(data.checkOut);
      // Check-in
      if (dIn) {
        items.push({
          type: "accommodation",
          id: `${doc.id}-in`,
          subType: "check-in",
          date: dIn,
          data: { ...data, id: doc.id }
        });
      }
      // Check-out
      if (dOut) {
        items.push({
          type: "accommodation",
          id: `${doc.id}-out`,
          subType: "check-out",
          date: dOut,
          data: { ...data, id: doc.id }
        });
      }
    });

    // 3. Transportes (Salida y Llegada)
    transSnap.forEach(doc => {
      const data = doc.data() as TransportConfirmed;
      const dDep = toDate(data.departure);
      const dArr = toDate(data.arrival);

      // Salida
      if (dDep) {
        items.push({
          type: "transport",
          id: `${doc.id}-dep`,
          subType: "departure",
          date: dDep,
          data: { ...data, id: doc.id }
        });
      }
      // Llegada
      if (dArr) {
        items.push({
          type: "transport",
          id: `${doc.id}-arr`,
          subType: "arrival",
          date: dArr,
          data: { ...data, id: doc.id }
        });
      }
    });

    // Ordenar por fecha cronológica (filtrando cualquier item sin fecha válida que haya podido sobrar)
    return items
      .filter(item => item.date instanceof Date && !isNaN(item.date.getTime()))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  },

  /**
   * Obtiene actividades confirmadas sin fecha (Backlog)
   */
  async getBacklogActivities(tripId: string): Promise<Event[]> {
    const q = query(
      collection(db, `${TRIPS_COLLECTION}/${tripId}/events`),
      where("date", "==", null)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...(doc.data() as Event), id: doc.id }));
  },

  /**
   * Actualiza la fecha de un evento (para mover del backlog al timeline)
   */
  async updateEventDate(tripId: string, eventId: string, date: Date | null) {
    const eventRef = doc(db, `${TRIPS_COLLECTION}/${tripId}/events`, eventId);
    await setDoc(eventRef, { 
      date: date ? Timestamp.fromDate(date) : null,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  /**
   * Crea una nueva actividad confirmada (Evento)
   */
  async createActivity(tripId: string, userId: string, data: CreateActivityInput) {
    const eventsRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/events`);
    const newEventRef = doc(eventsRef);
    
    let combinedDate: Date | null = data.date || null;
    if (combinedDate && data.startTime) {
      const [hours, minutes] = data.startTime.split(":").map(Number);
      combinedDate = new Date(combinedDate); // Clone to avoid mutation
      combinedDate.setHours(hours, minutes, 0, 0);
    }

    const eventData: Partial<Event> = {
      id: newEventRef.id,
      title: data.title,
      location: data.location || null,
      costImpact: data.costImpact || null,
      date: combinedDate ? Timestamp.fromDate(combinedDate) : null,
      startTime: (combinedDate && data.startTime) ? Timestamp.fromDate(combinedDate) : null,
      endTime: null,
      category: "general",
      linkedProposalId: null,
      description: null,
      locationUrl: data.location || null,
      createdBy: userId,
      createdAt: serverTimestamp() as unknown as Timestamp,
      updatedAt: serverTimestamp() as unknown as Timestamp,
      rsvp: { [userId]: true }
    };

    await setDoc(newEventRef, eventData);
    return newEventRef.id;
  },

  /**
   * Crea una nueva propuesta de actividad
   */
  async createProposal(tripId: string, userId: string, data: CreateActivityInput) {
    const proposalsRef = collection(db, `${TRIPS_COLLECTION}/${tripId}/activities_proposals`);
    const newProposalRef = doc(proposalsRef);

    let combinedDate: Date | null = data.date || null;
    if (combinedDate && data.startTime) {
      const [hours, minutes] = data.startTime.split(":").map(Number);
      combinedDate = new Date(combinedDate);
      combinedDate.setHours(hours, minutes, 0, 0);
    }

    const proposalData = {
      id: newProposalRef.id,
      title: data.title,
      location: data.location || null,
      locationUrl: data.location || null,
      costImpact: data.costImpact || null,
      date: combinedDate ? Timestamp.fromDate(combinedDate) : null,
      startTime: (combinedDate && data.startTime) ? Timestamp.fromDate(combinedDate) : null,
      createdBy: userId,
      createdAt: serverTimestamp(),
      votes: { [userId]: "up" },
      status: "pending"
    };

    await setDoc(newProposalRef, proposalData);
    return newProposalRef.id;
  }
};
