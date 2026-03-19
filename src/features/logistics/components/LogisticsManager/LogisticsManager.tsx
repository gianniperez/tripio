"use client";

import { useState } from "react";
import { FilterTabBar } from "../../../../components/ui/FilterTabBar";
import { Icon } from "../../../../components/ui/Icon";
import type { LogisticsManagerProps } from "./LogisticsManager.types";
import { ProposalsList } from "../../../proposals/components/ProposalsList/ProposalsList";
import { InventoryList } from "@/features/inventory/components/InventoryList";
import { AccommodationList } from "@/features/accommodation/components/AccommodationList";
import { TransportList } from "@/features/transport/components/TransportList";

type MainTab = "accommodation" | "transport" | "inventory";

export function LogisticsManager({
  tripId,
  user,
  isAdmin,
  onEdit,
}: LogisticsManagerProps) {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("accommodation");

  const mainTabs = [
    { id: "accommodation", label: "Alojamientos", icon: <Icon name="bed" /> },
    {
      id: "transport",
      label: "Transportes",
      icon: <Icon name="directions_car" />,
    },
    { id: "inventory", label: "Inventario", icon: <Icon name="inventory_2" /> },
  ];

  return (
    <div className="space-y-6">
      <FilterTabBar
        tabs={mainTabs}
        activeTab={activeMainTab}
        onTabChange={(id) => setActiveMainTab(id as MainTab)}
      />

      {/* Content Area */}
      {activeMainTab === "accommodation" && (
        <AccommodationList
          tripId={tripId}
          currentUserId={user?.uid || ""}
          isAdmin={isAdmin}
          onEdit={(item) => onEdit?.(item)}
        />
      )}
      
      {activeMainTab === "transport" && (
        <TransportList
          tripId={tripId}
          currentUserId={user?.uid || ""}
          isAdmin={isAdmin}
          onEdit={(item) => onEdit?.(item)}
        />
      )}

      {activeMainTab === "inventory" && (
        <InventoryList
          tripId={tripId}
          currentUserId={user?.uid || ""}
          isAdmin={isAdmin}
          onEdit={(item) => onEdit?.(item)}
        />
      )}
    </div>
  );
}
