const ZAYN_BASE = 'https://zaynflazz.com/api/sosial-media';

function getKey() {
  const key = process.env.ZAYNFLAZZ_API_KEY;
  if (!key) throw new Error('ZAYNFLAZZ_API_KEY missing');
  return key;
}

async function post(action: string, payload: Record<string, unknown>) {
  const body = new URLSearchParams({
    key: getKey(),
    action,
    ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])),
  });

  const res = await fetch(ZAYN_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return res.json();
}

export async function fetchServices() {
  return post('layanan', {});
}

export async function createOrder(params: { service: string; target: string; quantity: number }) {
  return post('pemesanan', params);
}

export async function checkStatus(orderId: string) {
  return post('status', { id: orderId });
}
