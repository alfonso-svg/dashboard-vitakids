// Resultados de Septiembre 2026 obtenidos via Meta API/MCP (1/9–30/9 · actualizado 6 oct 2026)
// Ordenados por gasto descendente
// Ads con mismo nombre corriendo en varias campañas se consolidan (spend/compras/valor sumados, ctr ponderado por impresiones)
// Se reemplazan Ad 17, Ad 12 y Ad 8 por las piezas nuevas Ad 16 (Carrusel Niño), Ad 19 (Promos Oct) y Ad 20 (Aike).
// Ad 19 y Ad 20 se crearon en Meta el 5–6 oct 2026: sin delivery en septiembre (0 gasto), se marcan como nuevos.
// "Ad 18 - Catálogo Niñas" sigue registrado en Meta como "Ad 14 - Catálogo Niñas".

import type { AdResultVK } from "./adsJulioVitaKids"
export type { AdResultVK }

export const adsSeptiembreVK: AdResultVK[] = [
  {
    name:    "Ad 1 · Catálogo · All Products",
    image:   "/VitaKids Ads/Ad 1 - Catalogo - All Products.png",
    spend:   668.10,
    ctr:       2.76,
    compras:    145,
    valor:  4950.17,
    roas:      7.41,
  },
  {
    name:    "Ad 16 · Carrusel · Niño",
    image:   "/VitaKids Ads/Ad 16 - Carrusel Niño.png",
    spend:   187.76,
    ctr:       2.64,
    compras:     56,
    valor:  2128.51,
    roas:     11.34,
  },
  {
    name:    "Ad 18 · Catálogo Niñas",
    image:   "/VitaKids Ads/Ad 18 - Catálogo Niñas.png",
    spend:    71.18,
    ctr:       2.85,
    compras:     23,
    valor:   700.52,
    roas:      9.84,
  },
  {
    name:    "Ad 13 · Catálogo · Colegial",
    image:   "/VitaKids Ads/Ad 13 - Catalogo - Colegial.png",
    spend:    28.39,
    ctr:       3.26,
    compras:      9,
    valor:   307.18,
    roas:     10.82,
  },
  {
    name:    "Ad 19 · Promos Oct",
    image:   "/VitaKids Ads/Ad 19 - Promos Oct.png",
    spend:     0.00,
    ctr:       0.00,
    compras:      0,
    valor:     0.00,
    roas:      0.00,
    nuevo:   true,
  },
  {
    name:    "Ad 20 · Imagen · Aike",
    image:   "/VitaKids Ads/Ad 20 - Aike.png",
    spend:     0.00,
    ctr:       0.00,
    compras:      0,
    valor:     0.00,
    roas:      0.00,
    nuevo:   true,
  },
]
