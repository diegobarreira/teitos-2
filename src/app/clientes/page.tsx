"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";

export default function ClientesPage() {
  const { data, hydrated } = useStore();

  const clientes = useMemo(() => {
    return [...data.clientes]
      .sort((a, b) => {
        if (a.activo !== b.activo) return a.activo ? -1 : 1;
        return a.nombre.localeCompare(b.nombre);
      })
      .map((c) => ({
        ...c,
        pedidosCount: data.pedidos.filter((p) => p.clienteId === c.id).length,
      }));
  }, [data.clientes, data.pedidos]);

  return (
    <div>
      <PageHeader
        title="Clientes (Granjas)"
        description="Granjas compradoras"
        actions={
          <Link href="/clientes/nuevo" className="btn-primary">
            + Nuevo cliente
          </Link>
        }
      />

      <div className="card overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>CIF</th>
              <th>Ciudad</th>
              <th>Provincia</th>
              <th>Contacto</th>
              <th className="text-right">Dto.</th>
              <th className="text-right">Pedidos</th>
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
            {hydrated && clientes.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-zinc-500 py-8">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
            {hydrated &&
              clientes.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link
                      href={`/clientes/${c.id}`}
                      className="text-yema-700 hover:underline font-medium"
                    >
                      {c.nombre}
                    </Link>
                  </td>
                  <td className="font-mono text-xs">{c.cif}</td>
                  <td>{c.ciudad}</td>
                  <td className="text-zinc-600">{c.provincia}</td>
                  <td className="text-sm">
                    {c.personaContacto && (
                      <div className="text-zinc-700">{c.personaContacto}</div>
                    )}
                    {c.telefono && (
                      <div className="text-xs text-zinc-500">{c.telefono}</div>
                    )}
                  </td>
                  <td className="text-right">{c.descuento}%</td>
                  <td className="text-right">{c.pedidosCount}</td>
                  <td>
                    {c.activo ? (
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
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
