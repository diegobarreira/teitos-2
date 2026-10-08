"use client";

import { use, useMemo } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ClienteForm } from "@/components/ClienteForm";
import { DeleteButton } from "@/components/DeleteButton";
import { useStore } from "@/lib/store";
import { eliminarCliente } from "@/lib/actions/clientes";
import {
  euros,
  fecha,
  estadoPedidoLabel,
  estadoPedidoColor,
} from "@/lib/formatters";

export default function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const clienteId = Number(id);
  const router = useRouter();
  const { data, hydrated, update } = useStore();

  if (isNaN(clienteId)) notFound();

  const cliente = useMemo(
    () => data.clientes.find((c) => c.id === clienteId),
    [data.clientes, clienteId]
  );

  const pedidos = useMemo(
    () =>
      [...data.pedidos]
        .filter((p) => p.clienteId === clienteId)
        .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
        .slice(0, 10),
    [data.pedidos, clienteId]
  );

  if (!hydrated) {
    return <p className="text-sm text-zinc-400">Cargando…</p>;
  }

  if (!cliente) notFound();

  return (
    <div>
      <PageHeader
        title={cliente.nombre}
        description={`CIF: ${cliente.cif}`}
        actions={
          <DeleteButton
            action={() => {
              eliminarCliente(update, cliente.id);
              router.push("/clientes");
            }}
            confirmText="¿Desactivar este cliente?"
            label="Desactivar"
          />
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClienteForm cliente={cliente} />
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-zinc-800 mb-3">
            Últimos pedidos
          </h3>
          {pedidos.length === 0 ? (
            <p className="text-sm text-zinc-500">Sin pedidos todavía.</p>
          ) : (
            <ul className="space-y-3">
              {pedidos.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start justify-between border-b border-zinc-100 last:border-0 pb-2"
                >
                  <div>
                    <Link
                      href={`/pedidos/${p.id}`}
                      className="text-yema-700 hover:underline text-sm font-medium"
                    >
                      {p.numero}
                    </Link>
                    <div className="text-xs text-zinc-500">
                      {fecha(p.fecha)}
                    </div>
                    <span
                      className={`badge mt-1 ${estadoPedidoColor[p.estado]}`}
                    >
                      {estadoPedidoLabel[p.estado]}
                    </span>
                  </div>
                  <div className="text-sm font-medium">{euros(p.total)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
