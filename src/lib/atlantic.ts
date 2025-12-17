import qs from 'querystring';

const ATLANTIC_BASE = 'https://atlantich2h.com';

function getApiKey() {
  const key = process.env.ATLANTIC_API_KEY;
  if (!key) throw new Error('ATLANTIC_API_KEY missing');
  return key;
}

export type AtlanticDepositResponse = {
  status: string;
  data?: {
    depositId?: string;
    qr_image?: string;
    expired_at?: string;
    fee?: number;
  };
  message?: string;
};

export async function createDeposit(amount: number, ref: string): Promise<AtlanticDepositResponse> {
  const body = qs.stringify({
    key: getApiKey(),
    amount,
    reff_id: ref,
  });

  const res = await fetch(`${ATLANTIC_BASE}/deposit/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  return res.json();
}

export async function checkDepositStatus(depositId: string) {
  const body = qs.stringify({ key: getApiKey(), deposit_id: depositId });
  const res = await fetch(`${ATLANTIC_BASE}/deposit/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return res.json();
}

export async function triggerInstant(depositId: string) {
  const body = qs.stringify({ key: getApiKey(), deposit_id: depositId, action: 'true' });
  const res = await fetch(`${ATLANTIC_BASE}/deposit/instant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return res.json();
}
