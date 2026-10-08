"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Resumen", icon: "📊" },
  { href: "/productos", label: "Productos", icon: "🥚" },
  { href: "/clientes", label: "Clientes", icon: "🚜" },
  { href: "/pedidos", label: "Pedidos", icon: "🧾" },
  { href: "/stock", label: "Stock", icon: "📦" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <aside className="no-print w-60 shrink-0 border-r border-zinc-200 bg-white min-h-screen">
      <div className="p-6 border-b border-zinc-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🥚</span>
          <span className="font-bold text-lg text-zinc-800">Venta Huevos</span>
        </Link>
      </div>
      <nav className="p-3 space-y-1">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-yema-100 text-yema-800"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
