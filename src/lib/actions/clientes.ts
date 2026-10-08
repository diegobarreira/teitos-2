"use client";

import { z } from "zod";
import { nextId } from "@/lib/store";
import type { Cliente, StoreData } from "@/lib/types";

const clienteSchema = z.object({
  nombre: z.string().min(1, "Nombre obligatorio").max(200),
  cif: z.string().min(1, "CIF obligatorio").max(20),
  direccion: z.string().min(1, "Dirección obligatoria"),
  ciudad: z.string().min(1, "Ciudad obligatoria"),
  codigoPostal: z.string().min(1, "Código postal obligatorio").max(10),
  provincia: z.string().min(1, "Provincia obligatoria"),
  telefono: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  personaContacto: z.string().optional().or(z.literal("")),
  descuento: z.coerce.number().min(0).max(100).default(0),
  notas: z.string().optional().or(z.literal("")),
  activo: z.coerce.boolean().default(true),
});

export type ClienteFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

function parseForm(formData: FormData) {
  return clienteSchema.safeParse({
    nombre: formData.get("nombre"),
    cif: formData.get("cif"),
    direccion: formData.get("direccion"),
    ciudad: formData.get("ciudad"),
    codigoPostal: formData.get("codigoPostal"),
    provincia: formData.get("provincia"),
    telefono: formData.get("telefono") ?? "",
    email: formData.get("email") ?? "",
    personaContacto: formData.get("personaContacto") ?? "",
    descuento: formData.get("descuento") ?? 0,
    notas: formData.get("notas") ?? "",
    activo: formData.get("activo") === "on" || formData.get("activo") === "true",
  });
}

type Update = (fn: (prev: StoreData) => StoreData) => void;

export function makeCrearCliente(update: Update, onSuccess: () => void) {
  return async (
    _prev: ClienteFormState,
    formData: FormData
  ): Promise<ClienteFormState> => {
    const parsed = parseForm(formData);
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }
    const data = parsed.data;
    let duplicado = false;
    update((prev) => {
      if (prev.clientes.some((c) => c.cif === data.cif)) {
        duplicado = true;
        return prev;
      }
      const now = new Date().toISOString();
      const nuevo: Cliente = {
        id: nextId(prev.clientes),
        nombre: data.nombre,
        cif: data.cif,
        direccion: data.direccion,
        ciudad: data.ciudad,
        codigoPostal: data.codigoPostal,
        provincia: data.provincia,
        telefono: data.telefono || null,
        email: data.email || null,
        personaContacto: data.personaContacto || null,
        descuento: data.descuento,
        notas: data.notas || null,
        activo: data.activo,
        creadoEn: now,
        actualizadoEn: now,
      };
      return { ...prev, clientes: [...prev.clientes, nuevo] };
    });
    if (duplicado) {
      return { message: "Ya existe un cliente con ese CIF" };
    }
    onSuccess();
    return {};
  };
}

export function makeActualizarCliente(
  id: number,
  update: Update,
  onSuccess: () => void
) {
  return async (
    _prev: ClienteFormState,
    formData: FormData
  ): Promise<ClienteFormState> => {
    const parsed = parseForm(formData);
    if (!parsed.success) {
      return { errors: parsed.error.flatten().fieldErrors };
    }
    const data = parsed.data;
    let duplicado = false;
    update((prev) => {
      if (prev.clientes.some((c) => c.cif === data.cif && c.id !== id)) {
        duplicado = true;
        return prev;
      }
      const now = new Date().toISOString();
      return {
        ...prev,
        clientes: prev.clientes.map((c) =>
          c.id === id
            ? {
                ...c,
                nombre: data.nombre,
                cif: data.cif,
                direccion: data.direccion,
                ciudad: data.ciudad,
                codigoPostal: data.codigoPostal,
                provincia: data.provincia,
                telefono: data.telefono || null,
                email: data.email || null,
                personaContacto: data.personaContacto || null,
                descuento: data.descuento,
                notas: data.notas || null,
                activo: data.activo,
                actualizadoEn: now,
              }
            : c
        ),
      };
    });
    if (duplicado) {
      return { message: "Otro cliente ya usa ese CIF" };
    }
    onSuccess();
    return {};
  };
}

export function eliminarCliente(update: Update, id: number) {
  update((prev) => ({
    ...prev,
    clientes: prev.clientes.map((c) =>
      c.id === id
        ? { ...c, activo: false, actualizadoEn: new Date().toISOString() }
        : c
    ),
  }));
}
