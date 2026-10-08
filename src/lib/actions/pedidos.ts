"use client";

import { z } from "zod";
import { nextId } from "@/lib/store";
import type {
  EstadoPedido,
  LineaPedido,
  MovimientoStock,
  Pedido,
  StoreData,
} from "@/lib/types";

const lineaSchema = z.object({
  productoId: z.coerce.number().int().positive(),
  cantidad: z.coerce.number().int().positive("La cantidad debe ser mayor que 0"),
  precioUnitario: z.coerce.number().min(0),
});

const pedidoSchema = z.object({
  clienteId: z.coerce.number().int().positive("Selecciona un cliente"),
  fechaEntrega: z.string().optional().or(z.literal("")),
  notas: z.string().optional().or(z.literal("")),
  descuento: z.coerce.number().min(0).max(100).default(0),
  iva: z.coerce.number().min(0).max(100).default(10),
  lineas: z.array(lineaSchema).min(1, "Añade al menos una línea"),
});

export type PedidoFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

function parseLineas(formData: FormData) {
  const productos = formData.getAll("linea_productoId").map(String);
  const cantidades = formData.getAll("linea_cantidad").map(String);
  const precios = formData.getAll("linea_precioUnitario").map(String);
  const lineas: { productoId: string; cantidad: string; precioUnitario: string }[] = [];
  for (let i = 0; i < productos.length; i++) {
    if (!productos[i] || productos[i] === "0") continue;
    lineas.push({
      productoId: productos[i],
      cantidad: cantidades[i] ?? "0",
      precioUnitario: precios[i] ?? "0",
    });
  }
  return lineas;
}

function siguienteNumero(pedidos: Pedido[]): string {
  const anio = new Date().getFullYear();
  const prefijo = `P-${anio}-`;
  let max = 0;
  for (const p of pedidos) {
    if (!p.numero.startsWith(prefijo)) continue;
    const n = parseInt(p.numero.slice(prefijo.length), 10);
    if (!isNaN(n) && n > max) max = n;
  }
  return `${prefijo}${String(max + 1).padStart(4, "0")}`;
}

type Update = (fn: (prev: StoreData) => StoreData) => void;

export function makeCrearPedido(
  update: Update,
  onSuccess: (nuevoId: number) => void
) {
  return async (
    _prev: PedidoFormState,
    formData: FormData
  ): Promise<PedidoFormState> => {
    const lineas = parseLineas(formData);
    const parsed = pedidoSchema.safeParse({
      clienteId: formData.get("clienteId"),
      fechaEntrega: formData.get("fechaEntrega") ?? "",
      notas: formData.get("notas") ?? "",
      descuento: formData.get("descuento") ?? 0,
      iva: formData.get("iva") ?? 10,
      lineas,
    });
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }
    const data = parsed.data;

    let nuevoPedidoId = 0;
    update((prev) => {
      const subtotal = data.lineas.reduce(
        (s, l) => s + l.cantidad * l.precioUnitario,
        0
      );
      const descuentoEur = subtotal * (data.descuento / 100);
      const baseIva = subtotal - descuentoEur;
      const ivaEur = baseIva * (data.iva / 100);
      const total = baseIva + ivaEur;
      const numero = siguienteNumero(prev.pedidos);
      const now = new Date().toISOString();

      const pedidoId = nextId(prev.pedidos);
      nuevoPedidoId = pedidoId;

      const pedido: Pedido = {
        id: pedidoId,
        numero,
        clienteId: data.clienteId,
        fecha: now,
        fechaEntrega: data.fechaEntrega
          ? new Date(data.fechaEntrega).toISOString()
          : null,
        estado: "PENDIENTE",
        subtotal,
        descuento: descuentoEur,
        iva: ivaEur,
        total,
        notas: data.notas || null,
        creadoEn: now,
        actualizadoEn: now,
      };

      let lineaIdSeq = nextId(prev.lineas);
      const nuevasLineas: LineaPedido[] = data.lineas.map((l) => ({
        id: lineaIdSeq++,
        pedidoId,
        productoId: l.productoId,
        cantidad: l.cantidad,
        precioUnitario: l.precioUnitario,
        subtotal: l.cantidad * l.precioUnitario,
      }));

      const productos = prev.productos.map((p) => {
        const consumida = data.lineas
          .filter((l) => l.productoId === p.id)
          .reduce((s, l) => s + l.cantidad, 0);
        if (consumida === 0) return p;
        return { ...p, stockActual: p.stockActual - consumida };
      });

      let movIdSeq = nextId(prev.movimientos);
      const nuevosMovs: MovimientoStock[] = data.lineas.map((l) => ({
        id: movIdSeq++,
        productoId: l.productoId,
        tipo: "SALIDA",
        motivo: "VENTA",
        cantidad: l.cantidad,
        pedidoId,
        notas: `Venta ${numero}`,
        fecha: now,
      }));

      return {
        ...prev,
        productos,
        pedidos: [...prev.pedidos, pedido],
        lineas: [...prev.lineas, ...nuevasLineas],
        movimientos: [...prev.movimientos, ...nuevosMovs],
      };
    });

    onSuccess(nuevoPedidoId);
    return {};
  };
}

export function cambiarEstadoPedido(
  update: Update,
  id: number,
  estado: EstadoPedido
) {
  update((prev) => ({
    ...prev,
    pedidos: prev.pedidos.map((p) =>
      p.id === id
        ? { ...p, estado, actualizadoEn: new Date().toISOString() }
        : p
    ),
  }));
}

export function eliminarPedido(update: Update, id: number) {
  update((prev) => {
    const pedido = prev.pedidos.find((p) => p.id === id);
    if (!pedido) return prev;
    const lineas = prev.lineas.filter((l) => l.pedidoId === id);
    const debeDevolver = pedido.estado !== "CANCELADO";

    let productos = prev.productos;
    let movimientos = prev.movimientos.filter((m) => m.pedidoId !== id);

    if (debeDevolver) {
      productos = productos.map((p) => {
        const devuelta = lineas
          .filter((l) => l.productoId === p.id)
          .reduce((s, l) => s + l.cantidad, 0);
        if (devuelta === 0) return p;
        return { ...p, stockActual: p.stockActual + devuelta };
      });
      let movIdSeq = nextId(prev.movimientos);
      const now = new Date().toISOString();
      const devoluciones: MovimientoStock[] = lineas.map((l) => ({
        id: movIdSeq++,
        productoId: l.productoId,
        tipo: "ENTRADA",
        motivo: "DEVOLUCION",
        cantidad: l.cantidad,
        pedidoId: null,
        notas: `Reversión por borrado de ${pedido.numero}`,
        fecha: now,
      }));
      movimientos = [...movimientos, ...devoluciones];
    }

    return {
      ...prev,
      productos,
      pedidos: prev.pedidos.filter((p) => p.id !== id),
      lineas: prev.lineas.filter((l) => l.pedidoId !== id),
      movimientos,
    };
  });
}
