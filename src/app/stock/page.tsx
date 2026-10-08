"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MovimientoStockForm } from "@/components/MovimientoStockForm";
import { useStore } from "@/lib/store";
import {
  fechaHora,
  tipoMovimientoLabel,
  motivoMovimientoLabel,
} from "@/lib/formatters";

const colorTipo: Record<string, string> = {
  ENTRADA: "bg-green-100 text-green-700",
  SALIDA: "bg-red-100 text-red-700",
  AJUSTE: "bg-amber-100 text-amber-700",
};

export default function StockPage() {
  const { data, hydrated } = useStore();

  const productos = useMemo(
    () =>
      data.productos
        .filter((p) => p.activo)
        .sort((a, b) => a.codigo.localeCompare(b.codigo))
        .map((p) => ({
          id: p.id,
          codigo: p.codigo,
          nombre: p.nombre,
          stockActual: p.stockActual,
        })),
    [data.productos]
  );

  const movimientos = useMemo(() => {
    return [...data.movimientos]
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
      .slice(0, 50)
      .map((m) => ({
        ...m,
        producto: data.productos.find((p) => p.id === m.productoId),
        pedido: m.pedidoId
          ? data.pedidos.find((p) => p.id === m.pedidoId)
          : null,
      }));
  }, [data.movimientos, data.productos, data.pedidos]);

  return (
    <div>
      <PageHeader
        title="Stock e inventario"
        description="Entradas, salidas y ajustes de stock"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <MovimientoStockForm productos={productos} />
        </div>

        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-200 bg-zinc-50">
              <h3 className="font-semibold text-zinc-800">
                Últimos 50 movimientos
              </h3>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th>Motivo</th>
                  <th className="text-right">Cantidad</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {!hydrated && (
                  <tr>
                    <td colSpan={6} className="text-center text-zinc-400 py-8">
                      Cargando…
                    </td>
                  </tr>
                )}
                {hydrated && movimientos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-zinc-500 py-8">
                      Sin movimientos registrados.
                    </td>
                  </tr>
                )}
                {hydrated &&
                  movimientos.map((m) => (
                    <tr key={m.id}>
                      <td className="text-xs text-zinc-500">
                        {fechaHora(m.fecha)}
                      </td>
                      <td>
                        <div className="text-sm font-medium">
                          {m.producto?.nombre ?? "—"}
                        </div>
                        <div className="text-xs text-zinc-400 font-mono">
                          {m.producto?.codigo ?? ""}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${colorTipo[m.tipo]}`}>
                          {tipoMovimientoLabel[m.tipo]}
                        </span>
                      </td>
                      <td className="text-sm text-zinc-600">
                        {motivoMovimientoLabel[m.motivo]}
                      </td>
                      <td className="text-right font-medium">{m.cantidad}</td>
                      <td className="text-xs text-zinc-500">
                        {m.pedido ? `Pedido ${m.pedido.numero}` : m.notas}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
