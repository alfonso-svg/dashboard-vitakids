"use client"

import {
  REPOSICION, REPOSICION_TITULAR, REPOSICION_BAJADA,
  REPOSICION_DESTACADO, REPOSICION_DESTACADO_DETALLE, REPOSICION_METODO,
} from "@/lib/data/reposicion"

export function Reposicion() {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-gray-900">{REPOSICION_TITULAR}</h3>
        <p className="text-xs text-gray-500 mt-0.5">Comparativa de cinco días contra cinco días, misma inversión.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-sm min-w-[460px] border-collapse">
          <thead>
            <tr className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-gray-50/80">
              <th className="text-left  px-3 py-2.5">Métrica</th>
              <th className="text-right px-3 py-2.5 whitespace-nowrap">2–6 nov</th>
              <th className="text-right px-3 py-2.5 whitespace-nowrap">7–11 nov</th>
              <th className="text-right px-3 py-2.5">Var.</th>
            </tr>
          </thead>
          <tbody>
            {REPOSICION.map(row => (
              <tr key={row.metrica} className={row.alerta ? "bg-red-50" : "border-b border-gray-50"}>
                <td className={`px-3 py-2.5 whitespace-nowrap ${row.alerta ? "font-bold text-red-700" : "font-medium text-gray-700"}`}>
                  {row.metrica}
                </td>
                <td className={`px-3 py-2.5 text-right tabular-nums ${row.alerta ? "text-red-700" : "text-gray-500"}`}>
                  {row.antes}
                </td>
                <td className={`px-3 py-2.5 text-right tabular-nums ${row.alerta ? "font-bold text-red-700" : "font-medium text-gray-700"}`}>
                  {row.despues}
                </td>
                <td className={`px-3 py-2.5 text-right tabular-nums ${row.alerta ? "font-bold text-red-700" : "text-gray-500"}`}>
                  {row.var}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{REPOSICION_BAJADA}</p>

      <div className="rounded-md bg-red-50 px-3 py-2.5">
        <p className="text-sm leading-relaxed text-gray-700">
          <span className="font-bold text-red-700">{REPOSICION_DESTACADO}</span>{" "}
          {REPOSICION_DESTACADO_DETALLE}
        </p>
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed">{REPOSICION_METODO}</p>
    </div>
  )
}
