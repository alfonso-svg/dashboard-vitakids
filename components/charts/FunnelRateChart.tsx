"use client"

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from "recharts"
import type { DailyInsight } from "@/lib/meta/types"

type Marker = { date: string; label: string }

type FunnelRateChartProps = {
  data: DailyInsight[]
  numerador: "carritos" | "purchases"
  denominador: "visitas" | "pagos"
  promedioReferencia: number | null
  etiquetaReferencia: string
  markers: readonly Marker[]
  color: string
  nombre: string
}

type Punto = { date: string; tasa: number | null; num: number; den: number }

const fmtDia = (iso: string) => `${+iso.slice(8)}/${+iso.slice(5, 7)}`

function ChartTooltip({ active, payload, nombre }: {
  active?: boolean
  payload?: { payload: Punto }[]
  nombre: string
}) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1 text-gray-700">{fmtDia(p.date)}</p>
      <p>{nombre}: {p.tasa !== null ? `${p.tasa.toFixed(1)}%` : "—"}</p>
      <p className="text-gray-400">{p.num} de {p.den}</p>
    </div>
  )
}

export function FunnelRateChart({
  data, numerador, denominador, promedioReferencia, etiquetaReferencia, markers, color, nombre,
}: FunnelRateChartProps) {
  const puntos: Punto[] = data.map(d => ({
    date: d.date,
    num: d[numerador],
    den: d[denominador],
    tasa: d[denominador] > 0 ? (d[numerador] / d[denominador]) * 100 : null,
  }))
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
          width={40}
          tickFormatter={(v: number) => `${v}%`}
        />
        <Tooltip content={<ChartTooltip nombre={nombre} />} />
        {promedioReferencia !== null && (
          <ReferenceLine
            y={promedioReferencia}
            stroke="#9ca3af"
            strokeDasharray="5 4"
            label={{ value: `${etiquetaReferencia} ${promedioReferencia.toFixed(1)}%`, position: "insideTopLeft", fontSize: 10, fill: "#6b7280" }}
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
          dataKey="tasa"
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
