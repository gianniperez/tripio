/**
 * Formato estándar de moneda para la aplicación (es-AR pesos por defecto)
 */
export const formatMoney = (amount: number, currency: string = "ARS") => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
