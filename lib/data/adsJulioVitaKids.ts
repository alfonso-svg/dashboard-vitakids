// Resultados de Julio 2026 obtenidos via Meta API (1/7–31/7 · actualizado 3 ago 2026)
// Ordenados por gasto descendente
// Ads con mismo nombre corriendo en varias campañas se consolidan (spend/compras/valor sumados, ctr ponderado por impresiones)

export type AdResultVK = {
  name:    string
  image:   string
  spend:   number
  ctr:     number
  compras: number
  valor:   number
  roas:    number
  nuevo?:  boolean // pieza recién lanzada: se muestra con badge "Nuevo"
}

export const adsJulioVK: AdResultVK[] = [
  {
    name:    "Ad 1 · Catálogo · All Products",
    image:   "/VitaKids Ads/Ad 1 - Catalogo - All Products.png",
    spend:   483.12,
    ctr:       3.59,
    compras:    153,
    valor:  4443.26,
    roas:      9.20,
  },
  {
    name:    "Ad 14 · Video · Semana VK",
    image:   "/VitaKids Ads/Ad 14 - Video - Semana VK.png",
    spend:   147.74,
    ctr:       4.12,
    compras:     70,
    valor:  1965.35,
    roas:     13.30,
  },
  {
    name:    "Ad 13 · Catálogo · Colegial",
    image:   "/VitaKids Ads/Ad 13 - Catalogo - Colegial.png",
    spend:    86.55,
    ctr:       3.13,
    compras:     40,
    valor:  1142.36,
    roas:     13.20,
  },
  {
    name:    "Ad 15 · Semana VK",
    image:   "/VitaKids Ads/Ad 15 - Semana VK.png",
    spend:    49.27,
    ctr:       2.97,
    compras:     23,
    valor:   744.04,
    roas:     15.10,
  },
  {
    name:    "Ad 8 · Video · Los Más Elegidos",
    image:   "/VitaKids Ads/Ad 8 - Video - LosMasElegidos.png",
    spend:    23.62,
    ctr:       3.54,
    compras:     13,
    valor:   442.59,
    roas:     18.74,
  },
  {
    name:    "Ad 12 · Carrusel · Colegial Mix",
    image:   "/VitaKids Ads/Ad 12 - Carrusel - Colegial Mix.png",
    spend:     1.74,
    ctr:       2.49,
    compras:      3,
    valor:    95.52,
    roas:     54.90,
  },
]
