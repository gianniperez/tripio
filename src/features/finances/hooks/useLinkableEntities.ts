import { useMemo } from "react";
import { useAccommodations, useTransports, useInventory } from "@/features/logistics/hooks/useLogistics";
import { useEvents } from "@/features/trips/hooks/useEvents";

export type LinkableEntityType = 'activity' | 'accommodation' | 'transport' | 'inventory';

export interface LinkableEntity {
  id: string;
  title: string;
  type: LinkableEntityType;
  date?: Date;
  category?: string;
}

export const useLinkableEntities = (tripId: string) => {
  const { data: accommodations, isLoading: loadingAcc } = useAccommodations(tripId);
  const { data: transports, isLoading: loadingTrans } = useTransports(tripId);
  const { data: inventory, isLoading: loadingInv } = useInventory(tripId);
  const { data: events, isLoading: loadingEvents } = useEvents(tripId);

  const isLoading = loadingAcc || loadingTrans || loadingInv || loadingEvents;

  const entities = useMemo(() => {
    const all: LinkableEntity[] = [];

    // Activities
    events?.forEach(e => {
      all.push({
        id: e.id,
        title: e.title,
        type: 'activity',
        date: e.date as Date,
        category: 'activity'
      });
    });

    // Accommodations
    accommodations?.forEach(a => {
      all.push({
        id: a.id,
        title: a.title,
        type: 'accommodation',
        date: a.checkIn as Date,
        category: 'accommodation'
      });
    });

    // Transports
    transports?.forEach(t => {
      all.push({
        id: t.id,
        title: t.title,
        type: 'transport',
        date: t.departure as Date,
        category: 'transport'
      });
    });

    // Inventory
    inventory?.forEach(i => {
      all.push({
        id: i.id,
        title: i.title,
        type: 'inventory',
        category: 'equipment'
      });
    });

    return all.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.getTime() - b.date.getTime();
    });
  }, [accommodations, transports, inventory, events]);

  return {
    entities,
    isLoading
  };
};
