"use client"

const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n))

type Props = {
  visitas:  number
  carritos: number
  pagos:    number
  compras:  number
}

const STEPS = [
  { key: "visitas",  label: "Visitas",         color: "#8B5CF6" },
  { key: "carritos", label: "Carritos",         color: "#7C3AED" },
  { key: "pagos",    label: "Pagos iniciados",  color: "#6D28D9" },
  { key: "compras",  label: "Compras",          color: "#4C1D95" },
] as const

type Key = (typeof STEPS)[number]["key"]

export function FunnelChart({ visitas, carritos, pagos, compras }: Props) {
  const vals: Record<Key, number> = { visitas, carritos, pagos, compras }
  const max = visitas || 1

  return (
    <div className="h-[220px] flex flex-col justify-around py-2">
      {STEPS.map((step, i) => {
        const value = vals[step.key]
        const prev  = i > 0 ? vals[STEPS[i - 1].key] : null
        const conv  = prev != null && prev > 0
          ? `${((value / prev) * 100).toFixed(0)}%`
          : null
        const barW  = max > 0 ? Math.max((value / max) * 100, 2) : 2

        return (
          <div key={step.key} className="flex items-center gap-3">
            <span className="w-28 text-[11px] text-gray-500 text-right shrink-0 leading-tight">
              {step.label}
            </span>
            <div className="flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${barW}%`, backgroundColor: step.color }}
              />
            </div>
            <div className="w-[72px] flex items-center justify-between shrink-0">
              <span className="text-xs font-semibold text-gray-800 tabular-nums">
                {fmtNum(value)}
              </span>
              {conv && (
                <span className="text-[10px] text-gray-400 tabular-nums">{conv}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
