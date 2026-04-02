import { PageHeader } from "@/components/ui/PageHeader";
import type { Metadata } from "next";
import { ProposalsView } from "./ProposalsView";

export const metadata: Metadata = {
  title: "Propuestas | Tripio",
  description: "Propuestas del viaje",
};

interface ProposalsPageProps {
  params: Promise<{ tripId: string }>;
}

export default async function TripsTripIdProposalsPage({ params }: ProposalsPageProps) {
  const { tripId } = await params;

  return (
    <div>
      <PageHeader
        title="Propuestas"
        description="Vota las actividades y lugares sugeridos"
        mainIcon="lightbulb"
      />
      <ProposalsView tripId={tripId} />
    </div>
  );
}
