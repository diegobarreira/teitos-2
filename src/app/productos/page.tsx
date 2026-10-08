"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import { euros, tipoHuevoLabel, formatoLabel } from "@/lib/formatters";

export default function ProductosPage() {
  const { data, hydrated } = useStore();

  const productos = useMemo(() => {
    return [...data.productos].sort((a, b) => {
      if (a.activo !== b.activo) return a.activo ? -1 : 1;
      return a.codigo.localeCompare(b.codigo);
    });
  }, [data.productos]);

  return (
    <div>
      <PageHeader
        title="Productos"
        description="Catálogo de huevos en venta"
        actions={
          <Link href="/productos/nuevo" className="btn-primary">
            + Nuevo producto
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Tamaño</th>
              <th>Formato</th>
              <th className="text-right">Precio</th>
              <th className="text-right">Stock</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {!hydrated && (
              <tr>
                <td colSpan={8} className="text-center text-zinc-400 py-8">
                  Cargando…
                </td>
              </tr>
            )}
            {hydrated && productos.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-zinc-500 py-8">
                  No hay productos. Crea el primero.
                </td>
              </tr>
            )}
            {hydrated &&
              productos.map((p) => {
                const bajoStock = p.stockActual <= p.stockMinimo;
                return (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.codigo}</td>
                    <td>
                      <Link
                        href={`/productos/${p.id}`}
                        className="text-yema-700 hover:underline font-medium"
                      >
                        {p.nombre}
                      </Link>
                    </td>
                    <td>{tipoHuevoLabel[p.tipo]}</td>
                    <td>{p.tamano}</td>
                    <td className="text-sm text-zinc-600">
                      {formatoLabel[p.formato]}
                    </td>
                    <td className="text-right font-medium">
                      {euros(p.precioUnitario)}
                    </td>
                    <td className="text-right">
                      <span
                        className={`badge ${
                          bajoStock
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {p.stockActual}
                      </span>
                    </td>
                    <td>
                      {p.activo ? (
                        <span className="badge bg-green-100 text-green-700">
                          Activo
                        </span>
                      ) : (
                        <span className="badge bg-zinc-100 text-zinc-600">
                          Inactivo
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
