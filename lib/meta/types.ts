export type DailyInsight = {
  date: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  visitas: number
  carritos: number
  pagos: number
  purchases: number
  roas: number
  valorConversiones: number
}

export type CampaignInsight = {
  id: string
  name: string
  status: string
  objective: string
  spend: number
  impressions: number
  ctr: number
  clicks: number
  visitas: number
  carritos: number
  pagos: number
  purchases: number
  cpa: number | null
  roas: number | null
  valorCompras: number | null
}

export type AdInsight = {
  id: string
  name: string
  spend: number
  impressions: number
  clicks: number
  purchases: number
  cpa: number | null
}
