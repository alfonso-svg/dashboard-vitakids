// Resultados de Junio 2026 obtenidos via Meta API (this_month · actualizado 19 jun 2026)
// Visitas y carritos no disponibles a nivel de ad en la API

export type AdResult = {
  name:    string
  image:   string   // path relativo a /public
  spend:   number
  ctr:     number
  compras: number
  valor:   number
  roas:    number
}

export const adsJunio: AdResult[] = [
  {
    name:    "Ad 68 · Catálogo · Nueva Colección Abril",
    image:   "/Ads Kriza/Ad 68 - Catálogo - Nueva Colección Abril.png",
    spend:   345.16,
    ctr:     4.84,
    compras: 109,
    valor:   4725.62,
    roas:    13.69,
  },
  {
    name:    "Ad 56 · Catálogo · Colección 26",
    image:   "/Ads Kriza/Ad 56 - Catálogo - Colección 26.png",
    spend:   159.82,
    ctr:     3.47,
    compras: 51,
    valor:   1627.87,
    roas:    10.19,
  },
  {
    name:    "AD 67 · Imagen · Laura",
    image:   "/Ads Kriza/AD 67 - Imagen - Laura.png",
    spend:   76.33,   // suma dos variantes
    ctr:     2.42,    // promedio ponderado por impresiones
    compras: 21,      // suma dos variantes
    valor:   652.25,  // suma dos variantes
    roas:    8.55,
  },
  {
    name:    "Ad 75 · Carrusel · NC Junio",
    image:   "/Ads Kriza/Ad 75 - Carrusel - NC Junio.png",
    spend:   31.74,
    ctr:     2.66,
    compras: 7,
    valor:   297.71,
    roas:    9.38,
  },
  {
    name:    "Ad 73 · Nueva Colección JUN · RL",
    image:   "/Ads Kriza/Ad 73 - Nueva Colección JUN - RL.png",
    spend:   14.10,
    ctr:     2.60,
    compras: 5,
    valor:   167.11,
    roas:    11.85,
  },
  {
    name:    "AD 71 · Carrusel · Nueva Colección Mayo",
    image:   "/Ads Kriza/AD 71 - Carrusel - Nueva Colección Mayo.png",
    spend:   7.40,
    ctr:     2.64,
    compras: 1,
    valor:   31.99,
    roas:    4.32,
  },
]
