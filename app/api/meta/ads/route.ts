import { NextResponse } from "next/server"
import { subDays } from "date-fns"
import { fetchAdInsights } from "@/lib/meta/api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaignId")
    if (!campaignId) return NextResponse.json({ error: "campaignId requerido" }, { status: 400 })

    const until = new Date().toISOString().slice(0, 10)
    const since = subDays(new Date(), 29).toISOString().slice(0, 10)
    const data = await fetchAdInsights(campaignId, since, until)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
