import type { DailyInsight } from "@/lib/meta/types"

export type Totales = {
  spend: number
  impressions: number
  clicks: number
  visitas: number
  carritos: number
  pagos: number
  purchases: number
  valorConversiones: number
}

export type Resumen = Totales & {
  cpa: number | null
  roas: number | null
  ticket: number | null
  visitaCarrito: number | null  // add_to_cart ÷ landing_page_view, en %
  checkoutCompra: number | null // purchase ÷ initiated_checkout, en %
  cpc: number | null
  cpm: number | null
}

const div = (a: number, b: number) => (b > 0 ? a / b : null)

export function sumar(days: DailyInsight[]): Totales {
  return days.reduce<Totales>(
    (t, d) => ({
      spend: t.spend + d.spend,
      impressions: t.impressions + d.impressions,
      clicks: t.clicks + d.clicks,
      visitas: t.visitas + d.visitas,
      carritos: t.carritos + d.carritos,
      pagos: t.pagos + d.pagos,
      purchases: t.purchases + d.purchases,
      valorConversiones: t.valorConversiones + d.valorConversiones,
    }),
    { spend: 0, impressions: 0, clicks: 0, visitas: 0, carritos: 0, pagos: 0, purchases: 0, valorConversiones: 0 },
  )
}

// Tasas ponderadas por volumen (total ÷ total), no promedio de tasas diarias.
export function resumir(t: Totales): Resumen {
  const visitaCarrito = div(t.carritos, t.visitas)
  const checkoutCompra = div(t.purchases, t.pagos)
  const cpm = div(t.spend, t.impressions)
  return {
    ...t,
    cpa: div(t.spend, t.purchases),
    roas: div(t.valorConversiones, t.spend),
    ticket: div(t.valorConversiones, t.purchases),
    visitaCarrito: visitaCarrito !== null ? visitaCarrito * 100 : null,
    checkoutCompra: checkoutCompra !== null ? checkoutCompra * 100 : null,
    cpc: div(t.spend, t.clicks),
    cpm: cpm !== null ? cpm * 1000 : null,
  }
}

export function enRango(days: DailyInsight[], from: string, to: string) {
  return days.filter(d => d.date >= from && d.date <= to)
}
