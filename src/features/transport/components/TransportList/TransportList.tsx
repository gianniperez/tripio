import type { TransportListProps } from "./TransportList.types";
import { useProposals } from "@/features/proposals/hooks/useProposals";
import { TransportCard } from "../TransportCard";
import { useDeleteTransport } from "@/features/transport/hooks/useDeleteTransport";
import { useParticipants } from "@/features/participants/hooks";
import { Icon } from "@/components/ui/Icon";

export function TransportList({ tripId, currentUserId, isAdmin, onEdit }: TransportListProps) {
  const { data: items = [], isLoading } = useProposals(tripId, "transport");
  const { mutate: deleteTransport } = useDeleteTransport(tripId);
  const { data: participants } = useParticipants(tripId);

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

  const confirmedItems = items.filter(item => item.status === "confirmed");

  const handleDelete = (itemId: string) => {
    deleteTransport(itemId);
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
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <Icon name="directions_car" className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">
          Nada en transportes aún
        </h3>
        <p className="text-slate-500 text-sm max-w-sm">
          Los transportes confirmados aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {confirmedItems.map((item) => (
        <TransportCard
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