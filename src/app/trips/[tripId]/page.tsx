import { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Viaje | Tripio",
  description: "Información del viaje",
};

export default async function TripPage({ params }: { params: { tripId: string } }) {
  const { tripId } = await params;
  return (
    <main>
      <DashboardClient tripId={tripId} />
    </main>
  );
}
