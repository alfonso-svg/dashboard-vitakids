"use client"

import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts"

interface SparklineProps {
  data: { day: string; value: number }[]
  color: string
  id: string
  formatValue?: (v: number) => string
}

function SparkTooltip({
  active,
  payload,
  formatValue,
}: {
  active?: boolean
  payload?: { payload: { day: string; value: number } }[]
  formatValue?: (v: number) => string
}) {
  if (!active || !payload?.length) return null
  const { day, value } = payload[0].payload
  return (
    <div className="rounded-md border bg-white px-2 py-1 text-[11px] shadow-md pointer-events-none">
      <span className="text-muted-foreground mr-1">{day}</span>
      <span className="font-semibold">{formatValue ? formatValue(value) : value.toLocaleString("es-CL")}</span>
    </div>
  )
}

export function Sparkline({ data, color, id, formatValue }: SparklineProps) {
  const gradientId = `sg-${id}`
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          content={<SparkTooltip formatValue={formatValue} />}
          cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
