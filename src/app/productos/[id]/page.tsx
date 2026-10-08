"use client";

import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ProductoForm } from "@/components/ProductoForm";
import { DeleteButton } from "@/components/DeleteButton";
import { useStore } from "@/lib/store";
import { eliminarProducto } from "@/lib/actions/productos";

export default function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productoId = Number(id);
  const router = useRouter();
  const { data, hydrated, update } = useStore();

  if (isNaN(productoId)) notFound();

  if (!hydrated) {
    return <p className="text-sm text-zinc-400">Cargando…</p>;
  }

  const producto = data.productos.find((p) => p.id === productoId);
  if (!producto) notFound();

  return (
    <div>
      <PageHeader
        title={producto.nombre}
        description={`Código: ${producto.codigo}`}
        actions={
          <DeleteButton
            action={() => {
              eliminarProducto(update, producto.id);
              router.push("/productos");
            }}
            confirmText="¿Desactivar este producto?"
            label="Desactivar"
          />
        }
      />
      <ProductoForm producto={producto} />
    </div>
  );
}
