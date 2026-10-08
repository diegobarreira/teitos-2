"use client";

import { z } from "zod";
import { nextId } from "@/lib/store";
import type { MovimientoStock, StoreData } from "@/lib/types";

const movimientoSchema = z.object({
  productoId: z.coerce.number().int().positive("Selecciona un producto"),
  tipo: z.enum(["ENTRADA", "SALIDA", "AJUSTE"]),
  motivo: z.enum([
    "PRODUCCION",
    "COMPRA",
    "VENTA",
    "MERMA",
    "AJUSTE_INVENTARIO",
    "DEVOLUCION",
  ]),
  cantidad: z.coerce.number().int().positive("Cantidad mayor que 0"),
  notas: z.string().optional().or(z.literal("")),
});

export type MovimientoFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

type Update = (fn: (prev: StoreData) => StoreData) => void;

export function makeRegistrarMovimiento(update: Update) {
  return async (
    _prev: MovimientoFormState,
    formData: FormData
  ): Promise<MovimientoFormState> => {
    const parsed = movimientoSchema.safeParse({
      productoId: formData.get("productoId"),
      tipo: formData.get("tipo"),
      motivo: formData.get("motivo"),
      cantidad: formData.get("cantidad"),
      notas: formData.get("notas") ?? "",
    });
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }
    const d = parsed.data;
    update((prev) => {
      const now = new Date().toISOString();
      const movimiento: MovimientoStock = {
        id: nextId(prev.movimientos),
        productoId: d.productoId,
        tipo: d.tipo,
        motivo: d.motivo,
        cantidad: d.cantidad,
        pedidoId: null,
        notas: d.notas || null,
        fecha: now,
      };
      const productos = prev.productos.map((p) => {
        if (p.id !== d.productoId) return p;
        if (d.tipo === "ENTRADA") {
          return { ...p, stockActual: p.stockActual + d.cantidad };
        }
        if (d.tipo === "SALIDA") {
          return { ...p, stockActual: p.stockActual - d.cantidad };
        }
        return { ...p, stockActual: d.cantidad };
      });
      return {
        ...prev,
        productos,
        movimientos: [...prev.movimientos, movimiento],
      };
    });
    return { message: "Movimiento registrado correctamente" };
  };
}
