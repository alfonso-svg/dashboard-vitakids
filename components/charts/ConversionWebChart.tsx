"use client"

import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import type { MonthlyAccountTotal } from "@/lib/data/csvParser"

type ChartPoint = MonthlyAccountTotal & { convRate: number }

type Props = { data: MonthlyAccountTotal[] }

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const visitas  = payload.find(p => p.name === "visitas")
  const convRate = payload.find(p => p.name === "convRate")
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1 text-gray-700">{label}</p>
      {visitas  && <p style={{ color: "#8B5CF6" }}>Visitas: {Math.round(visitas.value).toLocaleString("es-CL")}</p>}
      {convRate && <p style={{ color: "#18181B" }}>Conv. web: {convRate.value.toFixed(2)}%</p>}
    </div>
  )
}

function tickLabel(v: string) {
  return v.replace(/ 20(\d{2})$/, " '$1")
}

export function ConversionWebChart({ data }: Props) {
  if (!data.length) return (
    <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
      Sin datos históricos
    </div>
  )

  const chartData: ChartPoint[] = data.map(d => ({
    ...d,
    convRate: d.visitas > 0 ? (d.purchases / d.visitas) * 100 : 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 40, bottom: 0, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickLabel}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={42}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={40}
          tickFormatter={(v: number) => `${v.toFixed(1)}%`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Bar
          yAxisId="left"
          dataKey="visitas"
          name="visitas"
          fill="#8B5CF6"
          fillOpacity={0.18}
          radius={[3, 3, 0, 0]}
          maxBarSize={32}
          isAnimationActive={false}
        />
        <Line
          yAxisId="right"
          dataKey="convRate"
          name="convRate"
          type="monotone"
          stroke="#18181B"
          strokeWidth={2}
          dot={{ r: 3, fill: "#18181B", strokeWidth: 0 }}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
