import { useTripSegments, useCreateTripSegment } from "../../hooks";
import { Loader2, Plus, MapPin, CalendarDays } from "lucide-react";
import { useState } from "react";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { TripSegmentForm } from "../TripSegmentForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const TripSegmentsList = ({ tripId }: { tripId: string }) => {
  const { user } = useAuth();
  const { data: segments, isLoading } = useTripSegments(tripId);
  const { mutate: createSegment, isPending } = useCreateTripSegment(tripId);
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <MapPin className="text-primary w-5 h-5" /> Tramos del Viaje
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors shadow-soft"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAdding && (
        <NeumorphicCard className="mb-6 border-l-4 border-l-primary animate-in slide-in-from-top-2">
          <h4 className="font-bold text-sm mb-4">Añadir Nuevo Tramo</h4>
          <TripSegmentForm
            isSubmitting={isPending}
            onSubmit={(data) => {
              if (!user) return;
              createSegment(
                { ...data, userId: user.uid },
                {
                  onSuccess: () => {
                    setIsAdding(false);
                  },
                },
              );
            }}
          />
        </NeumorphicCard>
      )}

      {segments?.length === 0 && !isAdding && (
        <div className="text-center p-6 text-slate-500 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
          <p className="text-sm">Aún no hay tramos definidos.</p>
          <p className="text-xs mt-1">
            Los tramos son paradas o estapas importantes de tu viaje.
          </p>
        </div>
      )}

      <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {segments?.map((segment, idx) => (
          <div
            key={segment.id}
            className="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group is-active"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <span className="text-sm font-black">{idx + 1}</span>
            </div>

            <NeumorphicCard className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 cursor-pointer hover:-translate-y-1 transition-transform">
              <h4 className="font-bold text-slate-800">{segment.name}</h4>
              {segment.destination && (
                <p className="text-xs text-slate-500 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" /> {segment.destination}
                </p>
              )}
              {(segment.startDate || segment.endDate) && (
                <p className="text-xs text-primary font-medium flex items-center mt-2 bg-primary/5 p-1.5 rounded-lg w-fit">
                  <CalendarDays className="w-3 h-3 mr-1" />
                  {segment.startDate
                    ? segment.startDate.toDate().toLocaleDateString()
                    : "??"}{" "}
                  -{" "}
                  {segment.endDate
                    ? segment.endDate.toDate().toLocaleDateString()
                    : "??"}
                </p>
              )}
            </NeumorphicCard>
          </div>
        ))}
      </div>
    </div>
  );
};
