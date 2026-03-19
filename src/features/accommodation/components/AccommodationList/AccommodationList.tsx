import type { AccommodationListProps } from "./AccommodationList.types";
import { useProposals } from "@/features/proposals/hooks/useProposals";
import { AccommodationCard } from "../AccommodationCard";
import { useDeleteAccommodation } from "@/features/accommodation/hooks/useDeleteAccommodation";
import { useParticipants } from "@/features/participants/hooks";
import { Icon } from "@/components/ui/Icon";

export function AccommodationList({ tripId, currentUserId, isAdmin, onEdit }: AccommodationListProps) {
  const { data: items = [], isLoading } = useProposals(tripId, "accommodation");
  const { mutate: deleteAccommodation } = useDeleteAccommodation(tripId);
  const { data: participants } = useParticipants(tripId);

  // Group participants for the card
  const userProfiles = (participants || []).reduce(
    (acc, p) => ({
      ...acc,
      [p.uid]:
        (p as { displayName?: string; email?: string }).displayName ||
        (p as { displayName?: string; email?: string }).email ||
        "Usuario",
    }),
    {} as Record<string, string>,
  );

  // Consider only confirmed accommodation items
  const confirmedItems = items.filter(item => item.status === "confirmed");

  const handleDelete = (itemId: string) => {
    deleteAccommodation(itemId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (confirmedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Icon name="bed" className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">
          Nada en alojamientos aún
        </h3>
        <p className="text-slate-500 text-sm max-w-sm">
          Los alojamientos confirmados aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {confirmedItems.map((item) => (
        <AccommodationCard
          key={item.id}
          item={item}
          canManage={isAdmin || item.createdBy === currentUserId}
          onEdit={() => onEdit(item)}
          onDelete={() => handleDelete(item.id)}
          userProfiles={userProfiles}
        />
      ))}
    </div>
  );
}