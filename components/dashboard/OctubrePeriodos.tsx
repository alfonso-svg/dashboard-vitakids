"use client"

import type { DailyInsight } from "@/lib/meta/types"
import { enRango, resumir, sumar, type Resumen } from "@/lib/data/funnelMetrics"

type Periodo = { label: string; from: string; to: string; contexto: string }

type OctubrePeriodosProps = {
  data: DailyInsight[]
  periodos: readonly Periodo[]
}

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n)

type Fila = { metrica: string; valor: (r: Resumen, dias: number) => string }

const FILAS: Fila[] = [
  { metrica: "Inversión diaria promedio", valor: (r, dias) => (dias > 0 ? fmtUSD(r.spend / dias) : "—") },
  { metrica: "Compras",                   valor: r => r.purchases.toLocaleString("en-US") },
  { metrica: "Compras por día",           valor: (r, dias) => (dias > 0 ? (r.purchases / dias).toFixed(1) : "—") },
  { metrica: "CPA",                       valor: r => (r.cpa !== null ? fmtUSD(r.cpa) : "—") },
  { metrica: "ROAS",                      valor: r => (r.roas !== null ? `${r.roas.toFixed(2)}x` : "—") },
  { metrica: "Visita a carrito",          valor: r => (r.visitaCarrito !== null ? `${r.visitaCarrito.toFixed(1)}%` : "—") },
  { metrica: "Checkout a compra",         valor: r => (r.checkoutCompra !== null ? `${r.checkoutCompra.toFixed(1)}%` : "—") },
]

export function OctubrePeriodos({ data, periodos }: OctubrePeriodosProps) {
  const columnas = periodos.map(p => {
    const dias = enRango(data, p.from, p.to)
    return { ...p, dias: dias.length, resumen: resumir(sumar(dias)) }
  })

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-gray-50/80">
            <th className="text-left px-3 py-2.5 w-[180px]">Métrica</th>
            {columnas.map(c => (
              <th key={c.label} className="text-right px-3 py-2.5">
                {c.label}
                <span className="block font-normal normal-case text-gray-400">{c.dias} días</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-100 bg-amber-50/40">
            <td className="px-3 py-2.5 text-[11px] font-semibold text-gray-600">Contexto</td>
            {columnas.map(c => (
              <td key={c.label} className="px-3 py-2.5 text-right text-[11px] text-amber-800 leading-snug">
                {c.contexto}
              </td>
            ))}
          </tr>
          {FILAS.map(f => (
            <tr key={f.metrica} className="border-b border-gray-50 hover:bg-gray-50/60">
              <td className="px-3 py-2.5 font-medium text-gray-700">{f.metrica}</td>
              {columnas.map(c => (
                <td key={c.label} className="px-3 py-2.5 text-right tabular-nums text-gray-800">
                  {f.valor(c.resumen, c.dias)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
