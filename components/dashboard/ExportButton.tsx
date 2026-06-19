"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"

export function ExportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ])

      const element = document.getElementById("dashboard-content")
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f9fafb",
        logging: false,
      })

      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" })
      const pageW = 210
      const margin = 10

      // Header bar con color de marca
      pdf.setFillColor(24, 24, 27)
      pdf.rect(0, 0, pageW, 22, "F")

      // Accent strip
      pdf.setFillColor(139, 92, 246)
      pdf.rect(0, 22, pageW, 2, "F")

      // Nombre cuenta
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(13)
      pdf.setFont("helvetica", "bold")
      pdf.text("Kriza", margin, 10)

      // Subtítulo
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(180, 180, 200)
      pdf.text("Dashboard Meta Ads · STP Agency", margin, 16)

      // Fecha en esquina derecha
      const dateStr = new Date().toLocaleDateString("es-AR", {
        day: "2-digit", month: "short", year: "numeric",
      })
      pdf.text(dateStr, pageW - margin, 16, { align: "right" })

      // Contenido del dashboard
      const imgData = canvas.toDataURL("image/jpeg", 0.92)
      const contentW = pageW - margin * 2
      const contentH = (canvas.height / canvas.width) * contentW
      const maxH = 297 - 30 // A4 height minus header

      pdf.addImage(imgData, "JPEG", margin, 28, contentW, Math.min(contentH, maxH))

      pdf.save(`kriza-${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Download size={12} />
      )}
      {loading ? "Generando..." : "Exportar PDF"}
    </button>
  )
}
