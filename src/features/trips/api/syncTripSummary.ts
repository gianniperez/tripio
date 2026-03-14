import { collection, getDocs, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TripSummary, Proposal, InventoryItem, Cost, DashboardStatus, Trip, Participant } from "@/types/tripio";

/**
 * Agrega datos de subcolecciones y actualiza el campo summary en el documento del viaje.
 * Esto optimiza la carga del dashboard evitando múltiples queries pesadas.
 */
export const syncTripSummary = async (tripId: string): Promise<void> => {
  try {
    const tripRef = doc(db, "trips", tripId);
    const proposalsRef = collection(db, "trips", tripId, "proposals");
    const inventoryRef = collection(db, "trips", tripId, "inventory");
    const costsRef = collection(db, "trips", tripId, "costs");
    const participantsRef = collection(db, "trips", tripId, "participants");

    const [tripSnap, proposalsSnap, inventorySnap, costsSnap, participantsSnap] = await Promise.all([
      getDoc(tripRef),
      getDocs(proposalsRef),
      getDocs(inventoryRef),
      getDocs(costsRef),
      getDocs(participantsRef),
    ]);

    const tripData = tripSnap.data() as Trip;
    const proposals = proposalsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as Proposal);
    const inventory = inventorySnap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as InventoryItem);
    const costs = costsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as Cost);
    const participants = participantsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() }) as Participant);

    // 1. Decision Hub: Propuestas que requieren votación y no están resueltas
    const activeProposals = proposals.filter(
      (p) => p.requiresVoting && (p.status === "draft" || p.status === "voted")
    );
    const activeProposalsCount = activeProposals.length;

    const proposalsByCategory = {
      activity: activeProposals.filter((p) => p.type === "activity").length,
      logistics: activeProposals.filter((p) => p.type === "accommodation" || p.type === "transport").length,
      inventory: activeProposals.filter((p) => p.type === "inventory").length,
    };

    // 2. Logistics Health
    const getStatus = (type: string): DashboardStatus => {
      const typeProposals = proposals.filter((p) => p.type === type);
      if (typeProposals.length === 0) return "missing";
      if (typeProposals.some((p) => p.status === "confirmed")) return "confirmed";
      return "pending";
    };

    // 3. Finance Pulse
    // Si el viaje tiene un presupuesto definido, lo usamos. Si no, sumamos las propuestas.
    const totalBudget = tripData.budget || proposals.reduce((acc, p) => acc + (p.estimatedCost || 0), 0);
    const totalExpenses = costs.reduce((acc, c) => acc + c.amount, 0);
    // Por ahora totalCollected es 0 hasta que implementemos marcadores de pago
    const totalCollected = 0;

    // 4. Inventory Critical: Ítems que no tienen a nadie asignado
    const criticalItemsCount = inventory.filter((i) => !i.assignedTo).length;

    const summary: TripSummary = {
      activeProposalsCount,
      proposalsByCategory,
      logistics: {
        accommodation: getStatus("accommodation"),
        transport: getStatus("transport"),
      },
      finances: {
        totalBudget,
        totalCollected,
        totalExpenses,
      },
      inventory: {
        criticalItemsCount,
      },
      updatedAt: serverTimestamp() as any,
    };

    await updateDoc(doc(db, "trips", tripId), {
      summary,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error syncing trip summary:", error);
    throw error;
  }
};
