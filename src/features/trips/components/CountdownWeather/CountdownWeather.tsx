import { useState, useEffect } from "react";
import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import type { CountdownWeatherProps } from "./CountdownWeather.types";

export function CountdownWeather({
  startDate,
  endDate,
}: CountdownWeatherProps) {
  const [timeLeft, setTimeLeft] = useState<Duration | null>(null);
  const [status, setStatus] = useState<"upcoming" | "ongoing" | "finished">(
    "upcoming",
  );

  useEffect(() => {
    if (!startDate) return;

    const toDate = (date: any) =>
      date?.toDate ? date.toDate() : new Date(date);
    const start = toDate(startDate);
    const end = endDate ? toDate(endDate) : null;

    const updateCountdown = () => {
      const now = new Date();

      if (end && isBefore(end, now)) {
        setStatus("finished");
        setTimeLeft(null);
        return;
      }

      if (isBefore(start, now)) {
        setStatus("ongoing");
        setTimeLeft(null);
        return;
      }

      const duration = intervalToDuration({
        start: now,
        end: start,
      });

      setStatus("upcoming");
      setTimeLeft(duration);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  if (!startDate) return null;

  const TimeUnit = ({
    value,
    label,
  }: {
    value: number | undefined;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black tracking-tighter tabular-nums leading-none my-1">
        {value || 0}
      </span>
      <span className="text-xs uppercase tracking-wider opacity-60">
        {label}
      </span>
    </div>
  );

  return (
    <NeumorphicCard className="h-full relative overflow-hidden py-8 text-center bg-linear-to-br from-accent to-accent-dark text-white group">
      {/* Icon */}
      <div className="absolute top-0 right-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Icon name="plane_contrails" size={160} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-xs font-black uppercase text-white/70 tracking-widest mb-1">
          {status === "finished"
            ? "Viaje finalizado"
            : status === "ongoing"
              ? "Viaje en curso"
              : "El viaje comienza en"}
        </h3>

        {status === "finished" ? (
          <p className="text-xl font-black px-4 leading-tight">
            ¡Esperamos que hayas disfrutado tu viaje!
          </p>
        ) : status === "ongoing" ? (
          <p className="text-2xl font-black">¡Buen Viaje!</p>
        ) : timeLeft ? (
          <div className="flex items-center gap-4">
            <TimeUnit value={timeLeft.days} label="Días" />
            <div className="text-2xl font-bold opacity-30 -mt-4">:</div>
            <TimeUnit value={timeLeft.hours} label="Hrs" />
            <div className="text-2xl font-bold opacity-30 -mt-4">:</div>
            <TimeUnit value={timeLeft.minutes} label="Min" />
            <div className="text-2xl font-bold opacity-30 -mt-4">:</div>
            <TimeUnit value={timeLeft.seconds} label="Seg" />
          </div>
        ) : (
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg" />
            <div className="w-10 h-10 bg-white/20 rounded-lg" />
            <div className="w-10 h-10 bg-white/20 rounded-lg" />
          </div>
        )}
      </div>
    </NeumorphicCard>
  );
}
