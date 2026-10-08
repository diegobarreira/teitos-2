"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useStore } from "@/lib/store";
import {
  euros,
  fecha,
  estadoPedidoLabel,
  estadoPedidoColor,
} from "@/lib/formatters";

export default function DashboardPage() {
  const { data, hydrated } = useStore();

  const metrics = useMemo(() => {
    const productosActivos = data.productos.filter((p) => p.activo);
    const clientesActivos = data.clientes.filter((c) => c.activo);
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ventasMes = data.pedidos
      .filter(
        (p) => p.estado !== "CANCELADO" && new Date(p.fecha) >= inicioMes
      )
      .reduce((s, p) => s + p.total, 0);
    const productosBajoStock = [...productosActivos]
      .filter((p) => p.stockActual <= p.stockMinimo)
      .sort((a, b) => a.stockActual - b.stockActual)
      .slice(0, 5);
    const ultimosPedidos = [...data.pedidos]
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
      .slice(0, 5)
      .map((p) => ({
        ...p,
        cliente: data.clientes.find((c) => c.id === p.clienteId),
      }));
    return {
      totalProductos: productosActivos.length,
      totalClientes: clientesActivos.length,
      pedidosCount: data.pedidos.length,
      ventasMes,
      productosBajoStock,
      ultimosPedidos,
    };
  }, [data]);

  return (
    <div>
      <PageHeader title="Resumen" description="Vista general del negocio" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Ventas del mes"
          value={hydrated ? euros(metrics.ventasMes) : "—"}
          icon="💶"
          accent="green"
        />
        <StatCard
          label="Pedidos totales"
          value={hydrated ? metrics.pedidosCount : "—"}
          icon="🧾"
          accent="blue"
        />
        <StatCard
          label="Productos activos"
          value={hydrated ? metrics.totalProductos : "—"}
          icon="🥚"
          accent="yema"
        />
        <StatCard
          label="Clientes (granjas)"
          value={hydrated ? metrics.totalClientes : "—"}
          icon="🚜"
          accent="yema"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-800">Stock bajo mínimo</h2>
            <Link
              href="/productos"
              className="text-xs text-yema-700 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          {!hydrated ? (
            <p className="text-sm text-zinc-400">Cargando…</p>
          ) : metrics.productosBajoStock.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Todos los productos tienen stock suficiente.
            </p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-right">Stock</th>
                  <th className="text-right">Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {metrics.productosBajoStock.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link
                        href={`/productos/${p.id}`}
                        className="text-yema-700 hover:underline"
                      >
                        {p.nombre}
                      </Link>
                      <div className="text-xs text-zinc-400">{p.codigo}</div>
                    </td>
                    <td className="text-right">
                      <span className="badge bg-red-100 text-red-700">
                        {p.stockActual}
                      </span>
                    </td>
                    <td className="text-right text-zinc-500">
                      {p.stockMinimo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-zinc-800">Últimos pedidos</h2>
            <Link
              href="/pedidos"
              className="text-xs text-yema-700 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          {!hydrated ? (
            <p className="text-sm text-zinc-400">Cargando…</p>
          ) : metrics.ultimosPedidos.length === 0 ? (
            <p className="text-sm text-zinc-500">No hay pedidos todavía.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {metrics.ultimosPedidos.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link
                        href={`/pedidos/${p.id}`}
                        className="text-yema-700 hover:underline"
                      >
                        {p.numero}
                      </Link>
                      <div className="text-xs text-zinc-400">
                        {fecha(p.fecha)}
                      </div>
                    </td>
                    <td className="text-zinc-700">
                      {p.cliente?.nombre ?? "—"}
                    </td>
                    <td>
                      <span className={`badge ${estadoPedidoColor[p.estado]}`}>
                        {estadoPedidoLabel[p.estado]}
                      </span>
                    </td>
                    <td className="text-right font-medium">
                      {euros(p.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
