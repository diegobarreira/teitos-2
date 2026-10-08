"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import {
  euros,
  fecha,
  estadoPedidoLabel,
  estadoPedidoColor,
} from "@/lib/formatters";

export default function PedidosPage() {
  const { data, hydrated } = useStore();

  const pedidos = useMemo(() => {
    return [...data.pedidos]
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
      .map((p) => ({
        ...p,
        cliente: data.clientes.find((c) => c.id === p.clienteId),
        lineasCount: data.lineas.filter((l) => l.pedidoId === p.id).length,
      }));
  }, [data.pedidos, data.clientes, data.lineas]);

  return (
    <div>
      <PageHeader
        title="Pedidos"
        description="Pedidos a clientes y facturación"
        actions={
          <Link href="/pedidos/nuevo" className="btn-primary">
            + Nuevo pedido
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Entrega</th>
              <th>Estado</th>
              <th className="text-right">Líneas</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {!hydrated && (
              <tr>
                <td colSpan={7} className="text-center text-zinc-400 py-8">
                  Cargando…
                </td>
              </tr>
            )}
            {hydrated && pedidos.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-zinc-500 py-8">
                  Aún no hay pedidos.
                </td>
              </tr>
            )}
            {hydrated &&
              pedidos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link
                      href={`/pedidos/${p.id}`}
                      className="text-yema-700 hover:underline font-medium"
                    >
                      {p.numero}
                    </Link>
                  </td>
                  <td className="text-sm text-zinc-600">{fecha(p.fecha)}</td>
                  <td>{p.cliente?.nombre ?? "—"}</td>
                  <td className="text-sm text-zinc-600">
                    {fecha(p.fechaEntrega)}
                  </td>
                  <td>
                    <span className={`badge ${estadoPedidoColor[p.estado]}`}>
                      {estadoPedidoLabel[p.estado]}
                    </span>
                  </td>
                  <td className="text-right">{p.lineasCount}</td>
                  <td className="text-right font-medium">{euros(p.total)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
