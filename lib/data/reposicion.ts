// Nueva colección en el catálogo (7 nov 2026): 5 días vs 5 días.
// Campañas de venta (Advantage+ y Tráfico Frío); excluye Visitas al Perfil.
// Fuente: Meta API vía MCP, cuenta 298292486622442 (consultado 12 nov 2026).
// 2–6 nov: $119.63 · 35 compras · $690.40 valor · 1,674 visitas · 254 carritos · 77 pagos
// 7–11 nov: $115.79 · 39 compras · $910.86 valor · 2,850 visitas · 344 carritos · 136 pagos
// Octubre (cuenta completa, dailyData): $1,153.42 · 115 compras · CPA $10.03 · ROAS 2.50x
// tono: "mejora" = verde, "empeora" = rojo, sin tono = neutro. destacada = fila resaltada.
export type ReposicionRow = {
  metrica: string; antes: string; despues: string; var: string
  tono?: "mejora" | "empeora"; destacada?: boolean
}

export const REPOSICION: ReposicionRow[] = [
  { metrica: "Inversión",        antes: "$119.63", despues: "$115.79", var: "−3.2%" },
  { metrica: "Compras",          antes: "35",      despues: "39",      var: "+11.4%", tono: "mejora" },
  { metrica: "CPA",              antes: "$3.42",   despues: "$2.97",   var: "−13.1%", tono: "mejora", destacada: true },
  { metrica: "ROAS",             antes: "5.77x",   despues: "7.87x",   var: "+36.3%", tono: "mejora", destacada: true },
  { metrica: "Valor de compras", antes: "$690.40", despues: "$910.86", var: "+31.9%", tono: "mejora" },
  { metrica: "Visitas",          antes: "1,674",   despues: "2,850",   var: "+70.3%", tono: "mejora" },
  { metrica: "Carritos",         antes: "254",     despues: "344",     var: "+35.4%", tono: "mejora" },
  { metrica: "Pagos iniciados",  antes: "77",      despues: "136",     var: "+76.6%", tono: "mejora" },
  { metrica: "Visita → carrito", antes: "15.2%",   despues: "12.1%",   var: "−20.4%", tono: "empeora" },
]

export const REPOSICION_TITULAR = "Los modelos nuevos subieron el ROAS 36% con la misma inversión"

export const REPOSICION_BAJADA =
  "El 7 de noviembre entraron modelos nuevos al catálogo. Con una inversión prácticamente igual, las compras pasaron de 35 a 39 y el valor vendido de $690 a $911: el ROAS subió de 5.77x a 7.87x porque cada compra trae un ticket más alto ($23.36 contra $19.73). El tráfico creció 70% (Advantage+ duplicó sus visitas desde el 8 de noviembre) y los pagos iniciados casi se duplicaron. La tasa de visita a carrito bajó porque llega más gente nueva a mirar los modelos nuevos, y una parte todavía no termina en compra. Es una mejora más gradual que un salto, pero confirma la lectura de octubre: cuando el catálogo tiene variedad, el rendimiento acompaña."

export const REPOSICION_DESTACADO = "Contra el CPA de octubre ($10.03), la mejora es del 70.4%."
export const REPOSICION_DESTACADO_DETALLE =
  "Con los $115.79 de esos cinco días, al CPA de octubre habrían salido 12 compras en lugar de 39."

export const REPOSICION_METODO =
  "Comparativa de 5 días contra 5 días sobre las campañas de venta (Advantage+ y Tráfico Frío); excluye Visitas al Perfil. Fuente: API de Meta Ads, cuenta 298292486622442. El CPA de octubre es de la cuenta completa y con más inversión diaria (~$37 contra ~$23 en noviembre), y el checkout se arregló el 26 de octubre: parte de la mejora contra octubre viene de esos cambios. Ventana corta y atribución aún en curso: leer como señal temprana, no como resultado consolidado."
