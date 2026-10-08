"use client";

import { PageHeader } from "@/components/PageHeader";
import { ProductoForm } from "@/components/ProductoForm";

export default function NuevoProductoPage() {
  return (
    <div>
      <PageHeader
        title="Nuevo producto"
        description="Añade un nuevo tipo de huevo al catálogo"
      />
      <ProductoForm />
    </div>
  );
}
