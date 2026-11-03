"use client"

import { useState } from "react"
import type { MonthlyAccountTotal } from "@/lib/data/csvParser"
import { resumir, type Resumen } from "@/lib/data/funnelMetrics"

type ComparativoMensualProps = {
  meses: MonthlyAccountTotal[]
}

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n)

type Metrica = {
  label: string
  valor: (r: Resumen) => number | null
  formato: (n: number) => string
  // true cuando un valor más bajo es mejor (costos)
  mejorSiBaja?: boolean
}

const METRICAS: Metrica[] = [
  { label: "Inversión",         valor: r => r.spend,             formato: fmtUSD },
  { label: "Compras",           valor: r => r.purchases,         formato: n => n.toLocaleString("en-US") },
  { label: "CPA",               valor: r => r.cpa,               formato: fmtUSD, mejorSiBaja: true },
  { label: "Valor de compras",  valor: r => r.valorConversiones, formato: fmtUSD },
  { label: "ROAS",              valor: r => r.roas,              formato: n => `${n.toFixed(2)}x` },
  { label: "Ticket promedio",   valor: r => r.ticket,            formato: fmtUSD },
  { label: "Visita a carrito",  valor: r => r.visitaCarrito,     formato: n => `${n.toFixed(1)}%` },
  { label: "Checkout a compra", valor: r => r.checkoutCompra,    formato: n => `${n.toFixed(1)}%` },
  { label: "CPC",               valor: r => r.cpc,               formato: fmtUSD, mejorSiBaja: true },
  { label: "CPM",               valor: r => r.cpm,               formato: fmtUSD, mejorSiBaja: true },
]

function aResumen(m: MonthlyAccountTotal): Resumen {
  return resumir({
    spend: m.spend,
    impressions: m.impressions,
    clicks: m.clicks,
    visitas: m.visitas,
    carritos: m.carritos,
    pagos: m.pagos,
    purchases: m.purchases,
    valorConversiones: m.valorConversiones,
  })
}

function Variacion({ actual, base, mejorSiBaja }: { actual: number | null; base: number | null; mejorSiBaja?: boolean }) {
  if (actual === null || base === null || base === 0) return <span className="text-[11px] text-gray-400">—</span>
  const pct = ((actual - base) / base) * 100
  const bueno = mejorSiBaja ? pct <= 0 : pct >= 0
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-1.5 py-0.5 rounded"
      style={{ color: bueno ? "#166534" : "#991b1b", backgroundColor: bueno ? "#dcfce7" : "#fee2e2" }}
    >
      {pct >= 0 ? "↑" : "↓"} {Math.abs(pct).toFixed(1)}%
    </span>
  )
}

function SelectorMes({ value, onChange, meses, etiqueta }: {
  value: string
  onChange: (mes: string) => void
  meses: MonthlyAccountTotal[]
  etiqueta: string
}) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      {etiqueta}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-7 rounded-md border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700"
      >
        {meses.map(m => (
          <option key={m.mes} value={m.mes}>{m.label}</option>
        ))}
      </select>
    </label>
  )
}

export function ComparativoMensual({ meses }: ComparativoMensualProps) {
  const ultimo = meses.at(-1)?.mes ?? ""
  const penultimo = meses.at(-2)?.mes ?? ultimo
  const [mesBase, setMesBase] = useState(penultimo)
  const [mesActual, setMesActual] = useState(ultimo)

  const base = meses.find(m => m.mes === mesBase)
  const actual = meses.find(m => m.mes === mesActual)
  if (!base || !actual) {
    return <p className="text-xs text-muted-foreground py-4">Sin meses para comparar.</p>
  }
  const rBase = aResumen(base)
  const rActual = aResumen(actual)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <SelectorMes etiqueta="Comparar" value={mesActual} onChange={setMesActual} meses={meses} />
        <SelectorMes etiqueta="contra" value={mesBase} onChange={setMesBase} meses={meses} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {METRICAS.map(m => {
          const vA = m.valor(rActual)
          const vB = m.valor(rBase)
          return (
            <div key={m.label} className="rounded-lg border border-gray-100 bg-white px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{m.label}</p>
              <p className="text-lg font-bold mt-0.5 tabular-nums">{vA !== null ? m.formato(vA) : "—"}</p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {base.label}: {vB !== null ? m.formato(vB) : "—"}
                </span>
                <Variacion actual={vA} base={vB} mejorSiBaja={m.mejorSiBaja} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
