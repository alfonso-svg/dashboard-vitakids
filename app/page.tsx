"use client"

import { useEffect, useMemo, useState } from "react"
import { subDays, subMonths, parseISO } from "date-fns"
import {
  DollarSign, Eye, MousePointerClick, Globe, ShoppingCart,
  CreditCard, ShoppingBag, TrendingUp, BarChart3, Percent,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/dashboard/MetricCard"
import { CampaignTable } from "@/components/dashboard/CampaignTable"
import { FunnelChart } from "@/components/charts/FunnelChart"
import { ConversionsChart } from "@/components/charts/ConversionsChart"
import { DateRangePicker, type DateRangeValue } from "@/components/dashboard/DateRangePicker"
import { ExportButton } from "@/components/dashboard/ExportButton"
import { CsvUpload, CSV_STORAGE_KEY } from "@/components/dashboard/CsvUpload"
import { dailyData, campaigns as staticCampaigns } from "@/lib/data/kriza"
import { aggregateCsvRows, csvDateRange, getAccountMonthlyTotals, mesFromISO, parseCsvData, type CsvMonthRow, type MonthlyAccountTotal } from "@/lib/data/csvParser"
import { parseTablaNegocio, type TablaNegocioRow } from "@/lib/data/tablaNegocioParser"
import { TopAds } from "@/components/dashboard/TopAds"
import { TablaNegocio } from "@/components/dashboard/TablaNegocio"
import { ComprasRoasChart } from "@/components/charts/ComprasRoasChart"
import { CarritosComprasChart } from "@/components/charts/CarritosComprasChart"
import { ConversionWebChart } from "@/components/charts/ConversionWebChart"
import { adsJunio } from "@/lib/data/adsJunio"
import type { DailyInsight } from "@/lib/meta/types"

// ── Formatters ───────────────────────────────────────────────────────────────
const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n)
const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n))
const fmtPct = (n: number) => `${n.toFixed(2)}%`
const ICON   = "text-muted-foreground"

// ── Helpers ──────────────────────────────────────────────────────────────────
function toISO(d: Date) { return d.toISOString().slice(0, 10) }

function rangeLabel(from: string, to: string) {
  const meses = ["","ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
  const fmt   = (iso: string) => { const [,m,d] = iso.split("-"); return `${+d} ${meses[+m]}` }
  return from === to ? fmt(from) : `${fmt(from)} – ${fmt(to)}`
}

function toSparkline(data: DailyInsight[], key: keyof DailyInsight) {
  return data.map(d => ({
    day:   `${+d.date.slice(8)}/${+d.date.slice(5, 7)}`,
    value: d[key] as number,
  }))
}

function computeMetrics(data: DailyInsight[]) {
  if (!data.length) return null
  const spend             = data.reduce((s, d) => s + d.spend,             0)
  const impressions       = data.reduce((s, d) => s + d.impressions,       0)
  const visitas           = data.reduce((s, d) => s + d.visitas,           0)
  const carritos          = data.reduce((s, d) => s + d.carritos,          0)
  const pagos             = data.reduce((s, d) => s + d.pagos,             0)
  const purchases         = data.reduce((s, d) => s + d.purchases,         0)
  const valorConversiones = data.reduce((s, d) => s + d.valorConversiones, 0)
  const ctr  = impressions > 0 ? data.reduce((s, d) => s + d.ctr * d.impressions, 0) / impressions : 0
  const roas = spend > 0 ? valorConversiones / spend : 0
  return { spend, impressions, ctr, visitas, carritos, pagos, purchases, roas, valorConversiones }
}

function pctChange(curr: number, prev: number): number | undefined {
  return prev > 0 ? ((curr - prev) / prev) * 100 : undefined
}

// ── Datos disponibles ─────────────────────────────────────────────────────────
const DATA_FIRST    = dailyData[0].date                  // "2026-04-17"
const DATA_LAST     = dailyData[dailyData.length - 1].date  // "2026-06-15"
const CURRENT_MES   = mesFromISO(DATA_LAST)              // "06-2026"
// El CSV solo cubre meses anteriores al inicio de dailyData.
// Desde DAILY_START_MES en adelante, se usan datos diarios (evita doble conteo).
const DAILY_START_MES = mesFromISO(DATA_FIRST)           // "04-2026"

// Métricas híbridas:
//   - CSV mensual para meses ANTERIORES a dailyData (< abril 2026)
//   - dailyData para abril 2026 en adelante (permite comparación de mismo período)
function computeHybridMetrics(
  rows:    CsvMonthRow[] | null,
  fromISO: string,
  toISO:   string,
) {
  const daily  = dailyData.filter(d => d.date >= fromISO && d.date <= toISO)
  const dailyM = computeMetrics(daily)

  if (!rows) return dailyM

  // Solo incluye meses del CSV estrictamente anteriores al inicio de dailyData
  const past = getAccountMonthlyTotals(rows, fromISO, toISO, DAILY_START_MES)
  if (!past.length) return dailyM

  const csvSpend   = past.reduce((s, m) => s + m.spend,               0)
  const csvImp     = past.reduce((s, m) => s + m.impressions,         0)
  const csvVis     = past.reduce((s, m) => s + m.visitas,             0)
  const csvCart    = past.reduce((s, m) => s + m.carritos,            0)
  const csvPag     = past.reduce((s, m) => s + m.pagos,               0)
  const csvPurch   = past.reduce((s, m) => s + m.purchases,           0)
  const csvValor   = past.reduce((s, m) => s + m.valorConversiones,   0)
  const csvCtrNum  = past.reduce((s, m) => s + m.ctr * m.impressions, 0)

  const spend             = csvSpend + (dailyM?.spend             ?? 0)
  const impressions       = csvImp   + (dailyM?.impressions       ?? 0)
  const visitas           = csvVis   + (dailyM?.visitas           ?? 0)
  const carritos          = csvCart  + (dailyM?.carritos          ?? 0)
  const pagos             = csvPag   + (dailyM?.pagos             ?? 0)
  const purchases         = csvPurch + (dailyM?.purchases         ?? 0)
  const valorConversiones = csvValor + (dailyM?.valorConversiones ?? 0)
  const dailyCtrNum       = dailyM ? dailyM.ctr * dailyM.impressions : 0
  const ctr               = impressions > 0 ? (csvCtrNum + dailyCtrNum) / impressions : 0
  const roas              = spend > 0 ? valorConversiones / spend : 0

  if (!spend && !purchases) return null
  return { spend, impressions, ctr, visitas, carritos, pagos, purchases, roas, valorConversiones }
}

// ── Página ───────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(() => ({
    from: toISO(subDays(parseISO(DATA_LAST), 29)),
    to:   DATA_LAST,
  }))

  const [csvRows, setCsvRows] = useState<CsvMonthRow[] | null>(null)
  const [tablaNegocioRows, setTablaNegocioRows] = useState<TablaNegocioRow[]>([])

  async function fetchPublicCsv() {
    try {
      const r = await fetch('/Data%20Kriza/MetaNumbers%20KRIZA%20-%20KRIZA%20-%20NO%20TOCAR.csv')
      const text = await r.text()
      const rows = parseCsvData(text)
      if (rows.length) setCsvRows(rows)
    } catch { /* sin datos */ }
  }

  useEffect(() => {
    // Si el usuario subió una versión actualizada, usarla; si no, cargar el CSV del repositorio
    const stored = localStorage.getItem(CSV_STORAGE_KEY)
    if (stored) {
      try {
        setCsvRows(JSON.parse(stored) as CsvMonthRow[])
      } catch {
        localStorage.removeItem(CSV_STORAGE_KEY)
        fetchPublicCsv()
      }
    } else {
      fetchPublicCsv()
    }

    fetch('/Data%20Kriza/Tabla%20Negocio%20Kriza%20-%20Hoja%201.csv')
      .then(r => r.text())
      .then(text => {
        const rows = parseTablaNegocio(text)
        if (rows.length) setTablaNegocioRows(rows)
      })
      .catch(() => { /* sin datos */ })
  }, [])

  function handleCsvData(rows: CsvMonthRow[] | null) {
    if (rows === null) {
      // El usuario limpió el override → volver al CSV del repositorio
      fetchPublicCsv()
    } else {
      setCsvRows(rows)
    }
  }

  // Datos diarios del período (para gráficos y sparklines)
  const filteredData = useMemo(
    () => dailyData.filter(d => d.date >= dateRange.from && d.date <= dateRange.to),
    [dateRange]
  )

  // Métricas para las cards: CSV meses pasados + dailyData mes actual
  const metrics     = useMemo(
    () => computeHybridMetrics(csvRows, dateRange.from, dateRange.to),
    [csvRows, dateRange]
  )
  const prevMetrics = useMemo(() => {
    const prevFrom = toISO(subMonths(parseISO(dateRange.from), 1))
    const prevTo   = toISO(subMonths(parseISO(dateRange.to),   1))
    return computeHybridMetrics(csvRows, prevFrom, prevTo)
  }, [csvRows, dateRange])

  const changes = useMemo(() => {
    if (!metrics || !prevMetrics) return {}
    return {
      spend:             pctChange(metrics.spend,             prevMetrics.spend),
      impressions:       pctChange(metrics.impressions,       prevMetrics.impressions),
      ctr:               pctChange(metrics.ctr,               prevMetrics.ctr),
      visitas:           pctChange(metrics.visitas,           prevMetrics.visitas),
      carritos:          pctChange(metrics.carritos,          prevMetrics.carritos),
      pagos:             pctChange(metrics.pagos,             prevMetrics.pagos),
      purchases:         pctChange(metrics.purchases,         prevMetrics.purchases),
      roas:              pctChange(metrics.roas,              prevMetrics.roas),
      valorConversiones: pctChange(metrics.valorConversiones, prevMetrics.valorConversiones),
      convWeb:           pctChange(
        metrics.visitas     > 0 ? (metrics.purchases     / metrics.visitas)     * 100 : 0,
        prevMetrics.visitas > 0 ? (prevMetrics.purchases / prevMetrics.visitas) * 100 : 0,
      ),
    }
  }, [metrics, prevMetrics])

  // Sparklines: últimos 7 días del período seleccionado
  const sparklines = useMemo(() => {
    const last7 = filteredData.slice(-7)
    return {
      spend:       toSparkline(last7, "spend"),
      impressions: toSparkline(last7, "impressions"),
      ctr:         toSparkline(last7, "ctr"),
      visitas:     toSparkline(last7, "visitas"),
      carritos:    toSparkline(last7, "carritos"),
      pagos:       toSparkline(last7, "pagos"),
      purchases:   toSparkline(last7, "purchases"),
      roas:        toSparkline(last7, "roas"),
      convWeb:     last7.map(d => ({
        day:   `${+d.date.slice(8)}/${+d.date.slice(5, 7)}`,
        value: d.visitas > 0 ? (d.purchases / d.visitas) * 100 : 0,
      })),
    }
  }, [filteredData])

  const label = rangeLabel(dateRange.from, dateRange.to)

  // Campañas: CSV cuando disponible, estáticas si no
  const { displayCampaigns, campaignLabel } = useMemo(() => {
    const toMes = mesFromISO(dateRange.to)
    if (toMes === CURRENT_MES) {
      const mLabels = ["","ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
      const [m, y] = CURRENT_MES.split("-")
      return {
        displayCampaigns: staticCampaigns,
        campaignLabel: `${mLabels[+m]} ${y} · MCP`,
      }
    }
    if (csvRows) {
      const { campaigns, monthsLabel } = aggregateCsvRows(csvRows, dateRange.from, dateRange.to)
      return { displayCampaigns: campaigns, campaignLabel: monthsLabel + " · mensual" }
    }
    return { displayCampaigns: staticCampaigns, campaignLabel: label }
  }, [csvRows, dateRange, label])

  const csvRange = useMemo(() => (csvRows ? csvDateRange(csvRows) : null), [csvRows])

  const monthlyHistory = useMemo((): MonthlyAccountTotal[] => {
    const mesLbl = (mes: string) => {
      const names = ["","ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]
      const [m, y] = mes.split("-")
      return `${names[+m]} ${y}`
    }
    const mesSort = (mes: string) => {
      const [m, y] = mes.split("-")
      return +y * 100 + +m
    }

    const map = new Map<string, MonthlyAccountTotal>()

    // Meses del CSV (sólo los anteriores a DAILY_START_MES para evitar doble conteo)
    if (csvRows) {
      for (const m of getAccountMonthlyTotals(csvRows, "2000-01-01", "2099-12-31", DAILY_START_MES)) {
        map.set(m.mes, m)
      }
    }

    // dailyData agregado por mes
    const byMes = new Map<string, DailyInsight[]>()
    for (const d of dailyData) {
      const mes = mesFromISO(d.date)
      if (!byMes.has(mes)) byMes.set(mes, [])
      byMes.get(mes)!.push(d)
    }
    for (const [mes, days] of byMes) {
      const spend             = days.reduce((s, d) => s + d.spend,             0)
      const impressions       = days.reduce((s, d) => s + d.impressions,       0)
      const clicks            = days.reduce((s, d) => s + d.clicks,            0)
      const visitas           = days.reduce((s, d) => s + d.visitas,           0)
      const carritos          = days.reduce((s, d) => s + d.carritos,          0)
      const pagos             = days.reduce((s, d) => s + d.pagos,             0)
      const purchases         = days.reduce((s, d) => s + d.purchases,         0)
      const valorConversiones = days.reduce((s, d) => s + d.valorConversiones, 0)
      const ctrNum            = days.reduce((s, d) => s + d.ctr * d.impressions, 0)
      map.set(mes, {
        mes,
        label:            mesLbl(mes),
        spend,
        impressions,
        clicks,
        ctr:              impressions > 0 ? ctrNum / impressions : 0,
        visitas,
        carritos,
        pagos,
        purchases,
        valorConversiones,
        roas:             spend > 0 ? valorConversiones / spend : 0,
      })
    }

    return [...map.values()].sort((a, b) => mesSort(a.mes) - mesSort(b.mes))
  }, [csvRows])

  const availableMonths = useMemo(() => {
    const mesKeyLocal = (mes: string) => {
      const [m, y] = mes.split("-")
      return parseInt(y) * 100 + parseInt(m)
    }
    const fromCsv = csvRows
      ? [...new Set(csvRows.map(r => r.mes))].sort((a, b) => mesKeyLocal(a) - mesKeyLocal(b))
      : []
    return fromCsv.includes(CURRENT_MES) ? fromCsv : [...fromCsv, CURRENT_MES]
  }, [csvRows])

  return (
    <div className="min-h-screen bg-gray-50/60">

      {/* Header */}
      <header className="px-6 py-4" style={{ backgroundColor: "#18181B" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Logos/kriza blanco.png" alt="Kriza" className="h-8 w-auto object-contain" />
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#8B5CF6", color: "#fff" }}
            >
              Ecommerce · Shopify
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logos/Logo STP.png" alt="STP Agency" className="h-10 w-auto object-contain" />
        </div>
      </header>
      <div className="h-1" style={{ backgroundColor: "#8B5CF6" }} />

      {/* Barra de controles */}
      <div className="bg-white border-b border-gray-100 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">
            {csvRange
              ? <>Historial: <span className="font-medium text-gray-700">{csvRange.first} – {csvRange.last}</span></>
              : <span className="text-gray-400">Cargando historial…</span>
            }
          </p>
          <div className="flex items-center gap-2">
            <CsvUpload onDataLoaded={handleCsvData} hasData={!!csvRows} />
            <DateRangePicker value={dateRange} onChange={setDateRange} availableMonths={availableMonths} />
            <ExportButton />
          </div>
        </div>
      </div>

      <main id="dashboard-content" className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* Aviso: sin datos para el período y sin CSV */}
        {!metrics && !csvRows && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Para ver meses anteriores a abril, cargá el CSV con el botón de arriba.
          </div>
        )}
        {/* Aviso: CSV cargado pero sin registros para este período específico */}
        {!metrics && csvRows && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            Este período no tiene registros en el CSV.
          </div>
        )}

        {/* 9 metric cards */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <MetricCard
              title={`Invertido · ${label}`}
              value={fmtUSD(metrics.spend)}
              icon={<DollarSign size={13} className={ICON} />}
              sparklineData={sparklines.spend}
              sparklineId="spend"
              sparklineColor="#8B5CF6"
              formatValue={fmtUSD}
              change={changes.spend}
            />
            <MetricCard
              title="Impresiones"
              value={fmtNum(metrics.impressions)}
              icon={<Eye size={13} className={ICON} />}
              sparklineData={sparklines.impressions}
              sparklineId="impressions"
              sparklineColor="#8B5CF6"
              formatValue={fmtNum}
              change={changes.impressions}
            />
            <MetricCard
              title="CTR"
              value={fmtPct(metrics.ctr)}
              subtitle="clics / impresiones"
              icon={<MousePointerClick size={13} className={ICON} />}
              sparklineData={sparklines.ctr}
              sparklineId="ctr"
              sparklineColor="#8B5CF6"
              formatValue={fmtPct}
              change={changes.ctr}
            />
            <MetricCard
              title={`Visitas · ${label}`}
              value={fmtNum(metrics.visitas)}
              subtitle="landing page views"
              icon={<Globe size={13} className={ICON} />}
              sparklineData={sparklines.visitas}
              sparklineId="visitas"
              sparklineColor="#8B5CF6"
              formatValue={fmtNum}
              change={changes.visitas}
            />
            <MetricCard
              title={`Carritos · ${label}`}
              value={fmtNum(metrics.carritos)}
              subtitle="add to cart"
              icon={<ShoppingCart size={13} className={ICON} />}
              sparklineData={sparklines.carritos}
              sparklineId="carritos"
              sparklineColor="#8B5CF6"
              formatValue={fmtNum}
              change={changes.carritos}
            />
            <MetricCard
              title={`Pagos iniciados · ${label}`}
              value={fmtNum(metrics.pagos)}
              subtitle="initiate checkout"
              icon={<CreditCard size={13} className={ICON} />}
              sparklineData={sparklines.pagos}
              sparklineId="pagos"
              sparklineColor="#8B5CF6"
              formatValue={fmtNum}
              change={changes.pagos}
            />
            <MetricCard
              title="Compras"
              value={fmtNum(metrics.purchases)}
              icon={<ShoppingBag size={13} className={ICON} />}
              sparklineData={sparklines.purchases}
              sparklineId="purchases"
              sparklineColor="#18181B"
              formatValue={fmtNum}
              change={changes.purchases}
            />
            <MetricCard
              title="ROAS"
              value={`${metrics.roas.toFixed(2)}x`}
              icon={<TrendingUp size={13} className={ICON} />}
              sparklineData={sparklines.roas}
              sparklineId="roas"
              sparklineColor="#18181B"
              formatValue={v => `${v.toFixed(2)}x`}
              change={changes.roas}
            />
            <MetricCard
              title="Valor conversiones"
              value={fmtUSD(metrics.valorConversiones)}
              icon={<BarChart3 size={13} className={ICON} />}
              formatValue={fmtUSD}
              change={changes.valorConversiones}
            />
            <MetricCard
              title="Conv. web"
              value={fmtPct(metrics.visitas > 0 ? (metrics.purchases / metrics.visitas) * 100 : 0)}
              subtitle="compras / visitas"
              icon={<Percent size={13} className={ICON} />}
              sparklineData={sparklines.convWeb}
              sparklineId="convWeb"
              sparklineColor="#18181B"
              formatValue={fmtPct}
              change={changes.convWeb}
            />
          </div>
        )}

        {/* Gráficos */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Embudo de conversión · {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 pt-0">
                <FunnelChart
                  visitas={metrics.visitas}
                  carritos={metrics.carritos}
                  pagos={metrics.pagos}
                  compras={metrics.purchases}
                />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Compras diarias · {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 pt-0">
                <ConversionsChart data={filteredData} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabla de campañas */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-1 pt-4 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Campañas · {campaignLabel}
              </CardTitle>
              <span className="text-[11px] text-muted-foreground">Click en fila para ver anuncios</span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-4 pt-0">
            {displayCampaigns.length > 0
              ? <CampaignTable campaigns={displayCampaigns} />
              : <p className="text-xs text-muted-foreground py-4">Sin datos de campaña para el período seleccionado.</p>
            }
          </CardContent>
        </Card>

        {/* Mejores ads de junio */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Mejores ads · Junio 2026
          </p>
          <TopAds ads={adsJunio} />
        </div>

        {/* Histórico mensual */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Histórico mensual
          </p>
          <div className="flex flex-col gap-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Compras & ROAS
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 pt-0">
                <ComprasRoasChart data={monthlyHistory} />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Visitas · carritos · pagos · compras
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 pt-0">
                <CarritosComprasChart data={monthlyHistory} />
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-1 pt-4 px-5">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Conversión web · visitas → compras
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4 pt-0">
                <ConversionWebChart data={monthlyHistory} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabla de negocio */}
        {tablaNegocioRows.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-1 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Negocio · Meta vs Reales
                </CardTitle>
                <span className="text-[11px] text-muted-foreground">Conv. más reciente primero</span>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-4 pt-0">
              <TablaNegocio rows={tablaNegocioRows} />
            </CardContent>
          </Card>
        )}

      </main>
    </div>
  )
}
