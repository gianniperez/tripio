import type { Metadata } from "next";
import { LogisticsClient } from "./LogisticsClient";

export const metadata: Metadata = {
  title: "Logística | Tripio",
  description: "Logística del viaje",
};

interface Props {
  params: Promise<{ tripId: string }>;
}

export default async function TripsTripIdLogisticsPage({ params }: Props) {
  const { tripId } = await params;

  return (
    <div>
      <LogisticsClient tripId={tripId} />
    </div>
  );
}
