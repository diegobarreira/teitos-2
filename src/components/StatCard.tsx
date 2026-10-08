import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: string;
  accent?: "yema" | "blue" | "green" | "red";
}) {
  const accentClass = {
    yema: "border-l-yema-500",
    blue: "border-l-blue-500",
    green: "border-l-green-500",
    red: "border-l-red-500",
  }[accent ?? "yema"];

  return (
    <div className={`card border-l-4 ${accentClass} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="text-2xl font-bold text-zinc-900 mt-1">{value}</p>
          {hint && <p className="text-xs text-zinc-400 mt-1">{hint}</p>}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}
