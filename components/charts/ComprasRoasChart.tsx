"use client"

import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import type { MonthlyAccountTotal } from "@/lib/data/csvParser"

type Props = { data: MonthlyAccountTotal[] }

function ChartTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const compras = payload.find(p => p.name === "compras")
  const roas    = payload.find(p => p.name === "roas")
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1 text-gray-700">{label}</p>
      {compras && <p style={{ color: "#8B5CF6" }}>Compras: {Math.round(compras.value)}</p>}
      {roas    && <p style={{ color: "#18181B" }}>ROAS: {roas.value.toFixed(2)}x</p>}
    </div>
  )
}

function tickLabel(v: string) {
  // "abr 2026" → "abr '26"
  return v.replace(/ 20(\d{2})$/, " '$1")
}

export function ComprasRoasChart({ data }: Props) {
  if (!data.length) return (
    <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
      Sin datos históricos
    </div>
  )
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 8, right: 36, bottom: 0, left: 4 }}>
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
          width={28}
          allowDecimals={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={36}
          tickFormatter={(v: number) => `${v.toFixed(0)}x`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Bar
          yAxisId="left"
          dataKey="purchases"
          name="compras"
          fill="#8B5CF6"
          fillOpacity={0.85}
          radius={[3, 3, 0, 0]}
          maxBarSize={32}
          isAnimationActive={false}
        />
        <Line
          yAxisId="right"
          dataKey="roas"
          name="roas"
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
