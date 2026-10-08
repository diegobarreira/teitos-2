"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { euros } from "@/lib/formatters";
import { makeCrearPedido, type PedidoFormState } from "@/lib/actions/pedidos";

export type ClienteOption = {
  id: number;
  nombre: string;
  descuento: number;
};

export type ProductoOption = {
  id: number;
  codigo: string;
  nombre: string;
  precioUnitario: number;
  stockActual: number;
};

type Linea = {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
};

export function PedidoForm({
  clientes,
  productos,
}: {
  clientes: ClienteOption[];
  productos: ProductoOption[];
}) {
  const router = useRouter();
  const { update } = useStore();

  const action = useMemo(
    () =>
      makeCrearPedido(update, (nuevoId) => {
        router.push(`/pedidos/${nuevoId}`);
        router.refresh();
      }),
    [update, router]
  );

  const [state, formAction, pending] = useActionState<PedidoFormState, FormData>(
    action,
    {}
  );

  const [clienteId, setClienteId] = useState<number>(clientes[0]?.id ?? 0);
  const cliente = clientes.find((c) => c.id === clienteId);
  const [descuento, setDescuento] = useState<number>(cliente?.descuento ?? 0);
  const [iva, setIva] = useState<number>(10);
  const [lineas, setLineas] = useState<Linea[]>([]);

  const subtotal = useMemo(
    () => lineas.reduce((s, l) => s + l.cantidad * l.precioUnitario, 0),
    [lineas]
  );
  const descuentoEur = subtotal * (descuento / 100);
  const baseIva = subtotal - descuentoEur;
  const ivaEur = baseIva * (iva / 100);
  const total = baseIva + ivaEur;

  function actualizarLinea(idx: number, campo: keyof Linea, valor: number) {
    setLineas((prev) => {
      const next = [...prev];
      const linea = { ...next[idx], [campo]: valor };
      if (campo === "productoId") {
        const prod = productos.find((p) => p.id === valor);
        if (prod) linea.precioUnitario = prod.precioUnitario;
      }
      next[idx] = linea;
      return next;
    });
  }

  function añadirLinea() {
    const primero = productos[0];
    if (!primero) return;
    setLineas((prev) => [
      ...prev,
      {
        productoId: primero.id,
        cantidad: 1,
        precioUnitario: primero.precioUnitario,
      },
    ]);
  }

  function eliminarLinea(idx: number) {
    setLineas((prev) => prev.filter((_, i) => i !== idx));
  }

  const err = (field: string) => state.errors?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-6">
      <div className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Cliente *</label>
            <select
              name="clienteId"
              value={clienteId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setClienteId(id);
                const c = clientes.find((cl) => cl.id === id);
                if (c) setDescuento(c.descuento);
              }}
              className="input"
              required
            >
              {clientes.length === 0 && (
                <option value="0">— No hay clientes —</option>
              )}
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
            {err("clienteId") && (
              <p className="text-xs text-red-600 mt-1">{err("clienteId")}</p>
            )}
          </div>
          <div>
            <label className="label">Fecha de entrega</label>
            <input name="fechaEntrega" type="date" className="input" />
          </div>
        </div>

        <div>
          <label className="label">Notas</label>
          <textarea name="notas" rows={2} className="input" />
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-800">Líneas del pedido</h3>
          <button
            type="button"
            onClick={añadirLinea}
            className="btn-secondary text-sm"
          >
            + Añadir línea
          </button>
        </div>

        {lineas.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4 text-center">
            Añade al menos una línea con un producto.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-right">Cantidad</th>
                <th className="text-right">Precio</th>
                <th className="text-right">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((linea, idx) => {
                const prod = productos.find((p) => p.id === linea.productoId);
                const sub = linea.cantidad * linea.precioUnitario;
                return (
                  <tr key={idx}>
                    <td>
                      <select
                        name="linea_productoId"
                        value={linea.productoId}
                        onChange={(e) =>
                          actualizarLinea(
                            idx,
                            "productoId",
                            Number(e.target.value)
                          )
                        }
                        className="input"
                      >
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.codigo} — {p.nombre}
                          </option>
                        ))}
                      </select>
                      {prod && (
                        <div className="text-xs text-zinc-400 mt-1">
                          Stock disponible: {prod.stockActual}
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      <input
                        name="linea_cantidad"
                        type="number"
                        min="1"
                        value={linea.cantidad}
                        onChange={(e) =>
                          actualizarLinea(
                            idx,
                            "cantidad",
                            Number(e.target.value)
                          )
                        }
                        className="input text-right w-24"
                      />
                    </td>
                    <td className="text-right">
                      <input
                        name="linea_precioUnitario"
                        type="number"
                        step="0.01"
                        min="0"
                        value={linea.precioUnitario}
                        onChange={(e) =>
                          actualizarLinea(
                            idx,
                            "precioUnitario",
                            Number(e.target.value)
                          )
                        }
                        className="input text-right w-28"
                      />
                    </td>
                    <td className="text-right font-medium">{euros(sub)}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => eliminarLinea(idx)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {err("lineas") && (
          <p className="text-xs text-red-600 mt-2">{err("lineas")}</p>
        )}
      </div>

      <div className="card p-6 max-w-md ml-auto">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Descuento %</label>
            <input
              name="descuento"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={descuento}
              onChange={(e) => setDescuento(Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="label">IVA %</label>
            <input
              name="iva"
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={iva}
              onChange={(e) => setIva(Number(e.target.value))}
              className="input"
            />
          </div>
        </div>

        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-600">Subtotal</dt>
            <dd className="font-medium">{euros(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-600">Descuento</dt>
            <dd className="font-medium text-red-600">
              -{euros(descuentoEur)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-600">IVA</dt>
            <dd className="font-medium">{euros(ivaEur)}</dd>
          </div>
          <div className="flex justify-between pt-2 border-t border-zinc-200">
            <dt className="text-zinc-900 font-semibold">Total</dt>
            <dd className="font-bold text-lg">{euros(total)}</dd>
          </div>
        </dl>
      </div>

      {state.message && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Link href="/pedidos" className="btn-secondary">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending || lineas.length === 0}
          className="btn-primary"
        >
          {pending ? "Creando..." : "Crear pedido"}
        </button>
      </div>
    </form>
  );
}
