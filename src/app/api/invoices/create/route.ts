import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";
import { createDeposit } from "@/lib/atlantic";
import { sendWhatsApp } from "@/lib/fonnte";
import { calculateTotals } from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serviceSid, target, qty, whatsapp } = body;

    if (!serviceSid || !target || !qty) {
      return NextResponse.json({ message: "Input tidak lengkap" }, { status: 400 });
    }

    const svcDoc = await firestore.collection("services").doc(String(serviceSid)).get();
    if (!svcDoc.exists) return NextResponse.json({ message: "Layanan tidak ditemukan" }, { status: 404 });

    const svc = svcDoc.data()!;
    if (qty < svc.min || qty > svc.max) {
      return NextResponse.json({ message: "Jumlah di luar batas" }, { status: 400 });
    }

    const { base_total, sell_total } = calculateTotals(
      Number(svc.base_price_per_1000 || 0),
      String(svc.markup_type || "percent"),
      Number(svc.markup_value || 0),
      Number(qty)
    );

    const code = `INV${Date.now()}`;

    // ✅ create deposit: (nominal, reffId)
    const deposit = await createDeposit(sell_total, code);

    const depositId = deposit?.data?.id; // ✅ ini yang bener
    if (!depositId) {
      return NextResponse.json({ message: "Deposit gagal dibuat (id kosong)" }, { status: 502 });
    }

    const fee = Number(deposit?.data?.fee || 0);

    const invoice = {
      code,
      serviceSid: String(serviceSid),
      target: String(target),
      qty: Number(qty),
      base_total,
      sell_total,
      profit: sell_total - base_total - fee,

      // QR sudah dibuat -> status masuk PENDING
      payment_status: "PENDING",

      atlantic: {
        depositId, // simpan id untuk status/instant
        status: deposit?.data?.status || "pending", // status transaksi (bukan boolean request)
        qr_image: deposit?.data?.qr_image || null,
        expired_at: deposit?.data?.expired_at || null,
        fee,
        instant_attempted: false,
      },

      order: {},

      whatsapp: {
        number: whatsapp || null,
        sent_created: false,
        sent_final: false,
      },

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await firestore.collection("invoices").doc(code).set(invoice);

    if (whatsapp) {
      const url = `${process.env.BASE_URL || ""}/invoice/${code}`;
      await sendWhatsApp({
        target: whatsapp,
        message: `🧾 Invoice dibuat\n*Layanan:* ${svc.name}\n*Target:* ${target}\n*Jumlah:* ${qty}\n*Total:* Rp${sell_total.toLocaleString(
          "id-ID"
        )}\nBayar: ${url}`,
      });
      await firestore.collection("invoices").doc(code).update({ "whatsapp.sent_created": true });
    }

    return NextResponse.json({ code, qr_image: deposit?.data?.qr_image, invoice_url: `/invoice/${code}` });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Gagal membuat invoice" }, { status: 500 });
  }
}
