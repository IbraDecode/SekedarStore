import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";
import { calculateSellPricePerThousand } from "@/lib/pricing";

export async function GET() {
  try {
    const snapshot = await firestore.collection("services").where("is_active", "==", true).get();
    
    const services = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      const markupType = "percent";
      const markupValue = 20;
      const sellPricePer1000 = calculateSellPricePerThousand(
        Number(data.base_price_per_1000 || 0),
        markupType,
        markupValue
      );

      return {
        sid: data.sid,
        name: data.name,
        category: data.category,
        min: data.min,
        max: data.max,
        pricePer1000: sellPricePer1000,
        basePricePer1000: Number(data.base_price_per_1000 || 0),
        markupType,
        markupValue,
        is_fast: Boolean(data.fast || data.is_fast),
        refill: data.refill === true || String(data.refill).toLowerCase() === "true",
      };
    });

    // Prioritize cheapest first to reduce scroll
    services.sort((a, b) => a.pricePer1000 - b.pricePer1000);

    return NextResponse.json({ services });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Failed to fetch services" }, { status: 500 });
  }
}
