import { fetchServices } from "@/lib/zaynflazz";
import { db } from "@/lib/firebase-admin";

function parseNumber(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  return Number(String(val).replace(/[^\d]/g, ""));
}

export async function POST() {
  const result = await fetchServices();

  const list = Array.isArray(result.data)
    ? result.data
    : Array.isArray(result)
    ? result
    : [];

  const batch = db.batch();

  list.forEach((item: any) => {
    const sid = String(item.sid || item.id);
    if (!sid) return;

    const ref = db.collection("services").doc(sid);

    batch.set(
      ref,
      {
        sid,
        name: item.layanan || item.name || "-",
        category: item.kategori || item.category || "Lainnya",
        min: parseNumber(item.min),
        max: parseNumber(item.max),
        base_price_per_1000: parseNumber(item.harga),
        is_active: true,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  });

  await batch.commit();

  return Response.json({
    status: true,
    total: list.length,
  });
}
