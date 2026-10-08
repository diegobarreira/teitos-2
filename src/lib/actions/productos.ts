"use client";

import { z } from "zod";
import { nextId } from "@/lib/store";
import type { Producto, StoreData } from "@/lib/types";

const productoSchema = z.object({
  codigo: z.string().min(1, "Código obligatorio").max(50),
  nombre: z.string().min(1, "Nombre obligatorio").max(200),
  tipo: z.enum(["BLANCO", "MORENO", "CAMPERO", "ECOLOGICO"]),
  tamano: z.enum(["S", "M", "L", "XL", "XXL"]),
  formato: z.enum(["DOCENA", "CARTON_30", "CAJA_180", "CAJA_360"]),
  precioUnitario: z.coerce.number().min(0, "Precio no puede ser negativo"),
  stockActual: z.coerce.number().int().min(0).default(0),
  stockMinimo: z.coerce.number().int().min(0).default(0),
  activo: z.coerce.boolean().default(true),
});

export type ProductoFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

function parseForm(formData: FormData) {
  return productoSchema.safeParse({
    codigo: formData.get("codigo"),
    nombre: formData.get("nombre"),
    tipo: formData.get("tipo"),
    tamano: formData.get("tamano"),
    formato: formData.get("formato"),
    precioUnitario: formData.get("precioUnitario"),
    stockActual: formData.get("stockActual") ?? 0,
    stockMinimo: formData.get("stockMinimo") ?? 0,
    activo: formData.get("activo") === "on" || formData.get("activo") === "true",
  });
}

type Update = (fn: (prev: StoreData) => StoreData) => void;

export function makeCrearProducto(update: Update, onSuccess: () => void) {
  return async (
    _prev: ProductoFormState,
    formData: FormData
  ): Promise<ProductoFormState> => {
    const parsed = parseForm(formData);
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }
    const data = parsed.data;
    let duplicado = false;
    update((prev) => {
      if (prev.productos.some((p) => p.codigo === data.codigo)) {
        duplicado = true;
        return prev;
      }
      const now = new Date().toISOString();
      const nuevo: Producto = {
        id: nextId(prev.productos),
        ...data,
        creadoEn: now,
        actualizadoEn: now,
      };
      return { ...prev, productos: [...prev.productos, nuevo] };
    });
    if (duplicado) {
      return { message: "Ya existe un producto con ese código" };
    }
    onSuccess();
    return {};
  };
}

export function makeActualizarProducto(
  id: number,
  update: Update,
  onSuccess: () => void
) {
  return async (
    _prev: ProductoFormState,
    formData: FormData
  ): Promise<ProductoFormState> => {
    const parsed = parseForm(formData);
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }
    const data = parsed.data;
    let duplicado = false;
    update((prev) => {
      if (
        prev.productos.some((p) => p.codigo === data.codigo && p.id !== id)
      ) {
        duplicado = true;
        return prev;
      }
      const now = new Date().toISOString();
      return {
        ...prev,
        productos: prev.productos.map((p) =>
          p.id === id ? { ...p, ...data, actualizadoEn: now } : p
        ),
      };
    });
    if (duplicado) {
      return { message: "Otro producto ya usa ese código" };
    }
    onSuccess();
    return {};
  };
}

export function eliminarProducto(update: Update, id: number) {
  update((prev) => ({
    ...prev,
    productos: prev.productos.map((p) =>
      p.id === id
        ? { ...p, activo: false, actualizadoEn: new Date().toISOString() }
        : p
    ),
  }));
}
