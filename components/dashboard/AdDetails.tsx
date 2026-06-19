"use client"

export function AdDetails({ campaignId }: { campaignId: string }) {
  void campaignId
  return (
    <div className="px-6 py-4 bg-slate-50/80 border-t">
      <p className="text-xs text-muted-foreground">Sin anuncios disponibles.</p>
    </div>
  )
}
