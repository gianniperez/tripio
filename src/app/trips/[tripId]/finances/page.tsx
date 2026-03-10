"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { useTrip, useEvents, useUpdateParticipant } from "@/features/trips/hooks";
import { useCosts } from "@/features/finances/hooks/useCosts";
import { BudgetProgressBar } from "@/features/finances/components/BudgetProgressBar";
import { SetBudgetCard } from "@/features/finances/components/SetBudgetCard";
import { ExpenseList } from "@/features/finances/components/ExpenseList";
import { DailyBudgetCard } from "@/features/finances/components/DailyBudgetCard";
import { AddExpenseModal } from "@/features/finances/components/AddExpenseModal";
import { calculateMyCosts, filterMyRelatedCosts } from "@/features/finances/utils/calculateCosts";
import { doc, collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Participant, Proposal } from "@/types/tripio";
import { Loader2, Plus } from "lucide-react";

export default function TripFinances() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();
  
  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const { data: events, isLoading: isLoadingEvents } = useEvents(tripId);
  const { data: costs, isLoading: isLoadingCosts } = useCosts(tripId);
  const updateParticipant = useUpdateParticipant();

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  useEffect(() => {
    if (!tripId || !user?.uid) return;
    
    let isSubscribed = true;

    const unsubParticipant = onSnapshot(doc(db, "trips", tripId, "participants", user.uid), (docSnap) => {
      if (docSnap.exists() && isSubscribed) {
        setParticipant({ id: docSnap.id, ...docSnap.data() } as Participant);
      }
    });

    const unsubProposals = onSnapshot(query(collection(db, "trips", tripId, "proposals")), (snapshot) => {
      if (isSubscribed) {
        const props = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Proposal));
        setProposals(props);
      }
    });

    return () => {
      isSubscribed = false;
      unsubParticipant();
      unsubProposals();
    };
  }, [tripId, user?.uid]);

  const isReady = participant !== null;
  const isLoading = isLoadingTrip || isLoadingEvents || isLoadingCosts || !isReady;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Cargando finanzas...</p>
      </div>
    );
  }

  if (!trip || !participant || !user) return null;

  const handleSetBudget = async (amount: number) => {
    await updateParticipant.mutateAsync({
      tripId,
      participantId: user.uid,
      data: { budgetLimit: amount }
    });
  };

  const myTotalCosts = calculateMyCosts(costs, events, proposals, user.uid);
  const myFilteredCosts = filterMyRelatedCosts(costs, events, proposals, user.uid);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight font-nunito">
            Finanzas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Proyección de tus gastos personales para este viaje.
          </p>
        </div>
        <button 
          onClick={() => setIsAddExpenseOpen(true)}
          className="flex items-center gap-1.5 bg-text-main text-white px-3 py-2 rounded-xl text-sm font-bold shadow-neumorphic-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir</span>
        </button>
      </div>

      {!participant.budgetLimit || isEditingBudget ? (
        <SetBudgetCard 
          onSetBudget={(amount) => {
            handleSetBudget(amount);
            setIsEditingBudget(false);
          }} 
          currency={trip.currency} 
          initialBudget={participant.budgetLimit || undefined}
          onCancel={participant.budgetLimit ? () => setIsEditingBudget(false) : undefined}
        />
      ) : (
        <BudgetProgressBar 
          budgetLimit={participant.budgetLimit} 
          currentCost={myTotalCosts} 
          currency={trip.currency} 
          onEdit={() => setIsEditingBudget(true)}
        />
      )}

      {participant.budgetLimit && !isEditingBudget && (
        <DailyBudgetCard
          budgetLimit={participant.budgetLimit}
          currentCost={myTotalCosts}
          currency={trip.currency}
          startDate={trip.startDate}
          endDate={trip.endDate}
        />
      )}

      <div className="mt-8">
        <ExpenseList 
          tripId={tripId}
          currentUserId={user.uid}
          costs={myFilteredCosts} 
          events={events} 
          proposals={proposals} 
          currency={trip.currency} 
        />
      </div>

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        tripId={tripId}
        userId={user.uid}
      />
    </div>
  );
}
