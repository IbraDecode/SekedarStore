import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';
import { fetchServices } from '@/lib/zaynflazz';

export async function POST() {
  try {
    const data = await fetchServices();
    const items = Array.isArray(data?.data) ? data.data : [];

    const batch = firestore.batch();
    items.slice(0, 50).forEach((item: any) => {
      const sid = String(item.id);
      const ref = firestore.collection('services').doc(sid);
      batch.set(ref, {
        sid,
        name: item.name,
        category: item.category,
        min: Number(item.min) || 0,
        max: Number(item.max) || 0,
        base_price_per_1000: Number(item.price) || 0,
        markup_type: 'percent',
        markup_value: 20,
        is_active: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    });
    await batch.commit();

    return NextResponse.json({ success: true, count: items.length });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'sync failed' }, { status: 500 });
  }
}
