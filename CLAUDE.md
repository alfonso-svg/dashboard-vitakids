# Dashboard Meta Ads — CLAUDE.md

## Contexto del proyecto

Dashboard de Meta Ads para **STP Agency** (agencia multi-cliente). Consume datos en tiempo real vía Meta Ads API a través de MCP. Vista principal: agency overview con drill-down por cliente.

Cuentas activas gestionadas: ~14 (ARS, USD, CLP). Ver listado completo en memoria del proyecto.

---

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 15 |
| Lenguaje | TypeScript | 5+ |
| Estilos | Tailwind CSS | 4 |
| Componentes | shadcn/ui | latest |
| Gráficos | Recharts | latest |
| Íconos | lucide-react | latest |
| Data fetching | React Query (TanStack) | 5 |
| Linting | ESLint + Prettier | — |

---

## Estructura de carpetas

```
dashboard-meta-ads/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Agency overview (pantalla principal)
│   ├── accounts/
│   │   └── [accountId]/
│   │       ├── page.tsx        # Vista por cliente
│   │       └── campaigns/
│   │           └── [campaignId]/
│   │               └── page.tsx
│   └── api/
│       └── meta/
│           └── [...route]/
│               └── route.ts    # Proxy routes hacia Meta API
├── components/
│   ├── ui/                     # Componentes shadcn/ui (auto-generados, no editar)
│   ├── charts/                 # Wrappers de Recharts
│   │   ├── SpendChart.tsx
│   │   ├── PerformanceChart.tsx
│   │   └── index.ts
│   ├── dashboard/              # Componentes de negocio del dashboard
│   │   ├── AccountCard.tsx
│   │   ├── MetricCard.tsx
│   │   ├── CampaignTable.tsx
│   │   └── index.ts
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── index.ts
├── hooks/
│   ├── useAdAccounts.ts
│   ├── useInsights.ts
│   └── useCampaigns.ts
├── lib/
│   ├── meta/
│   │   ├── client.ts           # Wrapper de Meta API
│   │   ├── types.ts            # Tipos de Meta API
│   │   └── formatters.ts       # Formateo de métricas, monedas, fechas
│   ├── utils.ts                # cn() y utilidades genéricas
│   └── constants.ts            # Constantes globales (métricas, períodos, etc.)
├── types/
│   └── index.ts                # Tipos globales del dominio
└── public/
```

---

## Convenciones de naming

### Archivos y carpetas
- Componentes React: `PascalCase.tsx` — `AccountCard.tsx`, `SpendChart.tsx`
- Hooks: `camelCase.ts` con prefijo `use` — `useInsights.ts`
- Utilidades/lib: `camelCase.ts` — `formatters.ts`, `client.ts`
- Carpetas: `kebab-case` — `ad-accounts/`, `meta/`
- Rutas Next.js: `kebab-case` dentro de `app/`

### Código
- Componentes: función nombrada con `export default`, no arrow functions exportadas por default
- Tipos: `PascalCase` para interfaces y types — `AdAccount`, `CampaignInsight`
- Constantes: `SCREAMING_SNAKE_CASE` — `DEFAULT_DATE_RANGE`, `SUPPORTED_CURRENCIES`
- Hooks internos de componente: `camelCase` descriptivo — `isLoading`, `hasError`, `selectedAccount`
- Props interfaces: nombre del componente + `Props` — `AccountCardProps`, `MetricCardProps`

### Métricas de Meta
- Usar los nombres de campo exactos de la API donde sea posible (`spend`, `impressions`, `ctr`, `cpc`, `roas`)
- Valores monetarios: siempre guardar en la unidad base de la API; formatear solo en la capa de presentación

---

## Librerías: cuándo usar cada una

### shadcn/ui — componentes de UI
Usar para TODO lo que sea estructura de UI: `Card`, `Button`, `Table`, `Select`, `DatePicker`, `Badge`, `Skeleton`, `Dialog`, `Tooltip`, `Tabs`.

- Agregar componentes con `npx shadcn@latest add <componente>`
- Los archivos generados van en `components/ui/` — **no editar directamente**
- Para customizar: extender el componente en `components/dashboard/` o `components/charts/`

### Recharts — gráficos
Usar para toda visualización de datos: líneas de tiempo de spend, barras de performance, comparativas de métricas.

- Siempre wrappear en un componente propio en `components/charts/`
- Usar `ResponsiveContainer` siempre para que sean responsive
- Definir colores en `lib/constants.ts` (no hardcodear hexadecimales en los componentes)
- Tooltips customizados: componente propio, no el default de Recharts

```tsx
// Patrón base de chart
export function SpendChart({ data }: SpendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* ... */}
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### lucide-react — íconos
Usar para todos los íconos de la UI. Nunca SVGs inline salvo logos de marcas.

- Importar solo el ícono que se necesita: `import { TrendingUp } from 'lucide-react'`
- Tamaño por defecto: `size={16}` en texto, `size={20}` en botones, `size={24}` standalone
- No usar `className` para color — usar la prop `color` o heredar del padre con `currentColor`

### React Query (TanStack Query) — data fetching
Usar para todos los fetches de datos de Meta API.

- Un hook por recurso: `useAdAccounts`, `useInsights`, `useCampaigns`
- `staleTime`: 5 minutos para datos de insights, 1 minuto para estado de campañas
- Nunca hacer fetch directo en componentes — siempre a través de hooks
- Las query keys deben incluir todos los parámetros que afectan el resultado

```ts
// Patrón de hook
export function useInsights(accountId: string, dateRange: DateRange) {
  return useQuery({
    queryKey: ['insights', accountId, dateRange],
    queryFn: () => fetchInsights(accountId, dateRange),
    staleTime: 5 * 60 * 1000,
  })
}
```

---

## Manejo de errores

### Principios
1. **Errores en el borde del sistema** (llamadas a Meta API): capturar, loggear, y transformar a un tipo de error propio antes de que lleguen a los componentes
2. **Nunca mostrar mensajes de error técnicos al usuario** — siempre mensajes en español, legibles
3. **Degradación controlada**: si una cuenta falla, mostrar el card en estado de error sin romper el resto del dashboard

### Tipos de error definidos

```ts
// lib/meta/types.ts
export type MetaApiError =
  | { type: 'UNAUTHORIZED'; message: string }
  | { type: 'RATE_LIMITED'; retryAfter: number }
  | { type: 'NOT_FOUND'; resource: string }
  | { type: 'ACCOUNT_DISABLED'; accountId: string }
  | { type: 'UNKNOWN'; message: string }
```

### En hooks (React Query)
- Usar `retry: 1` para errores de red, `retry: 0` para errores 4xx
- El error que expone el hook debe ser siempre `MetaApiError`, no el error crudo

### En componentes
- Usar `ErrorBoundary` en las rutas de página (`app/*/page.tsx`)
- Para errores a nivel de card/widget: mostrar estado de error inline con `lucide-react` (`AlertCircle`) y mensaje corto
- Para errores críticos (sin cuentas, sin auth): página de error full-screen

```tsx
// Patrón de error inline en card
if (error) {
  return (
    <Card>
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle size={16} />
        <span>No se pudieron cargar los datos</span>
      </div>
    </Card>
  )
}
```

### Estados de carga
- Siempre mostrar `Skeleton` de shadcn/ui mientras carga, nunca un spinner global que bloquee la UI
- Los skeletons deben tener la misma forma que el contenido real (mismo alto, mismo layout)

---

## Reglas generales

- **TypeScript estricto**: `strict: true` en `tsconfig.json`. Sin `any` — usar `unknown` y tipar correctamente.
- **Sin comentarios obvios**: solo comentar el "por qué", nunca el "qué".
- **Server Components por defecto**: solo usar `"use client"` cuando sea necesario (interactividad, hooks de estado, React Query).
- **Formateo de monedas**: siempre usar `Intl.NumberFormat` con el `currency` correcto de cada cuenta. No hardcodear símbolos.
- **Fechas**: usar `date-fns` para manipulación. Mostrar siempre en el timezone del usuario.
- Los datos de Meta API se transforman en `lib/meta/formatters.ts` antes de llegar a los componentes — los componentes nunca consumen la respuesta cruda de la API.
