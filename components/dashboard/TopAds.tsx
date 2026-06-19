"use client"

import Image from "next/image"
import { type AdResult } from "@/lib/data/adsJunio"

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n)
const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(n)

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${highlight ? "text-[#8B5CF6]" : "text-gray-800"}`}>
        {value}
      </span>
    </div>
  )
}

export function TopAds({ ads }: { ads: AdResult[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {ads.map((ad) => (
        <div
          key={ad.image}
          className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
        >
          {/* Imagen del ad — proporción natural sin recorte */}
          <Image
            src={ad.image}
            alt={ad.name}
            width={0}
            height={0}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="w-full h-auto"
          />

          {/* Métricas */}
          <div className="p-3 flex flex-col gap-2.5 border-t border-gray-50">
            <p className="text-[11px] font-semibold text-gray-700 leading-tight line-clamp-2">
              {ad.name}
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              <Metric label="Gasto"   value={fmtUSD(ad.spend)} />
              <Metric label="CTR"     value={`${ad.ctr.toFixed(2)}%`} />
              <Metric label="Compras" value={fmtNum(ad.compras)} />
              <Metric label="Valor"   value={fmtUSD(ad.valor)} />
            </div>
            <div className="pt-1 border-t border-gray-50">
              <Metric label="ROAS" value={`${ad.roas.toFixed(2)}x`} highlight />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
