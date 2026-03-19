import type { InventoryListProps } from "./InventoryList.types";
import { useProposals } from "@/features/proposals/hooks/useProposals";
import { InventoryCard } from "../InventoryCard";
import { useDeleteInventory } from "@/features/inventory/hooks/useDeleteInventory";
import { useParticipants } from "@/features/participants/hooks";
import { Icon } from "@/components/ui/Icon";

export function InventoryList({ tripId, currentUserId, isAdmin, onEdit, isPersonalFilter }: InventoryListProps) {
  const { data: items = [], isLoading } = useProposals(tripId, "inventory");
  const { mutate: deleteInventory } = useDeleteInventory(tripId);
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

  // Consider only confirmed inventory items
  const confirmedItems = items.filter(item => {
    if (item.status !== "confirmed") return false;
    if (isPersonalFilter !== undefined) {
      const isItemPersonal = (item as any).isPersonalInventory || (item as any).visibility === "personal";
      if (isPersonalFilter && !isItemPersonal) return false;
      if (!isPersonalFilter && isItemPersonal) return false;
    }
    return true;
  });

  const handleDelete = (itemId: string) => {
    deleteInventory(itemId);
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
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
          <Icon name="inventory_2" className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">
          Nada en el inventario aún
        </h3>
        <p className="text-slate-500 text-sm max-w-sm">
          Los items confirmados para llevar aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {confirmedItems.map((item) => (
        <InventoryCard
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