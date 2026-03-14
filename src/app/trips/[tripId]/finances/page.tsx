"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import {
  useTrip,
  useEvents,
  useUpdateParticipant,
  useUpdateTrip,
  useSyncTripSummary,
} from "@/features/trips/hooks";
import { useCosts } from "@/features/finances/hooks/useCosts";
import { BudgetProgressBar } from "@/features/finances/components/BudgetProgressBar";
import { SetBudgetCard } from "@/features/finances/components/SetBudgetCard";
import { ExpenseList } from "@/features/finances/components/ExpenseList";
import { DailyBudgetCard } from "@/features/finances/components/DailyBudgetCard";
import {
  calculateMyCosts,
  filterMyRelatedCosts,
} from "@/features/finances/utils/calculateCosts";
import { doc, collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Participant, Proposal } from "@/types/tripio";
import { PageHeader } from "@/components/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";

export default function TripFinances() {
  const { tripId } = useParams<{ tripId: string }>();
  const { user } = useAuth();

  const { data: trip, isLoading: isLoadingTrip } = useTrip(tripId);
  const { data: events, isLoading: isLoadingEvents } = useEvents(tripId);
  const { data: costs, isLoading: isLoadingCosts } = useCosts(tripId);
  const updateParticipant = useUpdateParticipant();
  const updateTrip = useUpdateTrip();
  const { mutate: syncSummary } = useSyncTripSummary();

  const [participant, setParticipant] = useState<Participant | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  useEffect(() => {
    if (!tripId || !user?.uid) return;

    let isSubscribed = true;

    const unsubParticipant = onSnapshot(
      doc(db, "trips", tripId, "participants", user.uid),
      (docSnap) => {
        if (docSnap.exists() && isSubscribed) {
          setParticipant({ id: docSnap.id, ...docSnap.data() } as Participant);
        }
      },
    );

    const unsubProposals = onSnapshot(
      query(collection(db, "trips", tripId, "proposals")),
      (snapshot) => {
        if (isSubscribed) {
          const props = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as Proposal,
          );
          setProposals(props);
        }
      },
    );

    return () => {
      isSubscribed = false;
      unsubParticipant();
      unsubProposals();
    };
  }, [tripId, user?.uid]);

  const isReady = participant !== null;
  const isLoading =
    isLoadingTrip || isLoadingEvents || isLoadingCosts || !isReady;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Icon
          name="progress_activity"
          className="w-10 h-10 text-primary animate-spin"
        />
        <p className="text-gray-500 font-medium">Cargando finanzas...</p>
      </div>
    );
  }

  if (!trip || !participant || !user) return null;

  const handleSetBudget = async (amount: number) => {
    // 1. Update the personal budget limit for this view
    await updateParticipant.mutateAsync({
      tripId,
      participantId: user.uid,
      data: { budgetLimit: amount },
    });

    // 2. Update the global trip budget (used by the dashboard widget)
    await updateTrip.mutateAsync({
      tripId,
      data: { budget: amount },
    });

    // 3. Trigger summary sync to update denormalized data
    syncSummary(tripId);
  };

  const myTotalCosts = calculateMyCosts(costs, events, proposals, user.uid);
  const myFilteredCosts = filterMyRelatedCosts(
    costs,
    events,
    proposals,
    user.uid,
  );

  return (
    <div className="space-y-6 pb-24">
      <PageHeader
        title="Finanzas"
        description="Proyección de tus gastos personales para este viaje."
      />

      {!participant.budgetLimit || isEditingBudget ? (
        <SetBudgetCard
          onSetBudget={(amount) => {
            handleSetBudget(amount);
            setIsEditingBudget(false);
          }}
          currency={trip.currency}
          initialBudget={participant.budgetLimit || undefined}
          onCancel={
            participant.budgetLimit
              ? () => setIsEditingBudget(false)
              : undefined
          }
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
          proposals={proposals}
          currency={trip.currency}
        />
      </div>
    </div>
  );
}
