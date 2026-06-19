import { NextResponse } from "next/server"
import { subDays } from "date-fns"
import { fetchDailyInsights } from "@/lib/meta/api"

export async function GET() {
  try {
    const until = new Date().toISOString().slice(0, 10)
    const since = subDays(new Date(), 59).toISOString().slice(0, 10)
    const data = await fetchDailyInsights(since, until)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
