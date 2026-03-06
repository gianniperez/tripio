import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propuestas | Tripio",
  description: "Listado de propuestas y votaciones pendientes.",
};

export default function ProposalsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Propuestas</h2>
      <p className="text-gray-600">
        Listado de propuestas y votaciones pendientes.
      </p>
    </div>
  );
}
