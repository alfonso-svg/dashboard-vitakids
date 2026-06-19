"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

type DataPoint = { date: string; spend: number; purchases: number; impressions: number }

function PurchasesTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-0.5 text-gray-700">{label}</p>
      <p style={{ color: "#18181B" }}>Compras: {payload[0].value}</p>
    </div>
  )
}

export function ConversionsChart({ data }: { data: DataPoint[] }) {
  if (!data.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
        Sin datos para el período seleccionado
      </div>
    )
  }
  const maxVal = Math.max(...data.map((d) => d.purchases))
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) => {
            const [, m, d] = v.split("-")
            const meses = ["","ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
            return `${parseInt(d)} ${meses[parseInt(m)]}`
          }}
        />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
        <Tooltip content={<PurchasesTooltip />} cursor={{ fill: "#f9fafb" }} />
        <Bar dataKey="purchases" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.purchases === maxVal ? "#18181B" : "#8B5CF6"}
              fillOpacity={entry.purchases === maxVal ? 1 : 0.65}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
