// studio/src/lib/api.ts
export interface PersonaRow {
  codPersona: number;
  codPersonas?: number[];
  ci: string | null;
  ciAlt?: string | null;
  nombre: string;
  paterno: string;
  materno: string;
  nombreCompleto: string;
  // Nuevo campo: indica si la persona tiene deuda pendiente
  tieneDeuda?: boolean;
  // Nuevo campo: monto total de deuda pendiente
  montoDeuda?: number;
  // Origen registrado de la persona (Web/Escritorio)
  origenPersona?: string | null;
  // Origen del ultimo pago (si existe)
  origenUltimoPago?: string | null;
  // Lista de origenes combinados para la persona
  origenes?: string[];
}
export interface SearchLegacyResp {
  total: number;
  page: number;
  pageSize: number;
  items: PersonaRow[];
}

export interface PaymentRow {
  codPago: number;
  monto: number;
  estado?: string | null;
  gestion?: number | null;
  mes?: number | null;
  fechaPlanificada?: string | null;
  fechaACancelar?: string | null;
  fechaQueCancelo?: string | null;
  anioCancelacion?: number | null;
  observaciones?: string | null;
  // Origen del pago (nuevo)
  origen?: string | null;
}
export interface PaymentsResp {
  total: number;
  page: number;
  pageSize: number;
  items: PaymentRow[];
}

const BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function searchLegacy(
  query: string,
  page = 1,
  pageSize = 20,
): Promise<SearchLegacyResp> {
  const url = new URL(`${BASE}/api/legacy/search`);
  if (query) url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status} al buscar personas`);
  return res.json();
}

type PaymentsOptions = {
  origen?: string;
  anioCancelacion?: number;
};

export async function getPayments(
  codPersona: number,
  page = 1,
  pageSize = 50,
  options?: PaymentsOptions,
): Promise<PaymentsResp> {
  const url = new URL(`${BASE}/api/legacy/personas/${codPersona}/pagos`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  if (options?.origen) url.searchParams.set("origen", options.origen);
  if (options?.anioCancelacion !== undefined) url.searchParams.set("anioCancelacion", String(options.anioCancelacion));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Error ${res.status} al obtener pagos`);
  return res.json();
}

