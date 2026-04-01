import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actividades | Tripio",
  description: "Actividades del viaje",
};

import { ActivitiesClient } from "./ActivitiesClient";

interface Props {
  params: Promise<{ tripId: string }>;
}

export default async function TripsTripIdActivitiesPage({ params }: Props) {
  const { tripId } = await params;

  return (
    <div>
      <ActivitiesClient tripId={tripId} />
    </div>
  );
}
