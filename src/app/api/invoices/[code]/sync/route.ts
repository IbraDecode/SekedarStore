import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { checkDepositStatus, triggerInstant } from '@/lib/atlantic';
import { createOrder } from '@/lib/zaynflazz';
import { sendWhatsApp } from '@/lib/fonnte';

export async function POST(_: Request, { params }: { params: { code: string } }) {
  const ref = firestore.collection('invoices').doc(params.code);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ message: 'Invoice tidak ditemukan' }, { status: 404 });
  const invoice = snap.data()!;

  try {
    if (invoice.atlantic?.depositId) {
      const deposit = await checkDepositStatus(invoice.atlantic.depositId);
      const status = deposit?.data?.status || deposit?.status;

      if (status === 'processing' && !invoice.atlantic.instant_attempted) {
        await triggerInstant(invoice.atlantic.depositId);
        invoice.atlantic.instant_attempted = true;
      }

      if (status === 'success' && invoice.payment_status !== 'PAID') {
        const order = await createOrder({ service: invoice.serviceSid, target: invoice.target, quantity: invoice.qty });
        invoice.order = {
          provider_order_id: order.data?.id || order.data?.order_id,
          provider_status: order.data?.status,
          start_count: order.data?.start_count,
          remains: order.data?.remains,
        };
        invoice.payment_status = 'PAID';
      }

      if (status === 'failed' || status === 'expired') {
        invoice.payment_status = status === 'failed' ? 'FAILED' : 'EXPIRED';
      }

      invoice.atlantic.status = status;
    }

    invoice.updatedAt = new Date().toISOString();
    await ref.set(invoice, { merge: true });

    if (invoice.whatsapp?.number && !invoice.whatsapp.sent_final && ['PAID', 'FAILED', 'EXPIRED'].includes(invoice.payment_status)) {
      const url = `${process.env.BASE_URL || ''}/invoice/${params.code}`;
      const message = invoice.payment_status === 'PAID'
        ? `✅ Pembayaran sukses\nOrder diproses\nID: ${invoice.order?.provider_order_id || '-'}\nCek: ${url}`
        : `❌ Gagal\nStatus: ${invoice.payment_status}\nCek: ${url}\nJika perlu bantuan: ${process.env.ADMIN_CONTACT_TEXT || ''}`;
      await sendWhatsApp({ target: invoice.whatsapp.number, message });
      await ref.update({ 'whatsapp.sent_final': true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Sync gagal' }, { status: 500 });
  }
}
