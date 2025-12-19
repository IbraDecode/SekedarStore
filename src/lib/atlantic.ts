const BASE_URL = "https://atlantich2h.com";

function toForm(data: Record<string, any>) {
  return new URLSearchParams(
    Object.entries(data).reduce((acc, [k, v]) => {
      acc[k] = String(v);
      return acc;
    }, {} as Record<string, string>)
  ).toString();
}

export async function createDepositQRIS(reffId: string, nominal: number) {
  const res = await fetch(`${BASE_URL}/deposit/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toForm({
      api_key: process.env.ATLANTIC_API_KEY,
      reff_id: reffId,
      nominal,
      type: "ewallet",
      method: "qris",
    }),
  });

  if (!res.ok) {
    throw new Error("Gagal create deposit Atlantic");
  }

  return res.json();
}

export async function checkDepositStatus(depositId: string) {
  const res = await fetch(`${BASE_URL}/deposit/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toForm({
      api_key: process.env.ATLANTIC_API_KEY,
      id: depositId,
    }),
  });

  if (!res.ok) {
    throw new Error("Gagal cek status deposit");
  }

  return res.json();
}

export async function triggerInstantDeposit(depositId: string) {
  const res = await fetch(`${BASE_URL}/deposit/instant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toForm({
      api_key: process.env.ATLANTIC_API_KEY,
      id: depositId,
      action: true,
    }),
  });

  if (!res.ok) {
    throw new Error("Gagal instant deposit");
  }

  return res.json();
}
