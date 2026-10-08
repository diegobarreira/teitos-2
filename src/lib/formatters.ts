const eurosFormat = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const numberFormat = new Intl.NumberFormat("es-ES");

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormat = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function euros(value: number | string | { toString(): string } | null | undefined) {
  if (value == null) return eurosFormat.format(0);
  const n = typeof value === "number" ? value : Number(value.toString());
  return eurosFormat.format(isNaN(n) ? 0 : n);
}

export function numero(value: number | null | undefined) {
  if (value == null) return "0";
  return numberFormat.format(value);
}

export function fecha(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return dateFormat.format(d);
}

export function fechaHora(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return dateTimeFormat.format(d);
}

export const tipoHuevoLabel: Record<string, string> = {
  BLANCO: "Blanco",
  MORENO: "Moreno",
  CAMPERO: "Campero",
  ECOLOGICO: "Ecológico",
};

export const formatoLabel: Record<string, string> = {
  DOCENA: "Docena (12u)",
  CARTON_30: "Cartón (30u)",
  CAJA_180: "Caja (180u)",
  CAJA_360: "Caja (360u)",
};

export const estadoPedidoLabel: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const estadoPedidoColor: Record<string, string> = {
  PENDIENTE: "bg-zinc-100 text-zinc-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  ENVIADO: "bg-amber-100 text-amber-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

export const tipoMovimientoLabel: Record<string, string> = {
  ENTRADA: "Entrada",
  SALIDA: "Salida",
  AJUSTE: "Ajuste",
};

export const motivoMovimientoLabel: Record<string, string> = {
  PRODUCCION: "Producción",
  COMPRA: "Compra",
  VENTA: "Venta",
  MERMA: "Merma",
  AJUSTE_INVENTARIO: "Ajuste inventario",
  DEVOLUCION: "Devolución",
};
