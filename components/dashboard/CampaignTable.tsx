"use client"

import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CampaignInsight } from "@/lib/meta/types"

type SortKey = "name" | "spend" | "impressions" | "ctr" | "visitas" | "carritos" | "pagos" | "purchases" | "cpa" | "valorCompras" | "roas"
type SortDir = "asc" | "desc"

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
const pct = (n: number) => `${n.toFixed(2)}%`
const num = (n: number) => n.toLocaleString("en-US")

function cpaSemaforo(cpa: number | null): { color: string; bg: string } | null {
  if (cpa === null) return null
  if (cpa < 3.00) return { color: "#166534", bg: "#dcfce7" }
  if (cpa < 4.00) return { color: "#92400e", bg: "#fef9c3" }
  return { color: "#991b1b", bg: "#fee2e2" }
}

function nullLast(a: number | null, b: number | null, m: number): number {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  return m * (a - b)
}

function SortBtn({
  col, active, dir, onClick, right, children,
}: {
  col: SortKey; active: boolean; dir: SortDir; onClick: () => void; right?: boolean; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-0.5 text-xs font-semibold uppercase tracking-wide select-none hover:text-foreground transition-colors ${right ? "ml-auto" : ""} ${active ? "text-foreground" : "text-muted-foreground"}`}
    >
      {children}
      {active
        ? dir === "asc"
          ? <ArrowUp size={11} style={{ color: "#8B5CF6" }} />
          : <ArrowDown size={11} style={{ color: "#8B5CF6" }} />
        : <ArrowUpDown size={11} className="opacity-30" />
      }
    </button>
  )
}

interface CampaignTableProps {
  campaigns: CampaignInsight[]
  loading?: boolean
}

export function CampaignTable({ campaigns, loading }: CampaignTableProps) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "spend", dir: "desc" })

  function toggle(key: SortKey) {
    setSort((prev) => prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" })
  }

  const sorted = [...campaigns].sort((a, b) => {
    const m = sort.dir === "asc" ? 1 : -1
    switch (sort.key) {
      case "name":        return m * a.name.localeCompare(b.name, "es")
      case "spend":       return m * (a.spend - b.spend)
      case "impressions": return m * (a.impressions - b.impressions)
      case "ctr":         return m * (a.ctr - b.ctr)
      case "visitas":     return m * (a.visitas - b.visitas)
      case "carritos":    return m * (a.carritos - b.carritos)
      case "pagos":       return m * (a.pagos - b.pagos)
      case "purchases":   return m * (a.purchases - b.purchases)
      case "cpa":         return nullLast(a.cpa, b.cpa, m)
      case "valorCompras":return nullLast(a.valorCompras, b.valorCompras, m)
      case "roas":        return nullLast(a.roas, b.roas, m)
      default:            return 0
    }
  })

  const cols: { key: SortKey; label: string }[] = [
    { key: "spend",        label: "Gasto" },
    { key: "impressions",  label: "Impresiones" },
    { key: "ctr",          label: "CTR" },
    { key: "visitas",      label: "Visitas" },
    { key: "carritos",     label: "Carritos" },
    { key: "pagos",        label: "Pagos" },
    { key: "purchases",    label: "Compras" },
    { key: "cpa",          label: "CPA" },
    { key: "valorCompras", label: "Valor compras" },
    { key: "roas",         label: "ROAS" },
  ]

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[960px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-[22%] min-w-[180px]">
              <SortBtn col="name" active={sort.key === "name"} dir={sort.dir} onClick={() => toggle("name")}>
                Campaña
              </SortBtn>
            </TableHead>
            {cols.map(({ key, label }) => (
              <TableHead key={key} className="text-right px-2">
                <SortBtn col={key} active={sort.key === key} dir={sort.dir} onClick={() => toggle(key)} right>
                  {label}
                </SortBtn>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((c) => {
            const semaforo = cpaSemaforo(c.cpa)
            return (
                <TableRow
                  key={c.id}
                  className="hover:bg-gray-50/60"
                >
                  <TableCell>
                    <p className="font-medium text-sm leading-tight">{c.name}</p>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm font-medium px-2">
                    {usd.format(c.spend)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground px-2">
                    {num(c.impressions)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground px-2">
                    {pct(c.ctr)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground px-2">
                    {num(c.visitas)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground px-2">
                    {num(c.carritos)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground px-2">
                    {num(c.pagos)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm font-semibold px-2">
                    {c.purchases > 0 ? num(c.purchases) : <span className="text-muted-foreground font-normal">—</span>}
                  </TableCell>
                  <TableCell className="text-right px-2">
                    {semaforo ? (
                      <span
                        className="inline-block px-2 py-0.5 rounded font-mono text-sm font-semibold"
                        style={{ color: semaforo.color, backgroundColor: semaforo.bg }}
                      >
                        {usd.format(c.cpa!)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm text-muted-foreground px-2">
                    {c.valorCompras !== null ? usd.format(c.valorCompras) : <span>—</span>}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm font-medium px-2">
                    {c.roas !== null
                      ? <span>{c.roas.toFixed(2)}x</span>
                      : <span className="text-muted-foreground">—</span>
                    }
                  </TableCell>
                </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
