import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = {
  title: "Configuración | Tripio",
  description: "Configuración del viaje",
};

export default async function TripsTripIdSettingsPage({ params }: { params: { tripId: string } }) {
  const { tripId } = await params;
  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Ajustes y miembros del viaje"
        mainIcon="settings"
      />

      <SettingsClient tripId={tripId} />
    </div>
  );
}
