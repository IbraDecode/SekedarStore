import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";
import { calculateSellPricePerThousand } from "@/lib/pricing";

export async function GET() {
  try {
    const snapshot = await firestore.collection("services").where("is_active", "==", true).get();
    
    const services = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      const sellPricePer1000 = calculateSellPricePerThousand(
        Number(data.base_price_per_1000 || 0),
        String(data.markup_type || "percent"),
        Number(data.markup_value || 0)
      );

      return {
        sid: data.sid,
        name: data.name,
        category: data.category,
        min: data.min,
        max: data.max,
        pricePer1000: sellPricePer1000,
        basePricePer1000: Number(data.base_price_per_1000 || 0),
        markupType: String(data.markup_type || "percent"),
        markupValue: Number(data.markup_value || 0),
      };
    });

    return NextResponse.json({ services });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Failed to fetch services" }, { status: 500 });
  }
}
