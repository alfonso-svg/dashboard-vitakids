// Resultados de Octubre 2026 obtenidos via Meta API/MCP (1/10–31/10 · actualizado 3 nov 2026)
// Top 6 por gasto, solo campañas de conversión (Visitas al Perfil queda fuera).
// Ads con mismo nombre corriendo en varias campañas se consolidan (spend/compras/valor sumados, ctr ponderado por impresiones).
// "Ad 1 - Catálogo" (Tráfico Frío/Caliente) se suma a "Ad 1 - Catálogo - All Products".
// "Ad 18 · Catálogo Niñas" sigue registrado en Meta como "Ad 14 - Catálogo Niñas".
// Fuera del top 6: Ad 21 Stock Sano ($55.61, 5 compras), Ad 16 Carrusel Niño ($38.71, 1),
// Ad 22 Catálogo Niños ($36.42, 9 compras, $180.66, ROAS 4.96), Ad 20 Aike ($13.72, 1), Ad 8 ($2.02, 0).

import type { AdResultVK } from "./adsJulioVitaKids"
export type { AdResultVK }

export const adsOctubreVK: AdResultVK[] = [
  {
    name:    "Ad 1 · Catálogo · All Products",
    image:   "/VitaKids Ads/Ad 1 - Catalogo - All Products.png",
    spend:   332.29,
    ctr:       2.32,
    compras:     27,
    valor:   835.31,
    roas:      2.51,
  },
  {
    name:    "Ad 18 · Catálogo Niñas",
    image:   "/VitaKids Ads/Ad 18 - Catálogo Niñas.png",
    spend:   188.60,
    ctr:       2.31,
    compras:     19,
    valor:   508.35,
    roas:      2.70,
  },
  {
    name:    "Ad 23 · All Products V2",
    image:   "/VitaKids Ads/Ad 23 - Catálogo - All Products.png",
    spend:   131.87,
    ctr:       2.36,
    compras:     15,
    valor:   350.30,
    roas:      2.66,
    nuevo:   true,
  },
  {
    name:    "Ad 19 · Promos Oct",
    image:   "/VitaKids Ads/Ad 19 - Promos Oct.png",
    spend:   125.36,
    ctr:       2.95,
    compras:     15,
    valor:   298.88,
    roas:      2.38,
  },
  {
    name:    "Ad 15 · Carrusel · Niña",
    image:   "/VitaKids Ads/AD 15 - Carrusel Niñas.png",
    spend:   114.46,
    ctr:       1.25,
    compras:     11,
    valor:   229.95,
    roas:      2.01,
  },
  {
    name:    "Ad 13 · Catálogo · Colegial",
    image:   "/VitaKids Ads/Ad 13 - Catalogo - Colegial.png",
    spend:    81.25,
    ctr:       2.46,
    compras:     12,
    valor:   329.31,
    roas:      4.05,
  },
]
