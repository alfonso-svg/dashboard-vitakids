"use client"

import { useRef, useState } from "react"
import { Upload, Check, X } from "lucide-react"
import { parseCsvData, type CsvMonthRow } from "@/lib/data/csvParser"

export const CSV_STORAGE_KEY = "kriza-csv-data"

interface Props {
  onDataLoaded: (rows: CsvMonthRow[] | null) => void
  hasData: boolean
}

export function CsvUpload({ onDataLoaded, hasData }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = parseCsvData(text)
      if (rows.length === 0) {
        setStatus("error")
        setTimeout(() => setStatus("idle"), 3000)
        return
      }
      try {
        localStorage.setItem(CSV_STORAGE_KEY, JSON.stringify(rows))
      } catch {
        // storage full — proceed without persisting
      }
      onDataLoaded(rows)
      setStatus("ok")
      setTimeout(() => setStatus("idle"), 3000)
    }
    reader.readAsText(file, "utf-8")
  }

  function handleClear() {
    localStorage.removeItem(CSV_STORAGE_KEY)
    onDataLoaded(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) handleFile(f)
          e.target.value = ""
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-xs font-medium hover:bg-gray-50 transition-colors"
      >
        {status === "ok"
          ? <Check size={12} className="text-green-600" />
          : status === "error"
          ? <X size={12} className="text-red-500" />
          : <Upload size={12} />}
        {status === "ok" ? "CSV actualizado" : status === "error" ? "Formato inválido" : "Actualizar CSV"}
      </button>
      {hasData && (
        <button
          onClick={handleClear}
          title="Limpiar CSV cargado"
          className="flex items-center justify-center h-8 w-7 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
