"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type DataPoint = { date: string; spend: number; purchases: number; impressions: number }

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

function SpendTooltip({
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
      <p style={{ color: "#8B5CF6" }}>Gasto: {usd.format(payload[0].value)}</p>
    </div>
  )
}

export function SpendChart({ data }: { data: DataPoint[] }) {
  if (!data.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
        Sin datos para el período seleccionado
      </div>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
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
        <YAxis
          tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          width={42}
        />
        <Tooltip content={<SpendTooltip />} cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#8B5CF6"
          strokeWidth={2}
          fill="url(#spendGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
