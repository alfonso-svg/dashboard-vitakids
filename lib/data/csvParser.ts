import type { CampaignInsight } from "@/lib/meta/types"

export type CsvMonthRow = {
  mes: string          // "MM-YYYY"
  campaign: string
  objetivo: string
  impresiones: number
  clics: number
  ctr: number          // como porcentaje (8.5 = 8.5%)
  visitas: number
  carritos: number
  pagos: number
  compras: number
  valorConversion: number
  roas: number
  spend: number
}

function parseLine(line: string): string[] {
  const out: string[] = []
  let inQ = false
  let cur = ""
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ }
    else if (ch === ',' && !inQ) { out.push(cur.trim()); cur = "" }
    else { cur += ch }
  }
  out.push(cur.trim())
  return out
}

// "1.234,56" → 1234.56  |  "$45,4" → 45.4  |  "" → 0
function parseNum(s: string): number {
  if (!s) return 0
  s = s.replace(/[$\s]/g, "").replace(/\./g, "").replace(",", ".")
  return parseFloat(s) || 0
}

export function parseCsvData(text: string): CsvMonthRow[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return []
  const rows: CsvMonthRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const c = parseLine(lines[i])
    if (c.length < 17) continue
    const mes = c[0]
    if (!/^\d{2}-\d{4}$/.test(mes)) continue
    rows.push({
      mes,
      campaign:        c[1],
      objetivo:        c[2],
      impresiones:     parseNum(c[3]),
      clics:           parseNum(c[6]),
      ctr:             parseNum(c[7]),
      visitas:         parseNum(c[9]),
      carritos:        parseNum(c[10]),
      pagos:           parseNum(c[11]),
      compras:         parseNum(c[12]),
      valorConversion: parseNum(c[14]),
      roas:            parseNum(c[15]),
      spend:           parseNum(c[16]),
    })
  }
  return rows
}

// "MM-YYYY" → sortable integer: 202605
function mesKey(mes: string): number {
  const [m, y] = mes.split("-")
  return parseInt(y) * 100 + parseInt(m)
}

// "05-2026" → "may 2026"
function mesLabel(mes: string): string {
  const names = ["","ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
  const [m, y] = mes.split("-")
  return `${names[parseInt(m)]} ${y}`
}

// "2026-05-17" → "05-2026"
export function mesFromISO(iso: string): string {
  const [y, m] = iso.split("-")
  return `${m}-${y}`
}

function objetivoToObjective(obj: string): string {
  if (obj === "Ventas") return "OUTCOME_SALES"
  if (obj === "Tráfico") return "LINK_CLICKS"
  return "POST_ENGAGEMENT"
}

export function aggregateCsvRows(
  rows: CsvMonthRow[],
  fromISO: string,
  toISO: string,
): { campaigns: CampaignInsight[]; monthsLabel: string } {
  const fromKey = mesKey(mesFromISO(fromISO))
  const toKey   = mesKey(mesFromISO(toISO))

  const filtered = rows.filter(r => {
    const k = mesKey(r.mes)
    return k >= fromKey && k <= toKey
  })

  const months = [...new Set(filtered.map(r => r.mes))].sort((a, b) => mesKey(a) - mesKey(b))
  const monthsLabel =
    months.length === 0 ? "" :
    months.length === 1 ? mesLabel(months[0]) :
    `${mesLabel(months[0])} – ${mesLabel(months[months.length - 1])}`

  const groups = new Map<string, CsvMonthRow[]>()
  for (const row of filtered) {
    if (!groups.has(row.campaign)) groups.set(row.campaign, [])
    groups.get(row.campaign)!.push(row)
  }

  const campaigns: CampaignInsight[] = Array.from(groups.entries()).map(([name, rs]) => {
    const spend        = rs.reduce((s, r) => s + r.spend,           0)
    const impressions  = rs.reduce((s, r) => s + r.impresiones,     0)
    const clicks       = rs.reduce((s, r) => s + r.clics,           0)
    const visitas      = rs.reduce((s, r) => s + r.visitas,         0)
    const carritos     = rs.reduce((s, r) => s + r.carritos,        0)
    const pagos        = rs.reduce((s, r) => s + r.pagos,           0)
    const purchases    = rs.reduce((s, r) => s + r.compras,         0)
    const valorCompras = rs.reduce((s, r) => s + r.valorConversion, 0)
    const ctr = impressions > 0
      ? rs.reduce((s, r) => s + r.ctr * r.impresiones, 0) / impressions
      : 0
    const roas = spend > 0 && valorCompras > 0 ? valorCompras / spend : null
    const cpa  = purchases > 0 ? spend / purchases : null

    return {
      id:           name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      status:       "ACTIVE",
      objective:    objetivoToObjective(rs[0].objetivo),
      spend,
      impressions,
      clicks,
      ctr,
      visitas,
      carritos,
      pagos,
      purchases,
      cpa,
      roas,
      valorCompras: valorCompras > 0 ? valorCompras : null,
    }
  })

  return { campaigns, monthsLabel }
}

// Rango de meses disponibles en el CSV
export function csvDateRange(rows: CsvMonthRow[]): { first: string; last: string } | null {
  if (!rows.length) return null
  const keys = rows.map(r => r.mes)
  const sorted = [...new Set(keys)].sort((a, b) => mesKey(a) - mesKey(b))
  return { first: mesLabel(sorted[0]), last: mesLabel(sorted[sorted.length - 1]) }
}

// Totales de cuenta (suma de todas las campañas) por mes, para el rango dado.
// skipMes: excluye ese mes del resultado (usado para el mes actual, cubierto por data diaria).
export type MonthlyAccountTotal = {
  mes:              string
  label:            string
  spend:            number
  impressions:      number
  clicks:           number
  ctr:              number
  visitas:          number
  carritos:         number
  pagos:            number
  purchases:        number
  valorConversiones:number
  roas:             number
}

// skipFromMes: excluye este mes y todos los posteriores (cubiertas por data diaria)
export function getAccountMonthlyTotals(
  rows:          CsvMonthRow[],
  fromISO:       string,
  toISO:         string,
  skipFromMes?:  string,
): MonthlyAccountTotal[] {
  const fromKey = mesKey(mesFromISO(fromISO))
  const toKey   = mesKey(mesFromISO(toISO))
  const skipKey = skipFromMes ? mesKey(skipFromMes) : Infinity

  const map = new Map<string, MonthlyAccountTotal & { _ctrNum: number }>()

  for (const row of rows) {
    const k = mesKey(row.mes)
    if (k < fromKey || k > toKey) continue
    if (k >= skipKey) continue

    if (!map.has(row.mes)) {
      map.set(row.mes, {
        mes: row.mes, label: mesLabel(row.mes),
        spend: 0, impressions: 0, clicks: 0, ctr: 0,
        visitas: 0, carritos: 0, pagos: 0,
        purchases: 0, valorConversiones: 0, roas: 0,
        _ctrNum: 0,
      })
    }
    const m = map.get(row.mes)!
    m.spend              += row.spend
    m.impressions        += row.impresiones
    m.clicks             += row.clics
    m.visitas            += row.visitas
    m.carritos           += row.carritos
    m.pagos              += row.pagos
    m.purchases          += row.compras
    m.valorConversiones  += row.valorConversion
    m._ctrNum            += row.ctr * row.impresiones
  }

  return [...map.values()]
    .map(({ _ctrNum, ...m }) => ({
      ...m,
      ctr:  m.impressions > 0 ? _ctrNum / m.impressions : 0,
      roas: m.spend > 0 ? m.valorConversiones / m.spend : 0,
    }))
    .sort((a, b) => mesKey(a.mes) - mesKey(b.mes))
}
