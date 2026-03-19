import React from "react";
import { SettingsView } from "@/features/trips/components/SettingsView/SettingsView";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SettingsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const resolvedParams = React.use(params);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        title="Configuración"
        description="Administra los detalles, participantes y características de tu viaje."
      />

      <div className="bg-white backdrop-blur-md rounded-[2.5rem] p-6 border border-white/40 shadow-lg relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <SettingsView tripId={resolvedParams.tripId} />
      </div>
    </div>
  );
}
