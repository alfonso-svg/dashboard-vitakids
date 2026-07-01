// Resultados de Junio 2026 obtenidos via Meta API (1/6–28/6 · actualizado 28 jun 2026)
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
    spend:   360.91,
    ctr:       4.50,
    compras:    102,
    valor:   3046.08,
    roas:       8.44,
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
    name:    "Ad 11 · Imagen · Escolar Fotográfico",
    image:   "/VitaKids Ads/Ad 11 - Imagen - Escolar Fotográfico.png",
    spend:    48.51,
    ctr:       2.38,
    compras:      1,
    valor:     37.35,
    roas:       0.77,
  },
  {
    name:    "Ad 10 · Video · Escolar",
    image:   "/VitaKids Ads/Ad 10 - Video - Escolar.png",
    spend:    36.79,
    ctr:       3.65,
    compras:      7,
    valor:    206.02,
    roas:       5.60,
  },
  {
    name:    "Ad 9 · Video · Colegial",
    image:   "/VitaKids Ads/Ad 9 - Video - Colegial.png",
    spend:    26.82,
    ctr:       3.55,
    compras:      5,
    valor:    175.13,
    roas:       6.53,
  },
  {
    name:    "Ad 7 · Video · Colegial",
    image:   "/VitaKids Ads/Ad 7 - Video - Colegial.png",
    spend:    26.64,
    ctr:       4.22,
    compras:      0,
    valor:      0.00,
    roas:       0.00,
  },
]
