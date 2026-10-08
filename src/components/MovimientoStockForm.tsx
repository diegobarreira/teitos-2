"use client";

import { useActionState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { makeRegistrarMovimiento } from "@/lib/actions/stock";

export type ProductoBasico = {
  id: number;
  codigo: string;
  nombre: string;
  stockActual: number;
};

export function MovimientoStockForm({
  productos,
}: {
  productos: ProductoBasico[];
}) {
  const { update } = useStore();
  const action = useMemo(() => makeRegistrarMovimiento(update), [update]);
  const [state, formAction, pending] = useActionState(action, {});
  const err = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="card p-6 space-y-4">
      <h3 className="font-semibold text-zinc-800">Registrar movimiento</h3>

      <div>
        <label className="label">Producto *</label>
        <select name="productoId" className="input" required>
          {productos.length === 0 && (
            <option value="0">— No hay productos —</option>
          )}
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.codigo} — {p.nombre} (stock: {p.stockActual})
            </option>
          ))}
        </select>
        {err("productoId") && (
          <p className="text-xs text-red-600 mt-1">{err("productoId")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Tipo *</label>
          <select name="tipo" className="input" defaultValue="ENTRADA">
            <option value="ENTRADA">Entrada</option>
            <option value="SALIDA">Salida</option>
            <option value="AJUSTE">Ajuste (fija stock)</option>
          </select>
        </div>
        <div>
          <label className="label">Motivo *</label>
          <select name="motivo" className="input" defaultValue="PRODUCCION">
            <option value="PRODUCCION">Producción</option>
            <option value="COMPRA">Compra</option>
            <option value="VENTA">Venta</option>
            <option value="MERMA">Merma</option>
            <option value="AJUSTE_INVENTARIO">Ajuste inventario</option>
            <option value="DEVOLUCION">Devolución</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Cantidad *</label>
        <input
          name="cantidad"
          type="number"
          min="1"
          className="input"
          required
        />
        {err("cantidad") && (
          <p className="text-xs text-red-600 mt-1">{err("cantidad")}</p>
        )}
      </div>

      <div>
        <label className="label">Notas</label>
        <textarea name="notas" rows={2} className="input" />
      </div>

      {state.message && (
        <p
          className={`text-sm rounded-md p-3 ${
            state.errors
              ? "text-red-600 bg-red-50 border border-red-200"
              : "text-green-700 bg-green-50 border border-green-200"
          }`}
        >
          {state.message}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Registrando..." : "Registrar movimiento"}
      </button>
    </form>
  );
}
