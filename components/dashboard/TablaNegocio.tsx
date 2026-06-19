"use client"

import { computeSemaforoThresholds, type TablaNegocioRow } from "@/lib/data/tablaNegocioParser"

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(n)

type SemaforoLevel = "verde" | "amarillo" | "rojo"

const SEMAFORO: Record<SemaforoLevel, { color: string; bg: string; label: string }> = {
  verde:    { color: "#16a34a", bg: "#dcfce7", label: "Bueno"   },
  amarillo: { color: "#d97706", bg: "#fef3c7", label: "Regular" },
  rojo:     { color: "#dc2626", bg: "#fee2e2", label: "Bajo"    },
}

function getSemaforoLevel(ratio: number, thresholds: [number, number]): SemaforoLevel {
  const [p33, p67] = thresholds
  if (ratio >= p67) return "verde"
  if (ratio >= p33) return "amarillo"
  return "rojo"
}

type Props = { rows: TablaNegocioRow[] }

export function TablaNegocio({ rows }: Props) {
  if (!rows.length) return (
    <p className="text-xs text-muted-foreground py-4">Sin datos de negocio.</p>
  )

  const thresholds = computeSemaforoThresholds(rows)
  const reversed   = [...rows].reverse()

  return (
    <div className="space-y-2">
      <div className="overflow-y-auto overflow-x-auto max-h-[320px] rounded-md border border-gray-100">
        <table className="w-full text-xs min-w-[700px]">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-100">
            <tr>
              <th className="text-left   px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Mes</th>
              <th className="text-right  px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Conv. Meta</th>
              <th className="text-right  px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Conv. Reales</th>
              <th className="text-center px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Ratio conv.</th>
              <th className="text-right  px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Ing. Meta</th>
              <th className="text-right  px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Ing. Reales</th>
              <th className="text-right  px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Ratio ing.</th>
              <th className="text-right  px-3 py-2.5 font-semibold text-gray-500 whitespace-nowrap">Conv. perdidas</th>
            </tr>
          </thead>
          <tbody>
            {reversed.map((row, i) => {
              const level = getSemaforoLevel(row.ratioConv, thresholds)
              const sem   = SEMAFORO[level]
              return (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors last:border-0">
                  <td className="px-3 py-2.5 font-medium text-gray-700 whitespace-nowrap">{row.mes}</td>
                  <td className="px-3 py-2.5 text-right text-gray-500">{row.convShopify}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-gray-700">{row.convReales}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold"
                      style={{ color: sem.color, backgroundColor: sem.bg }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: sem.color }} />
                      {row.ratioConv.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-500">{fmtUSD(row.ingShopify)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold text-gray-700">{fmtUSD(row.ingReales)}</td>
                  <td className="px-3 py-2.5 text-right text-gray-500">{row.ratioIng.toFixed(0)}%</td>
                  <td className="px-3 py-2.5 text-right">
                    <span className={row.comprasPerdidas <= 0 ? "text-green-600 font-medium" : "text-red-500"}>
                      {row.comprasPerdidas <= 0
                        ? `+${Math.abs(row.comprasPerdidas)}`
                        : `-${row.comprasPerdidas}`}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* Leyenda semáforo */}
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground px-1">
        <span className="font-medium text-gray-400">Semáforo conv.:</span>
        {(["verde", "amarillo", "rojo"] as SemaforoLevel[]).map(l => (
          <span key={l} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SEMAFORO[l].color }} />
            {SEMAFORO[l].label} {l === "verde" ? `(≥${thresholds[1].toFixed(0)}%)` : l === "amarillo" ? `(${thresholds[0].toFixed(0)}–${thresholds[1].toFixed(0)}%)` : `(<${thresholds[0].toFixed(0)}%)`}
          </span>
        ))}
      </div>
    </div>
  )
}
