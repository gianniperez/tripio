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
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader title="Finanzas" description="Administra los gastos y deudas del viaje." />
      <FinancesView tripId={tripId} />
    </div>
  );
}
