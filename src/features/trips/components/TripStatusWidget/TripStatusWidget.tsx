"use client";

import { Trip } from "@/types/models";
import { useCountdown } from "@/hooks/useCountdown";
import { Timestamp } from "firebase/firestore";
import { useMemo } from "react";
import { Icon } from "@/components/ui/Icon";

interface TripStatusWidgetProps {
  trip: Trip;
}

export function TripStatusWidget({ trip }: TripStatusWidgetProps) {
  const startDate = useMemo(() => {
    if (!trip.startDate) return null;
    return (trip.startDate as unknown as Timestamp).toDate
      ? (trip.startDate as unknown as Timestamp).toDate()
      : new Date(trip.startDate as unknown as string);
  }, [trip.startDate]);

  const endDate = useMemo(() => {
    if (!trip.endDate) return null;
    return (trip.endDate as unknown as Timestamp).toDate
      ? (trip.endDate as unknown as Timestamp).toDate()
      : new Date(trip.endDate as unknown as string);
  }, [trip.endDate]);

  const { days, hours, minutes, seconds } = useCountdown(startDate);

  const status = useMemo(() => {
    const now = new Date();
    if (startDate && endDate) {
      // Ajustamos end date a fin del día
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);

      if (now < startDate) return "planning";
      if (now >= startDate && now <= endOfDay) return "active";
      if (now > endOfDay) return "archived";
    }
    if (startDate && !endDate) {
      if (now < startDate) return "planning";
      return "active"; // Si pasamos la fecha de inicio y no hay final
    }
    return "planning"; // Sin fechas definidas, planning por defecto
  }, [startDate, endDate]);

  const renderContent = () => {
    if (status === "planning") {
      if (!startDate) {
        return (
          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <h3 className="text-white/80 text-xs sm:text-sm font-bold tracking-widest uppercase mb-1 drop-shadow-sm">
              PREPARA TU AVENTURA
            </h3>
            <p className="text-white text-xl sm:text-2xl font-black drop-shadow-md pb-4 pt-1">
              ¡Define las fechas de tu viaje!
            </p>
          </div>
        );
      }

      const timeUnits = [
        { value: days, label: "DÍAS" },
        { value: hours, label: "HRS" },
        { value: minutes, label: "MIN" },
        { value: seconds, label: "SEG" },
      ];

      return (
        <div className="flex flex-col items-center justify-center h-full w-full relative z-10 px-4 sm:px-0 mt-3 sm:mt-1">
          <h3 className="text-white/80 text-[10px] sm:text-xs font-bold tracking-widest uppercase sm:mb-2 drop-shadow-sm mb-1">
            EL VIAJE COMIENZA EN
          </h3>

          <div className="flex items-center gap-2 sm:gap-4 mb-2 pb-2">
            {timeUnits.map((unit, idx) => (
              <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center min-w-[36px] sm:min-w-[48px]">
                  <span className="text-3xl text-white font-black tracking-tighter tabular-nums leading-none my-1">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="text-white/70 text-[10px] sm:text-xs font-bold tracking-wider uppercase mt-1">
                    {unit.label}
                  </span>
                </div>
                {idx < timeUnits.length - 1 && (
                  <span className="text-white/30 text-2xl sm:text-3xl font-bold -mt-4">:</span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (status === "active") {
      return (
        <div className="flex flex-col items-center justify-center h-full relative z-10 px-4 py-8">
          <h3 className="text-white/80 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1 drop-shadow-sm">
            VIAJE EN CURSO
          </h3>
          <p className="text-white text-3xl sm:text-4xl font-black drop-shadow-md">¡Buen Viaje!</p>
        </div>
      );
    }

    // archived
    return (
      <div className="flex flex-col items-center justify-center h-full relative z-10 px-4 py-6">
        <h3 className="text-white/80 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-1 drop-shadow-sm">
          VIAJE FINALIZADO
        </h3>
        <p className="text-white text-2xl sm:text-3xl font-black drop-shadow-md text-center max-w-[90%] sm:max-w-none pb-2 pt-1">
          ¡Esperamos que hayas disfrutado tu viaje!
        </p>
      </div>
    );
  };

  return (
    <div className="group w-full bg-linear-to-br from-accent to-accent-dark rounded-tripio relative overflow-hidden shadow-cream min-h-[120px] sm:min-h-[140px] flex items-center justify-center">
      {/* Icon */}
      <div className="absolute top-0 right-12 opacity-10 group-hover:scale-110 transition-transform duration-700 text-white">
        <Icon name="plane_contrails" size={160} />
      </div>

      {/* Contenido Dinámico */}
      {renderContent()}
    </div>
  );
}
