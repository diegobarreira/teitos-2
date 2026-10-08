"use client";

import { PageHeader } from "@/components/PageHeader";
import { ClienteForm } from "@/components/ClienteForm";

export default function NuevoClientePage() {
  return (
    <div>
      <PageHeader
        title="Nuevo cliente"
        description="Registra una nueva granja"
      />
      <ClienteForm />
    </div>
  );
}
