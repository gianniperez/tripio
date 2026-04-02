import type { Metadata } from "next";
import { FinancesView } from "./FinancesView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Finanzas | Tripio",
  description: "Finanzas del viaje",
};

export default async function TripsTripIdFinancesPage({ params }: { params: { tripId: string } }) {
  const { tripId } = await params;
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title="Finanzas"
        description="Gestiona tu presupuesto, gastos y deudas"
        mainIcon="payments"
      />
      <FinancesView tripId={tripId} />
    </div>
  );
}
