export const ACCOUNT_NAME = "Tu Dentista 3.0"
export const CURRENCY = "CLP"

export const todayMetrics = {
  spend: 6130,
  impressions: 2172,
  clicks: 20,
  cpc: 307,
  cpm: 2822,
  ctr: 0.92,
}

// Jun 8–14 (7 días completos más recientes) — sparklines de cards
export const sparklineData = {
  ctr: [
    { day: "8/6",  value: 1.72 },
    { day: "9/6",  value: 1.44 },
    { day: "10/6", value: 1.63 },
    { day: "11/6", value: 1.58 },
    { day: "12/6", value: 1.70 },
    { day: "13/6", value: 1.78 },
    { day: "14/6", value: 1.67 },
  ],
  spend: [
    { day: "8/6",  value: 31911 },
    { day: "9/6",  value: 39629 },
    { day: "10/6", value: 28778 },
    { day: "11/6", value: 26055 },
    { day: "12/6", value: 22050 },
    { day: "13/6", value: 30092 },
    { day: "14/6", value: 25211 },
  ],
  impressions: [
    { day: "8/6",  value: 12654 },
    { day: "9/6",  value: 16683 },
    { day: "10/6", value: 12854 },
    { day: "11/6", value: 10953 },
    { day: "12/6", value: 9998  },
    { day: "13/6", value: 12710 },
    { day: "14/6", value: 10064 },
  ],
  conversations: [
    { day: "8/6",  value: 19 },
    { day: "9/6",  value: 24 },
    { day: "10/6", value: 15 },
    { day: "11/6", value: 17 },
    { day: "12/6", value: 6  },
    { day: "13/6", value: 15 },
    { day: "14/6", value: 11 },
  ],
  cpa: [
    { day: "8/6",  value: 1680 },
    { day: "9/6",  value: 1651 },
    { day: "10/6", value: 1919 },
    { day: "11/6", value: 1533 },
    { day: "12/6", value: 3675 },
    { day: "13/6", value: 2006 },
    { day: "14/6", value: 2292 },
  ],
}

// Histórico diario acumulado — formato ISO YYYY-MM-DD
export const dailyData = [
  { date: "2026-06-01", spend: 19719, impressions: 5131,  conversations: 9  },
  { date: "2026-06-02", spend: 25537, impressions: 15067, conversations: 21 },
  { date: "2026-06-03", spend: 30942, impressions: 10425, conversations: 20 },
  { date: "2026-06-04", spend: 28768, impressions: 9647,  conversations: 8  },
  { date: "2026-06-05", spend: 30306, impressions: 12570, conversations: 23 },
  { date: "2026-06-06", spend: 30159, impressions: 12016, conversations: 16 },
  { date: "2026-06-07", spend: 31649, impressions: 12978, conversations: 19 },
  { date: "2026-06-08", spend: 31911, impressions: 12654, conversations: 19 },
  { date: "2026-06-09", spend: 39629, impressions: 16683, conversations: 24 },
  { date: "2026-06-10", spend: 28778, impressions: 12854, conversations: 15 },
  { date: "2026-06-11", spend: 26055, impressions: 10953, conversations: 17 },
  { date: "2026-06-12", spend: 22050, impressions: 9998,  conversations: 6  },
  { date: "2026-06-13", spend: 30092, impressions: 12710, conversations: 15 },
  { date: "2026-06-14", spend: 25211, impressions: 10064, conversations: 11 },
]

// Totales del período (últimos 30d: 16/5–14/6)
export const periodTotals = {
  spend: 400806,
  impressions: 163750,
  conversations: 223,
  cpa: 1620,
  ctr: 1.63,
}

export type Campaign = {
  id: string
  name: string
  status: string
  spend: number
  impressions: number
  clicks: number
  results: number
  resultType: string
  cpa: number
  objective: string
}

export const campaigns: Campaign[] = [
  {
    id: "120245883274400109",
    name: "STP - Ortodoncia",
    status: "ACTIVE",
    spend: 131870,
    impressions: 48157,
    clicks: 460,
    results: 71,
    resultType: "Msgs. WhatsApp",
    cpa: 1857.32,
    objective: "OUTCOME_ENGAGEMENT",
  },
  {
    id: "120245886982490109",
    name: "STP - Estética",
    status: "ACTIVE",
    spend: 110939,
    impressions: 43102,
    clicks: 540,
    results: 105,
    resultType: "Msgs. WhatsApp",
    cpa: 1056.56,
    objective: "OUTCOME_ENGAGEMENT",
  },
  {
    id: "120245897324880109",
    name: "STP - Kids",
    status: "ACTIVE",
    spend: 75969,
    impressions: 21496,
    clicks: 240,
    results: 21,
    resultType: "Msgs. WhatsApp",
    cpa: 3617.57,
    objective: "OUTCOME_ENGAGEMENT",
  },
  {
    id: "120245897111740109",
    name: "STP - Implantes",
    status: "ACTIVE",
    spend: 42458,
    impressions: 12450,
    clicks: 108,
    results: 26,
    resultType: "Msgs. WhatsApp",
    cpa: 1633,
    objective: "OUTCOME_ENGAGEMENT",
  },
  {
    id: "120245905886640109",
    name: "STP - Tráfico IG",
    status: "ACTIVE",
    spend: 39570,
    impressions: 38545,
    clicks: 1327,
    results: 373,
    resultType: "Visitas perfil",
    cpa: 106.09,
    objective: "LINK_CLICKS",
  },
]

export type Ad = {
  id: string
  name: string
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpa: number | null
  results: number
  resultType: string
  status: string
  image?: string
}

// Ads agrupados por campaña (datos reales de Meta API — últimos 30d: 16/5–14/6)
export const adsByCampaign: Record<string, Ad[]> = {
  // STP - Estética
  "120245886982490109": [
    { id: "120245888262960109", name: "VID_Carillas_Junio",  spend: 102670, impressions: 39677, clicks: 480, ctr: 1.21, cpa: 1104, results: 93, resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Estética/VID_Carillas_Junio.png" },
    { id: "120245902588520109", name: "VID_Carillas_Viejo",  spend: 8269,   impressions: 3425,  clicks: 60,  ctr: 1.75, cpa: 689,  results: 12, resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Estética/VID_Carillas_Viejo.png" },
  ],
  // STP - Ortodoncia
  "120245883274400109": [
    { id: "120245902749780109", name: "IMG_Ortodoncia",            spend: 57142, impressions: 16571, clicks: 171, ctr: 1.03, cpa: 1681, results: 34, resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Ortodoncia/IMG_ORTODONCIA.png" },
    { id: "120245883274390109", name: "VID_AlineadoresInvisibles", spend: 62927, impressions: 28371, clicks: 244, ctr: 0.86, cpa: 1851, results: 34, resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Ortodoncia/VID_AlineadoresInvisibles.png" },
    { id: "120245903155590109", name: "VID_Ortodoncia_Viejo",      spend: 7641,  impressions: 2253,  clicks: 28,  ctr: 1.24, cpa: 3821, results: 2,  resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Ortodoncia/VID_Ortodoncia_Viejo.png" },
    { id: "120245903275700109", name: "VID_Ortodoncia_Viejo_Cami", spend: 4160,  impressions: 962,   clicks: 17,  ctr: 1.77, cpa: 4160, results: 1,  resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Ortodoncia/VID_Ortodoncia_Viejo_Cami.png" },
  ],
  // STP - Kids
  "120245897324880109": [
    { id: "120245903003540109", name: "IMG_Kids_Odontopediatría", spend: 54427, impressions: 15520, clicks: 202, ctr: 1.30, cpa: 3202, results: 17, resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Kids/IMG_Kids_Odontopediatria.png" },
    { id: "120245899775330109", name: "VID_Kids_Odontopediatría", spend: 16475, impressions: 4562,  clicks: 27,  ctr: 0.59, cpa: 8238, results: 2,  resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Kids/VID_Kids_Odontopediatria_Viejo.png" },
    { id: "120245897324890109", name: "VID_Kids_Ortopedia",       spend: 5067,  impressions: 1414,  clicks: 11,  ctr: 0.78, cpa: 2534, results: 2,  resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Kids/VID_Kids_Ortopedia.png" },
  ],
  // STP - Implantes
  "120245897111740109": [
    { id: "120246514556980109", name: "VID_Implantes_Jun",      spend: 8918,  impressions: 1859,  clicks: 15, ctr: 0.81, cpa: 1784, results: 5,  resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Implantes/VID_Implantes_Jun.png" },
    { id: "120245897111790109", name: "VID_Implantes_Patricio", spend: 33540, impressions: 10591, clicks: 93, ctr: 0.88, cpa: 1597, results: 21, resultType: "Msgs. WA", status: "ACTIVE", image: "/Ads TuDentista/Implantes/VID_Implantes_Patricio.png" },
  ],
  // STP - Tráfico IG
  "120245905886640109": [
    { id: "120245906495570109", name: "VID_Carillas_Junio",         spend: 37968, impressions: 37499, clicks: 1279, ctr: 3.41, cpa: 112, results: 338, resultType: "Visitas perfil", status: "ACTIVE", image: "/Ads TuDentista/Estética/VID_Carillas_Junio.png" },
    { id: "120245906447980109", name: "VID_AlineadoresInvisibles",  spend: 1351,  impressions: 839,   clicks: 39,   ctr: 4.65, cpa: 48,  results: 28,  resultType: "Visitas perfil", status: "ACTIVE", image: "/Ads TuDentista/Ortodoncia/VID_AlineadoresInvisibles.png" },
    { id: "120245906522270109", name: "VID_Ortodoncia_Viejo_Cami",  spend: 251,   impressions: 207,   clicks: 9,    ctr: 4.35, cpa: 36,  results: 7,   resultType: "Visitas perfil", status: "ACTIVE", image: "/Ads TuDentista/Ortodoncia/VID_Ortodoncia_Viejo_Cami.png" },
  ],
}
