"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

interface RefreshIndicatorProps {
  onRefresh: () => void
}

export function RefreshIndicator({ onRefresh }: RefreshIndicatorProps) {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [minutesAgo, setMinutesAgo] = useState(0)
  const [spinning, setSpinning] = useState(false)

  // Update "hace X min" every minute
  useEffect(() => {
    const tick = setInterval(() => {
      const diff = Math.floor((Date.now() - lastRefresh.getTime()) / 60000)
      setMinutesAgo(diff)
    }, 60000)
    return () => clearInterval(tick)
  }, [lastRefresh])

  // Auto-refresh every hour
  useEffect(() => {
    const timer = setInterval(() => {
      handleRefresh()
    }, 60 * 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  function handleRefresh() {
    setSpinning(true)
    onRefresh()
    setTimeout(() => {
      setLastRefresh(new Date())
      setMinutesAgo(0)
      setSpinning(false)
    }, 800)
  }

  const timeLabel = minutesAgo === 0
    ? "ahora mismo"
    : minutesAgo === 1
    ? "hace 1 min"
    : `hace ${minutesAgo} min`

  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <button
        onClick={handleRefresh}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        title="Actualizar datos"
      >
        <RefreshCw
          size={12}
          className={spinning ? "animate-spin" : ""}
        />
        <span>Actualizar</span>
      </button>
      <span className="text-gray-300">·</span>
      <span>
        Actualizado{" "}
        <span className="font-medium text-gray-500">{timeLabel}</span>
      </span>
    </div>
  )
}
