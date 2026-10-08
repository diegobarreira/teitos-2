"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmText = "¿Seguro que quieres eliminar este elemento?",
  label = "Eliminar",
}: {
  action: () => void | Promise<void>;
  confirmText?: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="btn-danger text-xs px-3 py-1"
      onClick={() => {
        if (!confirm(confirmText)) return;
        startTransition(async () => {
          await action();
        });
      }}
    >
      {pending ? "Eliminando..." : label}
    </button>
  );
}
