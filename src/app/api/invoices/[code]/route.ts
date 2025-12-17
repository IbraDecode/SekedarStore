import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase-admin';

export async function GET(_: Request, { params }: { params: { code: string } }) {
  const doc = await firestore.collection('invoices').doc(params.code).get();
  if (!doc.exists) return NextResponse.json({ message: 'Invoice tidak ditemukan' }, { status: 404 });
  const invoice = doc.data();
  return NextResponse.json({ invoice });
}
