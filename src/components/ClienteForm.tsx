"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  makeActualizarCliente,
  makeCrearCliente,
  type ClienteFormState,
} from "@/lib/actions/clientes";
import type { Cliente } from "@/lib/types";

export function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter();
  const { update } = useStore();

  const action = useMemo(() => {
    const onSuccess = () => {
      router.push("/clientes");
      router.refresh();
    };
    return cliente
      ? makeActualizarCliente(cliente.id, update, onSuccess)
      : makeCrearCliente(update, onSuccess);
  }, [cliente, update, router]);

  const [state, formAction, pending] = useActionState<ClienteFormState, FormData>(
    action,
    {}
  );
  const err = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="card p-6 max-w-3xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Nombre de la granja *</label>
          <input
            name="nombre"
            defaultValue={cliente?.nombre}
            className="input"
            required
          />
          {err("nombre") && (
            <p className="text-xs text-red-600 mt-1">{err("nombre")}</p>
          )}
        </div>
        <div>
          <label className="label">CIF/NIF *</label>
          <input
            name="cif"
            defaultValue={cliente?.cif}
            className="input"
            required
          />
          {err("cif") && (
            <p className="text-xs text-red-600 mt-1">{err("cif")}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label">Dirección *</label>
        <input
          name="direccion"
          defaultValue={cliente?.direccion}
          className="input"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Ciudad *</label>
          <input
            name="ciudad"
            defaultValue={cliente?.ciudad}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">Código postal *</label>
          <input
            name="codigoPostal"
            defaultValue={cliente?.codigoPostal}
            className="input"
            required
          />
        </div>
        <div>
          <label className="label">Provincia *</label>
          <input
            name="provincia"
            defaultValue={cliente?.provincia}
            className="input"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Teléfono</label>
          <input
            name="telefono"
            defaultValue={cliente?.telefono ?? ""}
            className="input"
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            name="email"
            type="email"
            defaultValue={cliente?.email ?? ""}
            className="input"
          />
          {err("email") && (
            <p className="text-xs text-red-600 mt-1">{err("email")}</p>
          )}
        </div>
        <div>
          <label className="label">Persona de contacto</label>
          <input
            name="personaContacto"
            defaultValue={cliente?.personaContacto ?? ""}
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Descuento por defecto (%)</label>
          <input
            name="descuento"
            type="number"
            step="0.01"
            min="0"
            max="100"
            defaultValue={cliente?.descuento ?? 0}
            className="input"
          />
        </div>
        <label className="flex items-end gap-2 pb-2">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={cliente?.activo ?? true}
          />
          <span className="text-sm text-zinc-700">Cliente activo</span>
        </label>
      </div>

      <div>
        <label className="label">Notas</label>
        <textarea
          name="notas"
          rows={3}
          defaultValue={cliente?.notas ?? ""}
          className="input"
        />
      </div>

      {state.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
        <Link href="/clientes" className="btn-secondary">
          Cancelar
        </Link>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando..." : cliente ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
