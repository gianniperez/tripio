import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Convierte un valor de fecha (Firestore Timestamp, Date, string o number)
 * a un objeto Date de JS.
 */
export const toDate = (d: unknown): Date | null => {
  if (!d) return null;

  let date: Date;

  if (d instanceof Timestamp) {
    date = d.toDate();
  } else if (
    d &&
    typeof d === "object" &&
    "toDate" in d &&
    typeof (d as { toDate: unknown }).toDate === "function"
  ) {
    date = (d as { toDate: () => Date }).toDate();
  } else if (
    d &&
    typeof d === "object" &&
    "seconds" in d &&
    typeof (d as { seconds: unknown }).seconds === "number"
  ) {
    const ts = d as { seconds: number; nanoseconds?: number };
    date = new Timestamp(ts.seconds, ts.nanoseconds || 0).toDate();
  } else if (d instanceof Date) {
    date = d;
  } else if (typeof d === "string" || typeof d === "number") {
    date = new Date(d);
  } else {
    return null;
  }

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
};

/**
 * Formatea una fecha de Firebase o JS a un string legible.
 */
export const formatFirebaseDate = (
  d: unknown,
  formatStr: string = "dd MMM, HH:mm",
  fallback: string = "N/D"
): string => {
  const date = toDate(d);
  if (!date) return fallback;

  try {
    return format(date, formatStr, { locale: es });
  } catch (err) {
    console.error("Error formatting date:", err, d);
    return fallback;
  }
};
