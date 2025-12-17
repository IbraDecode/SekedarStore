'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { CatLottie } from '@/ui/components/CatLottie';

export type InvoiceStatus = 'UNPAID' | 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'EXPIRED';

type Invoice = {
  code: string;
  qr_image?: string;
  payment_status: InvoiceStatus;
  order_status?: string;
  sell_total?: number;
  expired_at?: string;
};

export default function InvoicePage() {
  const { code } = useParams<{ code: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/invoices/${code}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal memuat invoice');
      setInvoice(data.invoice);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Ada kendala. Coba periksa lagi.');
    } finally {
      setLoading(false);
    }
  };

  const sync = async () => {
    setLoading(true);
    await fetch(`/api/invoices/${code}/sync`, { method: 'POST' });
    await load();
  };

  useEffect(() => {
    document.body.classList.add('no-scroll');
    load();
    return () => document.body.classList.remove('no-scroll');
  }, []);

  const isSuccess = invoice?.payment_status === 'PAID';
  const isError = invoice && ['FAILED', 'EXPIRED'].includes(invoice.payment_status);

  return (
    <div className="flex h-screen flex-col items-center bg-slate-50 px-6 py-6 text-center">
      {loading && <CatLottie variant="loading" size="lg" />}

      {!loading && invoice && (
        <div className="flex w-full max-w-md flex-col gap-4">
          <div className="text-2xl font-semibold">Invoice #{invoice.code}</div>
          <div className="text-sm text-slate-500">Status pembayaran: {invoice.payment_status}</div>

          {!isSuccess && !isError && invoice.qr_image && (
            <div className="mx-auto rounded-3xl bg-white p-4 shadow-soft">
              <Image src={invoice.qr_image} alt="QRIS" width={220} height={220} className="rounded-2xl" />
            </div>
          )}

          {isSuccess && (
            <div className="flex flex-col items-center gap-2">
              <CatLottie variant="successCheck" size="lg" />
              <p className="text-lg font-semibold">Pembayaran sukses. Order diproses.</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-2">
              <CatLottie variant="error" size="lg" />
              <p className="text-lg font-semibold">Pembayaran gagal atau kedaluwarsa.</p>
            </div>
          )}

          <div className="card text-left text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold text-brand">Rp{invoice.sell_total?.toLocaleString('id-ID') || '-'}</span>
            </div>
            {invoice.expired_at && <div className="text-xs text-slate-400">Kedaluwarsa: {invoice.expired_at}</div>}
          </div>

          {error && (
            <div className="rounded-2xl bg-white px-3 py-2 text-sm text-red-600">{error}</div>
          )}

          <button className="button-primary" onClick={sync}>
            Refresh Status
          </button>
        </div>
      )}

      {!loading && !invoice && (
        <div className="flex flex-col items-center gap-2">
          <CatLottie variant="notFound" size="lg" />
          <p className="text-lg font-semibold">Invoice tidak ditemukan</p>
        </div>
      )}
    </div>
  );
}
