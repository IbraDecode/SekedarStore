const ZAYN_BASE = "https://zaynflazz.com/api/sosial-media";

function getKey() {
  const key = process.env.ZAYNFLAZZ_API_KEY;
  if (!key) throw new Error("ZAYNFLAZZ_API_KEY missing");
  return key;
}

async function postForm(action: string, payload: Record<string, unknown>) {
  const body = new URLSearchParams({
    api_key: getKey(), // FIX
    action,
    ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])),
  });

  const res = await fetch(ZAYN_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Zaynflazz HTTP error");
  return json;
}

export async function fetchServices() {
  return postForm("layanan", {});
}

export async function createOrder(params: { layanan: string; target: string; jumlah: number }) {
  // ✅ FIX: layanan + jumlah sesuai doc
  return postForm("pemesanan", {
    layanan: params.layanan,
    target: params.target,
    jumlah: params.jumlah,
  });
}

export async function checkStatus(orderId: string) {
  return postForm("status", { id: orderId });
}