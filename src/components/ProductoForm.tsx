"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import {
  makeActualizarProducto,
  makeCrearProducto,
  type ProductoFormState,
} from "@/lib/actions/productos";
import type { Producto } from "@/lib/types";

export function ProductoForm({ producto }: { producto?: Producto }) {
  const router = useRouter();
  const { update } = useStore();

  const action = useMemo(() => {
    const onSuccess = () => {
      router.push("/productos");
      router.refresh();
    };
    return producto
      ? makeActualizarProducto(producto.id, update, onSuccess)
      : makeCrearProducto(update, onSuccess);
  }, [producto, update, router]);

  const [state, formAction, pending] = useActionState<ProductoFormState, FormData>(
    action,
    {}
  );

  const err = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="card p-6 max-w-2xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Código *</label>
          <input
            name="codigo"
            defaultValue={producto?.codigo}
            className="input"
            required
          />
          {err("codigo") && (
            <p className="text-xs text-red-600 mt-1">{err("codigo")}</p>
          )}
        </div>
        <div>
          <label className="label">Nombre *</label>
          <input
            name="nombre"
            defaultValue={producto?.nombre}
            className="input"
            required
          />
          {err("nombre") && (
            <p className="text-xs text-red-600 mt-1">{err("nombre")}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Tipo *</label>
          <select
            name="tipo"
            defaultValue={producto?.tipo ?? "BLANCO"}
            className="input"
          >
            <option value="BLANCO">Blanco</option>
            <option value="MORENO">Moreno</option>
            <option value="CAMPERO">Campero</option>
            <option value="ECOLOGICO">Ecológico</option>
          </select>
        </div>
        <div>
          <label className="label">Tamaño *</label>
          <select
            name="tamano"
            defaultValue={producto?.tamano ?? "M"}
            className="input"
          >
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>
        <div>
          <label className="label">Formato *</label>
          <select
            name="formato"
            defaultValue={producto?.formato ?? "DOCENA"}
            className="input"
          >
            <option value="DOCENA">Docena (12u)</option>
            <option value="CARTON_30">Cartón (30u)</option>
            <option value="CAJA_180">Caja (180u)</option>
            <option value="CAJA_360">Caja (360u)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Precio (€) *</label>
          <input
            name="precioUnitario"
            type="number"
            step="0.01"
            min="0"
            defaultValue={producto?.precioUnitario ?? 0}
            className="input"
            required
          />
          {err("precioUnitario") && (
            <p className="text-xs text-red-600 mt-1">
              {err("precioUnitario")}
            </p>
          )}
        </div>
        <div>
          <label className="label">Stock actual</label>
          <input
            name="stockActual"
            type="number"
            min="0"
            defaultValue={producto?.stockActual ?? 0}
            className="input"
          />
        </div>
        <div>
          <label className="label">Stock mínimo</label>
          <input
            name="stockMinimo"
            type="number"
            min="0"
            defaultValue={producto?.stockMinimo ?? 0}
            className="input"
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="activo"
          defaultChecked={producto?.activo ?? true}
        />
        <span className="text-sm text-zinc-700">Producto activo</span>
      </label>

      {state.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-4 border-t border-zinc-100">
        <Link href="/productos" className="btn-secondary">
          Cancelar
        </Link>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando..." : producto ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
