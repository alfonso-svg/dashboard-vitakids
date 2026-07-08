export type TablaNegocioRow = {
  mes: string
  convShopify: number
  convReales: number
  ratioConv: number       // convReales / convShopify × 100
  ingShopify: number
  ingReales: number
  ratioIng: number        // ingReales / ingShopify × 100
  comprasPerdidas: number
  ingresosPerdidos: number
}

function parseCsvLine(line: string): string[] {
  const out: string[] = []
  let inQ = false, cur = ""
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ }
    else if (ch === ',' && !inQ) { out.push(cur.trim()); cur = "" }
    else { cur += ch }
  }
  out.push(cur.trim())
  return out
}

function parseUSD(s: string): number {
  if (!s) return 0
  const trimmed = s.trim().replace(/"/g, "")
  const negative = trimmed.startsWith("-")
  const clean = trimmed.replace(/^-/, "").replace(/[$,.\s]/g, "")
  const val = parseFloat(clean) || 0
  return negative ? -val : val
}

export function parseTablaNegocio(text: string): TablaNegocioRow[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  const rows: TablaNegocioRow[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i])
    if (cols.length < 9) continue
    const mes = cols[0].trim()
    if (!mes) continue

    const convShopify      = parseFloat(cols[1]) || 0
    const convReales       = parseFloat(cols[2]) || 0
    const ingShopify       = parseUSD(cols[4])
    const ingReales        = parseUSD(cols[5])
    const comprasPerdidas  = parseFloat(cols[7]) || 0
    const ingresosPerdidos = parseUSD(cols[8])

    rows.push({
      mes:             mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase(),
      convShopify,
      convReales,
      ratioConv:       convShopify > 0 ? (convReales / convShopify) * 100 : 0,
      ingShopify,
      ingReales,
      ratioIng:        ingShopify > 0 ? (ingReales / ingShopify) * 100 : 0,
      comprasPerdidas,
      ingresosPerdidos,
    })
  }
  return rows
}

// Umbrales P33/P67 dinámicos basados en el histórico de ratioConv
export function computeSemaforoThresholds(rows: TablaNegocioRow[]): [number, number] {
  const sorted = rows.map(r => r.ratioConv).sort((a, b) => a - b)
  const p33 = sorted[Math.floor(sorted.length * 0.33)] ?? 50
  const p67 = sorted[Math.floor(sorted.length * 0.67)] ?? 65
  return [p33, p67]
}
