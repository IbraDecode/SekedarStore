import { NextResponse } from "next/server";
import { firestore } from "@/lib/firebase-admin";
import { checkDepositStatus, triggerInstant } from "@/lib/atlantic";
import { createOrder, checkStatus as checkZaynStatus } from "@/lib/zaynflazz";
import { sendWhatsApp } from "@/lib/fonnte";

function normalizeStatus(s: string | undefined) {
  return String(s || "").toLowerCase();
}

export async function POST(_: Request, { params }: { params: { code: string } }) {
  const ref = firestore.collection("invoices").doc(params.code);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ message: "Invoice tidak ditemukan" }, { status: 404 });

  const invoice: any = snap.data();

  try {
    // 1) Sync deposit status
    const depositId = invoice?.atlantic?.depositId;
    if (depositId) {
      const deposit = await checkDepositStatus(depositId);

      const depositStatusRaw = deposit?.data?.status;
      const depositStatus = normalizeStatus(depositStatusRaw);

      // update status deposit di invoice
      await ref.update({
        "atlantic.status": depositStatusRaw || invoice?.atlantic?.status || "pending",
        updatedAt: new Date().toISOString(),
      });

      // 2) Kalau processing => instant (sekali)
      if (depositStatus === "processing" && !invoice?.atlantic?.instant_attempted) {
        await triggerInstant(depositId);
        await ref.update({
          "atlantic.instant_attempted": true,
          updatedAt: new Date().toISOString(),
        });
      }

      // 3) Final status payment
      if (depositStatus === "success") {
        if (invoice.payment_status !== "PAID") {
          await ref.update({ payment_status: "PAID", updatedAt: new Date().toISOString() });
          invoice.payment_status = "PAID";
        }
      } else if (depositStatus === "expired") {
        // expired
        if (invoice.payment_status !== "EXPIRED") {
          await ref.update({ payment_status: "EXPIRED", updatedAt: new Date().toISOString() });
          invoice.payment_status = "EXPIRED";
        }
      } else if (depositStatus === "failed") {
        if (invoice.payment_status !== "FAILED") {
          await ref.update({ payment_status: "FAILED", updatedAt: new Date().toISOString() });
          invoice.payment_status = "FAILED";
        }
      } else {
        // pending/processing => keep PENDING/PROCESSING
        if (depositStatus === "processing" && invoice.payment_status !== "PROCESSING") {
          await ref.update({ payment_status: "PROCESSING", updatedAt: new Date().toISOString() });
          invoice.payment_status = "PROCESSING";
        }
      }

      // 4) Kalau PAID dan belum create order => create order
      const hasOrderId = Boolean(invoice?.order?.provider_order_id);
      if (invoice.payment_status === "PAID" && !hasOrderId) {
        const order = await createOrder({
          layanan: String(invoice.serviceSid),
          target: String(invoice.target),
          jumlah: Number(invoice.qty),
        });

        await ref.update({
          order: {
            provider_order_id: order?.data?.id || null,
            start_count: order?.data?.start_count || null,
          },
          updatedAt: new Date().toISOString(),
        });
      }

      // 5) Optional: cek status order zaynflazz kalau sudah ada id
      if (invoice?.order?.provider_order_id) {
        const st = await checkZaynStatus(String(invoice.order.provider_order_id));
        await ref.update({
          "order.provider_status": st?.data?.status || st?.data?.state || null,
          "order.remains": st?.data?.remains || null,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // 6) WhatsApp FINAL (maks 1x)
    const finalStates = ["PAID", "FAILED", "EXPIRED"];
    if (invoice?.whatsapp?.number && !invoice?.whatsapp?.sent_final && finalStates.includes(invoice.payment_status)) {
      const url = `${process.env.BASE_URL || ""}/invoice/${params.code}`;
      const message =
        invoice.payment_status === "PAID"
          ? `✅ Pembayaran sukses\nOrder diproses\nID: ${invoice.order?.provider_order_id || "-"}\nCek: ${url}`
          : `❌ Gagal\nStatus: ${invoice.payment_status}\nCek: ${url}\nJika perlu bantuan: ${process.env.ADMIN_CONTACT_TEXT || ""}`;

      await sendWhatsApp({ target: invoice.whatsapp.number, message });
      await ref.update({ "whatsapp.sent_final": true, updatedAt: new Date().toISOString() });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || "Sync gagal" }, { status: 500 });
  }
}