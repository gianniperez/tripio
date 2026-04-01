import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Convierte un valor de fecha (Firestore Timestamp, Date, string o number)
 * a un objeto Date de JS.
 */
export const toDate = (d: any): Date | null => {
  if (!d) return null;
  
  let date: Date;
  
  if (d instanceof Timestamp) {
    date = d.toDate();
  } else if (typeof d.toDate === "function") {
    date = d.toDate();
  } else if (d && typeof d.seconds === "number") {
    date = new Timestamp(d.seconds, d.nanoseconds || 0).toDate();
  } else if (d instanceof Date) {
    date = d;
  } else {
    date = new Date(d);
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
  d: any, 
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
