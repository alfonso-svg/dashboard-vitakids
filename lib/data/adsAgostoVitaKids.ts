// Resultados de Agosto 2026 obtenidos via Meta API (1/8–31/8 · actualizado 1 sep 2026)
// Ordenados por gasto descendente
// Ads con mismo nombre corriendo en varias campañas se consolidan (spend/compras/valor sumados, ctr ponderado por impresiones)
// "Ad 14 - Video - Semana VK" y "Ad 15 - Semana VK" no tuvieron delivery en agosto (0 gasto) —
// se reemplazan por las piezas nuevas Ad 17 (Kit Escolar) y Ad 18 (Catálogo Niñas).
// Nota: en Meta Ads Manager, "Ad 18 - Catálogo Niñas" quedó registrado internamente como
// "Ad 14 - Catálogo Niñas" (reuso de numeración del anunciante) — se identifica por producto.

import type { AdResultVK } from "./adsJulioVitaKids"
export type { AdResultVK }

export const adsAgostoVK: AdResultVK[] = [
  {
    name:    "Ad 1 · Catálogo · All Products",
    image:   "/VitaKids Ads/Ad 1 - Catalogo - All Products.png",
    spend:   718.31,
    ctr:       4.31,
    compras:    284,
    valor:  8062.35,
    roas:     11.22,
  },
  {
    name:    "Ad 18 · Catálogo Niñas",
    image:   "/VitaKids Ads/Ad 18 - Catálogo Niñas.png",
    spend:    97.44,
    ctr:       3.42,
    compras:     32,
    valor:   934.47,
    roas:      9.59,
  },
  {
    name:    "Ad 17 · Kit Escolar",
    image:   "/VitaKids Ads/Ad 17 - Kit Escolar.png",
    spend:    41.01,
    ctr:       2.24,
    compras:     19,
    valor:   610.94,
    roas:     14.90,
  },
  {
    name:    "Ad 8 · Video · Los Más Elegidos",
    image:   "/VitaKids Ads/Ad 8 - Video - LosMasElegidos.png",
    spend:    33.08,
    ctr:       3.06,
    compras:     15,
    valor:   376.01,
    roas:     11.37,
  },
  {
    name:    "Ad 13 · Catálogo · Colegial",
    image:   "/VitaKids Ads/Ad 13 - Catalogo - Colegial.png",
    spend:    16.10,
    ctr:       3.70,
    compras:      4,
    valor:   169.21,
    roas:     10.51,
  },
  {
    name:    "Ad 12 · Carrusel · Colegial Mix",
    image:   "/VitaKids Ads/Ad 12 - Carrusel - Colegial Mix.png",
    spend:     1.68,
    ctr:       1.94,
    compras:      0,
    valor:     0.00,
    roas:      0.00,
  },
]
