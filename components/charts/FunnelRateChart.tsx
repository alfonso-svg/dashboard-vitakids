"use client"

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from "recharts"
import type { DailyInsight } from "@/lib/meta/types"

type Marker = { date: string; label: string }

// Serie diaria genérica (tasa del embudo o CPA) con línea de referencia y marcadores de eventos.
type FunnelRateChartProps = {
  data: DailyInsight[]
  valor: (d: DailyInsight) => number | null
  detalle: (d: DailyInsight) => string
  formato: (n: number) => string
  formatoEje: (n: number) => string
  promedioReferencia: number | null
  etiquetaReferencia: string
  markers: readonly Marker[]
  color: string
  nombre: string
}

type Punto = { date: string; valor: number | null; detalle: string }

const fmtDia = (iso: string) => `${+iso.slice(8)}/${+iso.slice(5, 7)}`

function ChartTooltip({ active, payload, nombre, formato }: {
  active?: boolean
  payload?: { payload: Punto }[]
  nombre: string
  formato: (n: number) => string
}) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1 text-gray-700">{fmtDia(p.date)}</p>
      <p>{nombre}: {p.valor !== null ? formato(p.valor) : "—"}</p>
      <p className="text-gray-400">{p.detalle}</p>
    </div>
  )
}

export function FunnelRateChart({
  data, valor, detalle, formato, formatoEje, promedioReferencia, etiquetaReferencia, markers, color, nombre,
}: FunnelRateChartProps) {
  const puntos: Punto[] = data.map(d => ({ date: d.date, valor: valor(d), detalle: detalle(d) }))
  const fechas = new Set(puntos.map(p => p.date))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={puntos} margin={{ top: 22, right: 16, bottom: 0, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={fmtDia}
          minTickGap={16}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={formatoEje}
        />
        <Tooltip content={<ChartTooltip nombre={nombre} formato={formato} />} />
        {promedioReferencia !== null && (
          <ReferenceLine
            y={promedioReferencia}
            stroke="#9ca3af"
            strokeDasharray="5 4"
            label={{ value: `${etiquetaReferencia} ${formato(promedioReferencia)}`, position: "insideTopLeft", fontSize: 10, fill: "#6b7280" }}
          />
        )}
        {markers.filter(m => fechas.has(m.date)).map(m => (
          <ReferenceLine
            key={m.date}
            x={m.date}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ value: m.label, position: "top", fontSize: 10, fill: "#b45309" }}
          />
        ))}
        <Line
          dataKey="valor"
          name={nombre}
          type="monotone"
          stroke={color}
          strokeWidth={2}
          dot={false}
          connectNulls
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
