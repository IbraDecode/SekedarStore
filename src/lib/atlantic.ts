import qs from "querystring";

const ATLANTIC_BASE = "https://atlantich2h.com";

function getApiKey() {
  const key = process.env.ATLANTIC_API_KEY;
  if (!key) throw new Error("ATLANTIC_API_KEY missing");
  return key;
}

export type AtlanticCreateDepositResponse = {
  status: boolean;
  data?: {
    id: string; // ini deposit id yang dipakai untuk status/instant
    reff_id: string;
    nominal: number;
    tambahan?: number;
    fee?: number;
    get_balance?: number;
    qr_string?: string;
    qr_image?: string;
    status: string; // pending|processing|success|expired|failed
    created_at?: string;
    expired_at?: string;
  };
  code?: number;
  message?: string;
};

export type AtlanticStatusDepositResponse = {
  status: boolean;
  data?: {
    id: string;
    reff_id?: string;
    nominal?: string | number;
    fee?: string | number;
    get_balance?: string | number;
    metode?: string;
    status: string; // pending|processing|success|expired|failed
    created_at?: string;
  };
  code?: number;
  message?: string;
};

export type AtlanticInstantDepositResponse = {
  status: boolean;
  data?: {
    id?: string;
    reff_id?: string;
    nominal?: number;
    penanganan?: number;
    total_fee?: number;
    total_diterima?: number;
    status?: string; // processing|success
    created_at?: string;
  };
  code?: number;
  message?: string;
};

/**
 * Create deposit QRIS
 * Doc: /deposit/create
 * Body (x-www-form-urlencoded):
 * api_key, reff_id, nominal, type=ewallet, method=qris
 */
export async function createDeposit(nominal: number, reffId: string): Promise<AtlanticCreateDepositResponse> {
  const body = qs.stringify({
    api_key: getApiKey(),
    reff_id: reffId,
    nominal: String(nominal),
    type: "ewallet",
    metode: "qris",
  });

  const res = await fetch(`${ATLANTIC_BASE}/deposit/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = (await res.json()) as AtlanticCreateDepositResponse;

  if (!res.ok) {
    throw new Error(json?.message || "Atlantic deposit/create HTTP error");
  }

  return json;
}

/**
 * Check deposit status
 * Doc: /deposit/status
 * Body: api_key, id
 */
export async function checkDepositStatus(id: string): Promise<AtlanticStatusDepositResponse> {
  const body = qs.stringify({
    api_key: getApiKey(),
    id,
  });

  const res = await fetch(`${ATLANTIC_BASE}/deposit/status`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = (await res.json()) as AtlanticStatusDepositResponse;

  if (!res.ok) {
    throw new Error(json?.message || "Atlantic deposit/status HTTP error");
  }

  return json;
}

/**
 * Instant deposit
 * Doc: /deposit/instant
 * Body: api_key, id, action=true
 */
export async function triggerInstant(id: string): Promise<AtlanticInstantDepositResponse> {
  const body = qs.stringify({
    api_key: getApiKey(),
    id,
    action: "true",
  });

  const res = await fetch(`${ATLANTIC_BASE}/deposit/instant`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = (await res.json()) as AtlanticInstantDepositResponse;

  if (!res.ok) {
    throw new Error(json?.message || "Atlantic deposit/instant HTTP error");
  }

  return json;
}