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
  { label: "Visitas",           valor: r => r.visitas,           formato: n => n.toLocaleString("en-US") },
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

const VERDE = { texto: "#166534", fondo: "#dcfce7", barra: "#22c55e" }
const ROJO  = { texto: "#991b1b", fondo: "#fee2e2", barra: "#ef4444" }

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

// Badge + barra divergente: la barra crece hacia la derecha si sube y hacia la izquierda si baja,
// con color según si el cambio es bueno o malo para esa métrica. Tope visual en ±100%.
function Variacion({ actual, base, mejorSiBaja }: { actual: number | null; base: number | null; mejorSiBaja?: boolean }) {
  if (actual === null || base === null || base === 0) return <span className="text-xs text-gray-400">—</span>
  const pct = ((actual - base) / base) * 100
  const neutro = Math.abs(pct) < 0.5
  const bueno = mejorSiBaja ? pct <= 0 : pct >= 0
  const c = neutro ? { texto: "#4b5563", fondo: "#f3f4f6", barra: "#9ca3af" } : bueno ? VERDE : ROJO
  const ancho = Math.min(Math.abs(pct), 100) / 2 // % del ancho total; cada lado ocupa la mitad

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-2 flex-1 min-w-[120px] rounded-full bg-gray-100">
        <div className="absolute inset-y-0 left-1/2 w-px bg-gray-300" />
        <div
          className="absolute inset-y-0 rounded-full"
          style={{
            backgroundColor: c.barra,
            width: `${ancho}%`,
            left: pct >= 0 ? "50%" : `${50 - ancho}%`,
          }}
        />
      </div>
      <span
        className="inline-flex justify-end min-w-[68px] text-xs font-semibold px-1.5 py-0.5 rounded tabular-nums"
        style={{ color: c.texto, backgroundColor: c.fondo }}
      >
        {pct >= 0 ? "↑" : "↓"} {Math.abs(pct).toFixed(1)}%
      </span>
    </div>
  )
}

function SelectorMes({ value, onChange, meses }: {
  value: string
  onChange: (mes: string) => void
  meses: MonthlyAccountTotal[]
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-7 rounded-md border border-gray-200 bg-white px-2 text-[11px] font-semibold uppercase tracking-wide text-gray-700"
    >
      {meses.map(m => (
        <option key={m.mes} value={m.mes}>{m.label}</option>
      ))}
    </select>
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
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground bg-gray-50/80">
            <th className="text-left px-3 py-2.5 w-[170px]">Métrica</th>
            <th className="text-right px-3 py-2"><SelectorMes value={mesBase} onChange={setMesBase} meses={meses} /></th>
            <th className="text-right px-3 py-2 bg-[#8B5CF6]/10"><SelectorMes value={mesActual} onChange={setMesActual} meses={meses} /></th>
            <th className="text-left px-3 py-2.5 w-[40%]">Variación</th>
          </tr>
        </thead>
        <tbody>
          {METRICAS.map(m => {
            const vActual = m.valor(rActual)
            const vBase = m.valor(rBase)
            return (
              <tr key={m.label} className="border-b border-gray-50 hover:bg-gray-50/60">
                <td className="px-3 py-2.5 font-medium text-gray-700">{m.label}</td>
                <td className="px-3 py-2.5 text-right tabular-nums text-muted-foreground">{vBase !== null ? m.formato(vBase) : "—"}</td>
                <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-gray-900 bg-[#8B5CF6]/5">{vActual !== null ? m.formato(vActual) : "—"}</td>
                <td className="px-3 py-2.5"><Variacion actual={vActual} base={vBase} mejorSiBaja={m.mejorSiBaja} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="text-[11px] text-muted-foreground px-3 py-2 border-t border-gray-100">
        Elige los meses en el encabezado de cada columna. Verde = mejora, rojo = empeora (en CPA, CPC y CPM bajar es mejora).
      </p>
    </div>
  )
}
