import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";
import { fetchServices } from "@/lib/zaynflazz";

function parseNumber(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  // "10.200" => 10200
  return Number(String(val).replace(/[^\d]/g, "")) || 0;
}

export async function POST() {
  try {
    const res = await fetchServices();

    const items = Array.isArray(res?.data) ? res.data : [];
    if (!items.length) {
      return NextResponse.json({ success: false, message: "Data layanan kosong dari API" }, { status: 502 });
    }

    const batch = firestore.batch();

    items.forEach((item: any) => {
      const sid = String(item.sid || item.id || "");
      if (!sid) return;

      const ref = firestore.collection("services").doc(sid);

      batch.set(
        ref,
        {
          sid,
          name: item.layanan || item.name || "-",
          category: item.kategori || item.category || "Lainnya",
          min: parseNumber(item.min),
          max: parseNumber(item.max),
          base_price_per_1000: parseNumber(item.harga),
          markup_type: "percent",
          markup_value: 20,
          is_active: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    });

    await batch.commit();

    return NextResponse.json({ success: true, count: items.length });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "sync failed" }, { status: 500 });
  }
}