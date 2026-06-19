"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkline } from "@/components/charts/Sparkline"

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  sparklineData?: { day: string; value: number }[]
  sparklineId?: string
  sparklineColor?: string
  formatValue?: (v: number) => string
  change?: number
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  sparklineData,
  sparklineId,
  sparklineColor = "#017C9B",
  formatValue,
  change,
}: MetricCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          {icon}
        </div>
        <div className="mb-1">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          {subtitle && (
            <span className="ml-1.5 text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <div className={change !== undefined ? "mb-2" : sparklineData ? "mb-2" : ""}>
          {change !== undefined ? (
            <span
              className="text-[11px] font-semibold"
              style={{ color: change >= 0 ? "#16a34a" : "#dc2626" }}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}% vs per. anterior
            </span>
          ) : (
            <span className="text-[11px] text-transparent select-none">—</span>
          )}
        </div>
        {sparklineData && sparklineId && (
          <Sparkline data={sparklineData} color={sparklineColor} id={sparklineId} formatValue={formatValue} />
        )}
      </CardContent>
    </Card>
  )
}
