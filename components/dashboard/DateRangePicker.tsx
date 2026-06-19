"use client"

import { useState } from "react"
import { format, subDays, startOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, ChevronDown } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type DateRangeValue = { from: string; to: string }

interface Props {
  value: DateRangeValue
  onChange: (v: DateRangeValue) => void
  availableMonths?: string[]  // "MM-YYYY" sorted oldest→newest
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function formatLabel(from: string, to: string): string {
  const f = new Date(from + "T00:00:00")
  const t = new Date(to + "T00:00:00")
  const fmt = (d: Date) => format(d, "d MMM", { locale: es })
  if (from === to) return fmt(f)
  if (f.getMonth() === t.getMonth() && f.getFullYear() === t.getFullYear()) {
    return `${f.getDate()} – ${fmt(t)}`
  }
  return `${fmt(f)} – ${fmt(t)}`
}

function mesDisplayLabel(mes: string): string {
  const names = ["","ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
  const [m, y] = mes.split("-")
  return `${names[parseInt(m)]} ${y}`
}

const PRESETS = [
  { label: "Últimos 7 días",  days: 6  },
  { label: "Últimos 15 días", days: 14 },
  { label: "Últimos 30 días", days: 29 },
]

export function DateRangePicker({ value, onChange, availableMonths }: Props) {
  const [open, setOpen] = useState(false)
  const [internal, setInternal] = useState<DateRange>({
    from: new Date(value.from + "T00:00:00"),
    to:   new Date(value.to   + "T00:00:00"),
  })

  function apply(range: DateRange) {
    if (range.from && range.to) {
      onChange({ from: toISO(range.from), to: toISO(range.to) })
      setOpen(false)
    }
  }

  function applyPreset(days: number) {
    const to   = new Date()
    const from = subDays(to, days)
    const range = { from, to }
    setInternal(range)
    apply(range)
  }

  function applyThisMonth() {
    const to   = new Date()
    const from = startOfMonth(to)
    const range = { from, to }
    setInternal(range)
    apply(range)
  }

  function applyMonth(mes: string) {
    const [mm, yy] = mes.split("-")
    const year  = parseInt(yy)
    const month = parseInt(mm) - 1
    const from  = new Date(year, month, 1)
    const today = new Date()
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()
    const to = isCurrentMonth ? today : new Date(year, month + 1, 0)
    const range = { from, to }
    setInternal(range)
    apply(range)
  }

  const monthsDesc = availableMonths ? [...availableMonths].reverse() : []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center gap-1.5 h-8 px-3 text-xs bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
        <CalendarDays size={13} className="text-muted-foreground shrink-0" />
        <span className="text-gray-700 min-w-[110px] text-left">{formatLabel(value.from, value.to)}</span>
        <ChevronDown size={12} className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex">
          <div className="flex flex-col gap-0.5 p-3 border-r border-gray-100 min-w-[140px] max-h-[380px] overflow-y-auto">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Accesos rápidos
            </p>
            {PRESETS.map((p) => (
              <button
                key={p.days}
                onClick={() => applyPreset(p.days)}
                className="text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 transition-colors"
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={applyThisMonth}
              className="text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 transition-colors"
            >
              Este mes
            </button>

            {monthsDesc.length > 0 && (
              <>
                <div className="my-2 border-t border-gray-100" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Por mes
                </p>
                {monthsDesc.map(mes => (
                  <button
                    key={mes}
                    onClick={() => applyMonth(mes)}
                    className="text-left text-xs px-2 py-1.5 rounded hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    {mesDisplayLabel(mes)}
                  </button>
                ))}
              </>
            )}
          </div>
          <Calendar
            mode="range"
            selected={internal}
            onSelect={(range) => {
              if (range) {
                setInternal(range)
                if (range.from && range.to) apply(range)
              }
            }}
            numberOfMonths={2}
            locale={es}
            disabled={{ after: new Date() }}
            className="p-3"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
