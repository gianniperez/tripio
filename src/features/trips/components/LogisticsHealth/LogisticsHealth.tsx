import { NeumorphicCard } from "@/components/neumorphic/NeumorphicCard";
import { Icon } from "@/components/ui/Icon";
import type { LogisticsHealthProps } from "./LogisticsHealth.types";
import { cn } from "@/lib/utils";

export function LogisticsHealth({
  accommodation,
  transport,
}: LogisticsHealthProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-success bg-success/5 border-success/20 border-2";
      case "pending":
        return "text-primary-extralight bg-primary-extralight/10 border-primary-extralight/20 border-2";
      default:
        return "text-gray-400 bg-gray-100/50 border-2 border-gray-200";
    }
  };

  const StatusTile = ({
    status,
    icon,
    label,
  }: {
    status: string;
    icon: string;
    label: string;
  }) => (
    <div
      className={cn(
        "flex flex-col items-center p-6 rounded-2xl border transition-all duration-300",
        getStatusStyles(status),
      )}
    >
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center",
          status === "confirmed" && "text-success",
        )}
      >
        <Icon name={icon} size={26} />
      </div>
      <div className="text-center">
        <p className="text-xs font-black uppercase mb-1">{label}</p>
        <div className="flex items-center justify-center gap-1">
          <div
            className={cn(
              "w-2 h-2 rounded-xl animate-pulse",
              status === "confirmed"
                ? "bg-success"
                : status === "pending"
                  ? "bg-primary-extralight"
                  : "bg-gray-400",
            )}
          />
          <span className="text-xs font-bold opacity-70">
            {status === "confirmed"
              ? "Confirmado"
              : status === "pending"
                ? "En discusión"
                : "Sin definir"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <NeumorphicCard className="h-full flex flex-col p-5">
      <div className="grid grid-cols-2 gap-3">
        <StatusTile status={accommodation} icon="bed" label="Alojamiento" />
        <StatusTile status={transport} icon="flight" label="Transporte" />
      </div>
    </NeumorphicCard>
  );
}
