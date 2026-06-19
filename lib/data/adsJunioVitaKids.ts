// Resultados de Junio 2026 obtenidos via Meta API (this_month · actualizado 19 jun 2026)
// Ordenados por gasto descendente

export type AdResultVK = {
  name:    string
  image:   string
  spend:   number
  ctr:     number
  compras: number
  valor:   number
  roas:    number
}

export const adsJunioVK: AdResultVK[] = [
  {
    name:    "Ad 1 · Catálogo · All Products",
    image:   "/VitaKids Ads/Ad 1 - Catalogo - All Products.png",
    spend:   198.05,
    ctr:       5.33,
    compras:     77,
    valor:   2297.38,
    roas:      11.60,
  },
  {
    name:    "Ad 4 · Imagen · Mateo",
    image:   "/VitaKids Ads/Ad 4 - Imagen - Mateo.png",
    spend:   135.46,
    ctr:       3.24,
    compras:     22,
    valor:    816.82,
    roas:       6.03,
  },
  {
    name:    "Ad 10 · Video · Escolar",
    image:   "/VitaKids Ads/Ad 10 - Video - Escolar.png",
    spend:    35.82,
    ctr:       3.68,
    compras:      6,
    valor:    176.59,
    roas:       4.93,
  },
  {
    name:    "Ad 7 · Video · Colegial",
    image:   "/VitaKids Ads/Ad 7 - Video - Colegial.png",
    spend:    35.81,
    ctr:       4.47,
    compras:      0,
    valor:      0.00,
    roas:       0.00,
  },
  {
    name:    "Ad 9 · Video · Colegial",
    image:   "/VitaKids Ads/Ad 9 - Video - Colegial.png",
    spend:    25.57,
    ctr:       3.63,
    compras:      5,
    valor:    175.16,
    roas:       6.85,
  },
  {
    name:    "Ad 11 · Imagen · Escolar Fotográfico",
    image:   "/VitaKids Ads/Ad 11 - Imagen - Escolar Fotográfico.png",
    spend:    16.42,
    ctr:       2.69,
    compras:      1,
    valor:     37.44,
    roas:       2.28,
  },
]
