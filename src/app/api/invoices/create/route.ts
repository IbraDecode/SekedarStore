import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { createDeposit } from '@/lib/atlantic';
import { sendWhatsApp } from '@/lib/fonnte';

function calcTotals(basePrice: number, markupType: string, markupValue: number, qty: number) {
  const base = (qty / 1000) * basePrice;
  let sell = base;
  if (markupType === 'percent') sell += (markupValue / 100) * base;
  else sell += markupValue;
  return { base_total: Math.ceil(base), sell_total: Math.ceil(sell) };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serviceSid, target, qty, whatsapp } = body;

    if (!serviceSid || !target || !qty) {
      return NextResponse.json({ message: 'Input tidak lengkap' }, { status: 400 });
    }

    const svcDoc = await firestore.collection('services').doc(String(serviceSid)).get();
    if (!svcDoc.exists) return NextResponse.json({ message: 'Layanan tidak ditemukan' }, { status: 404 });
    const svc = svcDoc.data()!;
    if (qty < svc.min || qty > svc.max) return NextResponse.json({ message: 'Jumlah di luar batas' }, { status: 400 });

    const { base_total, sell_total } = calcTotals(svc.base_price_per_1000, svc.markup_type, svc.markup_value, qty);
    const code = `INV${Date.now()}`;

    const deposit = await createDeposit(sell_total, code);
    const invoice = {
      code,
      serviceSid,
      target,
      qty,
      base_total,
      sell_total,
      profit: sell_total - base_total - (deposit.data?.fee || 0),
      payment_status: 'UNPAID',
      atlantic: {
        depositId: deposit.data?.depositId,
        status: deposit.status,
        qr_image: deposit.data?.qr_image,
        expired_at: deposit.data?.expired_at,
        fee: deposit.data?.fee || 0,
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

    await firestore.collection('invoices').doc(code).set(invoice);

    if (whatsapp) {
      const url = `${process.env.BASE_URL || ''}/invoice/${code}`;
      await sendWhatsApp({
        target: whatsapp,
        message: `🧾 Invoice dibuat\n*Layanan:* ${svc.name}\n*Target:* ${target}\n*Jumlah:* ${qty}\n*Total:* Rp${sell_total.toLocaleString('id-ID')}\nBayar: ${url}`,
      });
      await firestore.collection('invoices').doc(code).update({ 'whatsapp.sent_created': true });
    }

    return NextResponse.json({ code, qr_image: deposit.data?.qr_image, invoice_url: `/invoice/${code}` });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Gagal membuat invoice' }, { status: 500 });
  }
}
