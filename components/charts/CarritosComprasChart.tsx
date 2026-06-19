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
  const visitas  = payload.find(p => p.name === "visitas")
  const carritos = payload.find(p => p.name === "carritos")
  const pagos    = payload.find(p => p.name === "pagos")
  const compras  = payload.find(p => p.name === "compras")
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1 text-gray-700">{label}</p>
      {visitas  && <p style={{ color: "#a78bfa" }}>Visitas: {Math.round(visitas.value).toLocaleString("es-CL")}</p>}
      {carritos && <p style={{ color: "#8B5CF6" }}>Carritos: {Math.round(carritos.value).toLocaleString("es-CL")}</p>}
      {pagos    && <p style={{ color: "#6d28d9" }}>Pagos inic.: {Math.round(pagos.value).toLocaleString("es-CL")}</p>}
      {compras  && <p style={{ color: "#18181B" }}>Compras: {Math.round(compras.value)}</p>}
    </div>
  )
}

function tickLabel(v: string) {
  return v.replace(/ 20(\d{2})$/, " '$1")
}

export function CarritosComprasChart({ data }: Props) {
  if (!data.length) return (
    <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
      Sin datos históricos
    </div>
  )
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={data} margin={{ top: 8, right: 44, bottom: 0, left: 4 }} barCategoryGap="30%" barGap={2}>
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
          width={40}
          tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Bar
          yAxisId="left"
          dataKey="carritos"
          name="carritos"
          fill="#8B5CF6"
          fillOpacity={0.45}
          radius={[3, 3, 0, 0]}
          maxBarSize={16}
          isAnimationActive={false}
        />
        <Bar
          yAxisId="left"
          dataKey="pagos"
          name="pagos"
          fill="#6d28d9"
          fillOpacity={0.65}
          radius={[3, 3, 0, 0]}
          maxBarSize={16}
          isAnimationActive={false}
        />
        <Bar
          yAxisId="left"
          dataKey="purchases"
          name="compras"
          fill="#18181B"
          fillOpacity={0.85}
          radius={[3, 3, 0, 0]}
          maxBarSize={16}
          isAnimationActive={false}
        />
        <Line
          yAxisId="right"
          dataKey="visitas"
          name="visitas"
          type="monotone"
          stroke="#a78bfa"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
