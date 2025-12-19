import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await firestore.collection("services").where("is_active", "==", true).get();
    
    const services = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        sid: data.sid,
        name: data.name,
        category: data.category,
        min: data.min,
        max: data.max,
        price: Math.ceil((data.base_price_per_1000 || 0) * 1.2), // Include 20% markup
      };
    });

    return NextResponse.json({ services });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Failed to fetch services" }, { status: 500 });
  }
}