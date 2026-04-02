import { useTrip } from "./useTrip";

/**
 * Hook para obtener la moneda de un viaje específico.
 * Retorna el código de la moneda (ej. "USD", "ARS") o "$" por defecto.
 */
export const useTripCurrency = (tripId: string) => {
  const { data: trip } = useTrip(tripId);
  return trip?.currency || "$";
};
