"use client";

import { use, useMemo } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { EstadoPedidoSelect } from "@/components/EstadoPedidoSelect";
import { PrintButton } from "@/components/PrintButton";
import { DeleteButton } from "@/components/DeleteButton";
import { useStore } from "@/lib/store";
import { eliminarPedido } from "@/lib/actions/pedidos";
import {
  euros,
  fecha,
  estadoPedidoLabel,
  estadoPedidoColor,
  tipoHuevoLabel,
  formatoLabel,
} from "@/lib/formatters";

export default function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pedidoId = Number(id);
  const router = useRouter();
  const { data, hydrated, update } = useStore();

  if (isNaN(pedidoId)) notFound();

  const pedido = useMemo(
    () => data.pedidos.find((p) => p.id === pedidoId),
    [data.pedidos, pedidoId]
  );
  const cliente = useMemo(
    () =>
      pedido ? data.clientes.find((c) => c.id === pedido.clienteId) : undefined,
    [data.clientes, pedido]
  );
  const lineas = useMemo(
    () =>
      data.lineas
        .filter((l) => l.pedidoId === pedidoId)
        .map((l) => ({
          ...l,
          producto: data.productos.find((p) => p.id === l.productoId),
        })),
    [data.lineas, data.productos, pedidoId]
  );

  if (!hydrated) {
    return <p className="text-sm text-zinc-400">Cargando…</p>;
  }
  if (!pedido) notFound();

  return (
    <div>
      <div className="no-print">
        <PageHeader
          title={`Pedido ${pedido.numero}`}
          description={`Creado el ${fecha(pedido.fecha)}`}
          actions={
            <>
              <EstadoPedidoSelect
                pedidoId={pedido.id}
                estadoActual={pedido.estado}
              />
              <PrintButton />
              <DeleteButton
                action={() => {
                  eliminarPedido(update, pedido.id);
                  router.push("/pedidos");
                }}
                confirmText="¿Eliminar este pedido? Si no está cancelado, el stock se devolverá."
                label="Eliminar"
              />
              <Link href="/pedidos" className="btn-secondary">
                Volver
              </Link>
            </>
          }
        />
      </div>

      <article className="card p-8 max-w-4xl mx-auto bg-white">
        <header className="flex items-start justify-between mb-8 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">🥚 Albarán</h1>
            <p className="text-sm text-zinc-500 mt-1">Nº {pedido.numero}</p>
          </div>
          <div className="text-right text-sm">
            <p>
              <span className="text-zinc-500">Fecha:</span>{" "}
              <span className="font-medium">{fecha(pedido.fecha)}</span>
            </p>
            {pedido.fechaEntrega && (
              <p>
                <span className="text-zinc-500">Entrega:</span>{" "}
                <span className="font-medium">
                  {fecha(pedido.fechaEntrega)}
                </span>
              </p>
            )}
            <p className="mt-2">
              <span className={`badge ${estadoPedidoColor[pedido.estado]}`}>
                {estadoPedidoLabel[pedido.estado]}
              </span>
            </p>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xs uppercase font-semibold text-zinc-500 mb-2">
              Cliente
            </h2>
            <p className="font-semibold text-zinc-900">
              {cliente?.nombre ?? "—"}
            </p>
            {cliente && (
              <>
                <p className="text-sm text-zinc-600">CIF: {cliente.cif}</p>
                <p className="text-sm text-zinc-600">{cliente.direccion}</p>
                <p className="text-sm text-zinc-600">
                  {cliente.codigoPostal} {cliente.ciudad}, {cliente.provincia}
                </p>
                {cliente.telefono && (
                  <p className="text-sm text-zinc-600 mt-1">
                    Tel: {cliente.telefono}
                  </p>
                )}
              </>
            )}
          </div>
          {pedido.notas && (
            <div>
              <h2 className="text-xs uppercase font-semibold text-zinc-500 mb-2">
                Notas
              </h2>
              <p className="text-sm text-zinc-700 whitespace-pre-line">
                {pedido.notas}
              </p>
            </div>
          )}
        </section>

        <table className="table mb-6">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Formato</th>
              <th className="text-right">Cant.</th>
              <th className="text-right">Precio</th>
              <th className="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {lineas.map((l) => (
              <tr key={l.id}>
                <td>
                  <div className="font-medium">{l.producto?.nombre ?? "—"}</div>
                  <div className="text-xs text-zinc-400 font-mono">
                    {l.producto?.codigo ?? ""}
                  </div>
                </td>
                <td>
                  {l.producto
                    ? `${tipoHuevoLabel[l.producto.tipo]} · ${l.producto.tamano}`
                    : "—"}
                </td>
                <td className="text-sm text-zinc-600">
                  {l.producto ? formatoLabel[l.producto.formato] : "—"}
                </td>
                <td className="text-right">{l.cantidad}</td>
                <td className="text-right">{euros(l.precioUnitario)}</td>
                <td className="text-right font-medium">{euros(l.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <dl className="w-72 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-600">Subtotal</dt>
              <dd className="font-medium">{euros(pedido.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-600">Descuento</dt>
              <dd className="font-medium text-red-600">
                -{euros(pedido.descuento)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-600">IVA</dt>
              <dd className="font-medium">{euros(pedido.iva)}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-zinc-300">
              <dt className="font-bold text-base">Total</dt>
              <dd className="font-bold text-base">{euros(pedido.total)}</dd>
            </div>
          </dl>
        </div>
      </article>
    </div>
  );
}
