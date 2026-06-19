import type { DailyInsight, CampaignInsight, AdInsight } from "./types"

const BASE = "https://graph.facebook.com/v21.0"

function getEnv() {
  const token     = process.env.META_ACCESS_TOKEN
  const accountId = process.env.META_AD_ACCOUNT_ID
  if (!token || !accountId) throw new Error("META_ACCESS_TOKEN o META_AD_ACCOUNT_ID no configurados en .env.local")
  return { token, accountId }
}

function action(actions: { action_type: string; value: string }[] | undefined, type: string): number {
  return Number(actions?.find(a => a.action_type === type)?.value ?? 0)
}

export async function fetchDailyInsights(since: string, until: string): Promise<DailyInsight[]> {
  const { token, accountId } = getEnv()

  const params = new URLSearchParams({
    fields: "spend,impressions,clicks,ctr,purchase_roas,actions,action_values",
    time_range: JSON.stringify({ since, until }),
    time_increment: "1",
    level: "account",
    limit: "100",
    access_token: token,
  })

  const res = await fetch(`${BASE}/act_${accountId}/insights?${params}`, {
    next: { revalidate: 3600 },
  })
  const json = await res.json()
  if (json.error) throw new Error(`Meta API: ${json.error.message}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (json.data ?? []).map((d: any): DailyInsight => {
    const spend = Number(d.spend ?? 0)
    const roas  = Number(d.purchase_roas?.[0]?.value ?? 0)
    return {
      date:              d.date_start,
      spend,
      impressions:       Number(d.impressions ?? 0),
      clicks:            Number(d.clicks ?? 0),
      ctr:               Number(d.ctr ?? 0),
      visitas:           action(d.actions, "landing_page_view"),
      carritos:          action(d.actions, "offsite_conversion.fb_pixel_add_to_cart"),
      pagos:             action(d.actions, "offsite_conversion.fb_pixel_initiate_checkout"),
      purchases:         action(d.actions, "offsite_conversion.fb_pixel_purchase"),
      roas,
      valorConversiones: Number(d.action_values?.find((a: { action_type: string }) => a.action_type === "offsite_conversion.fb_pixel_purchase")?.value ?? 0),
    }
  })
}

export async function fetchAdInsights(campaignId: string, since: string, until: string): Promise<AdInsight[]> {
  const { token, accountId } = getEnv()

  const params = new URLSearchParams({
    fields: "ad_id,ad_name,spend,impressions,clicks,actions",
    time_range: JSON.stringify({ since, until }),
    level: "ad",
    filtering: JSON.stringify([
      { field: "campaign.id", operator: "IN", value: [campaignId] },
      { field: "ad.effective_status", operator: "IN", value: ["ACTIVE", "PAUSED"] },
    ]),
    limit: "50",
    access_token: token,
  })

  const res = await fetch(`${BASE}/act_${accountId}/insights?${params}`, {
    next: { revalidate: 3600 },
  })
  const json = await res.json()
  if (json.error) throw new Error(`Meta API: ${json.error.message}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (json.data ?? []).map((a: any): AdInsight => {
    const spend     = Number(a.spend ?? 0)
    const purchases = action(a.actions, "offsite_conversion.fb_pixel_purchase")
    return {
      id:          a.ad_id,
      name:        a.ad_name,
      spend,
      impressions: Number(a.impressions ?? 0),
      clicks:      Number(a.clicks ?? 0),
      purchases,
      cpa:         purchases > 0 ? spend / purchases : null,
    }
  })
}

export async function fetchCampaignInsights(since: string, until: string): Promise<CampaignInsight[]> {
  const { token, accountId } = getEnv()

  const params = new URLSearchParams({
    fields: "campaign_id,campaign_name,objective,spend,impressions,clicks,ctr,purchase_roas,actions,action_values",
    time_range: JSON.stringify({ since, until }),
    level: "campaign",
    filtering: JSON.stringify([{ field: "campaign.effective_status", operator: "IN", value: ["ACTIVE"] }]),
    limit: "50",
    access_token: token,
  })

  const res = await fetch(`${BASE}/act_${accountId}/insights?${params}`, {
    next: { revalidate: 3600 },
  })
  const json = await res.json()
  if (json.error) throw new Error(`Meta API: ${json.error.message}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (json.data ?? []).map((c: any): CampaignInsight => {
    const spend     = Number(c.spend ?? 0)
    const purchases = action(c.actions, "offsite_conversion.fb_pixel_purchase")
    const roas      = Number(c.purchase_roas?.[0]?.value ?? 0)
    const valorCompras = Number(c.action_values?.find((a: { action_type: string }) => a.action_type === "offsite_conversion.fb_pixel_purchase")?.value ?? 0)
    return {
      id:          c.campaign_id,
      name:        c.campaign_name,
      status:      "ACTIVE",
      objective:   c.objective ?? "",
      spend,
      impressions: Number(c.impressions ?? 0),
      ctr:         Number(c.ctr ?? 0),
      clicks:      Number(c.clicks ?? 0),
      visitas:     action(c.actions, "landing_page_view"),
      carritos:    action(c.actions, "offsite_conversion.fb_pixel_add_to_cart"),
      pagos:       action(c.actions, "offsite_conversion.fb_pixel_initiate_checkout"),
      purchases,
      cpa:         purchases > 0 ? spend / purchases : null,
      roas:        roas > 0 ? roas : null,
      valorCompras: valorCompras > 0 ? valorCompras : null,
    }
  })
}
