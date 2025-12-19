const BASE_URL = "https://zaynflazz.com/api/sosial-media";

function toForm(data: Record<string, any>) {
  return new URLSearchParams(
    Object.entries(data).reduce((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  ).toString();
}

export async function fetchServices() {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toForm({
      api_key: process.env.ZAYNFLAZZ_API_KEY,
      action: "layanan",
    }),
  });

  if (!res.ok) {
    throw new Error("Gagal fetch layanan Zaynflazz");
  }

  return res.json();
}

export async function createOrder(params: {
  layanan: string;
  target: string;
  jumlah: number;
}) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toForm({
      api_key: process.env.ZAYNFLAZZ_API_KEY,
      action: "pemesanan",
      layanan: params.layanan,
      target: params.target,
      jumlah: params.jumlah,
    }),
  });

  if (!res.ok) {
    throw new Error("Gagal create order Zaynflazz");
  }

  return res.json();
}

export async function checkOrderStatus(orderId: string) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toForm({
      api_key: process.env.ZAYNFLAZZ_API_KEY,
      action: "status",
      id: orderId,
    }),
  });

  if (!res.ok) {
    throw new Error("Gagal cek status order Zaynflazz");
  }
