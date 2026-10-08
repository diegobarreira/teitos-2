"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { PedidoForm } from "@/components/PedidoForm";
import { useStore } from "@/lib/store";

export default function NuevoPedidoPage() {
  const { data, hydrated } = useStore();

  const clientes = useMemo(
    () =>
      data.clientes
        .filter((c) => c.activo)
        .sort((a, b) => a.nombre.localeCompare(b.nombre))
        .map((c) => ({ id: c.id, nombre: c.nombre, descuento: c.descuento })),
    [data.clientes]
  );

  const productos = useMemo(
    () =>
      data.productos
        .filter((p) => p.activo)
        .sort((a, b) => a.codigo.localeCompare(b.codigo))
        .map((p) => ({
          id: p.id,
          codigo: p.codigo,
          nombre: p.nombre,
          precioUnitario: p.precioUnitario,
          stockActual: p.stockActual,
        })),
    [data.productos]
  );

  return (
    <div>
      <PageHeader
        title="Nuevo pedido"
        description="Crea un pedido y se descontará automáticamente del stock"
      />
      {!hydrated ? (
        <div className="card p-6 text-zinc-400">Cargando…</div>
      ) : clientes.length === 0 || productos.length === 0 ? (
        <div className="card p-6 text-zinc-600">
          Necesitas al menos un cliente y un producto activo para crear un
          pedido.
        </div>
      ) : (
        <PedidoForm clientes={clientes} productos={productos} />
      )}
    </div>
  );
}
