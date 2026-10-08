"use client";

import { useTransition } from "react";
import { useStore } from "@/lib/store";
import { cambiarEstadoPedido } from "@/lib/actions/pedidos";
import { estadoPedidoLabel } from "@/lib/formatters";
import type { EstadoPedido } from "@/lib/types";

const estados: EstadoPedido[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

export function EstadoPedidoSelect({
  pedidoId,
  estadoActual,
}: {
  pedidoId: number;
  estadoActual: EstadoPedido;
}) {
  const { update } = useStore();
  const [pending, startTransition] = useTransition();

  return (
    <select
      disabled={pending}
      value={estadoActual}
      onChange={(e) => {
        const nuevo = e.target.value as EstadoPedido;
        startTransition(() => {
          cambiarEstadoPedido(update, pedidoId, nuevo);
        });
      }}
      className="input text-sm py-1 w-40"
    >
      {estados.map((e) => (
        <option key={e} value={e}>
          {estadoPedidoLabel[e]}
        </option>
      ))}
    </select>
  );
}
