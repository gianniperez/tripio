import Link from "next/link";
import { NeumorphicCard } from "@/components/NeumorphicCard";
import { TopBar } from "@/components/layout/TopBar";
import { Plus, Calendar, MapPin } from "lucide-react";
import Image from "next/image";

// Mock data for MVP display
const MOCK_TRIPS = [
  {
    id: "123",
    name: "Expedición Patagonia",
    destination: "Bariloche, Argentina",
    startDate: new Date("2024-07-15"),
    endDate: new Date("2024-07-22"),
    coverImage:
      "https://images.unsplash.com/photo-1544365558-35aa4af4119b?q=80&w=800&auto=format&fit=crop",
    status: "planning",
  },
  {
    id: "456",
    name: "Relax en la Playa",
    destination: "Florianópolis, Brasil",
    startDate: new Date("2025-01-10"),
    endDate: new Date("2025-01-20"),
    coverImage:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800&auto=format&fit=crop",
    status: "planning",
  },
];

export default function TripsList() {
  return (
    <div className="flex flex-col min-h-screen bg-[--bg-color] max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <TopBar />
      <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-[--text-color] tracking-tight">
            Mis Viajes
          </h1>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-md hover:bg-primary/90 transition-colors">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {MOCK_TRIPS.map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="block group"
            >
              <NeumorphicCard className="p-0 overflow-hidden relative h-48 group-hover:shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)] transition-all">
                {/* Cover Image */}
                <div className="absolute inset-0">
                  <Image
                    src={trip.coverImage}
                    alt={trip.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <h2 className="text-xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">
                    {trip.name}
                  </h2>
                  <div className="flex flex-col gap-1 text-gray-200 text-sm font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        {trip.startDate.toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        -{" "}
                        {trip.endDate.toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </NeumorphicCard>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
