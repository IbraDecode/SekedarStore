'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CatLottie } from '@/ui/components/CatLottie';

const mockServices = [
  { sid: 'ig-follow', name: 'Instagram Followers Real', category: 'IG Followers', min: 50, max: 10000, price: 25000 },
  { sid: 'ig-like', name: 'IG Likes Cepat', category: 'IG Likes', min: 50, max: 5000, price: 12000 },
  { sid: 'tt-view', name: 'TikTok Views Boost', category: 'TikTok Views', min: 100, max: 20000, price: 18000 },
];

export default function CheckoutPage() {
  const { sid } = useParams<{ sid: string }>();
  const router = useRouter();
  const service = useMemo(() => mockServices.find((s) => s.sid === sid), [sid]);
  const [target, setTarget] = useState('');
  const [qty, setQty] = useState('');
  const [wa, setWa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('skd_wa');
    if (stored) setWa(stored);
  }, []);

  const validate = () => {
    if (!service) {
      setError('Layanan tidak ditemukan');
      return false;
    }
    const q = Number(qty);
    if (!target) {
      setError('Target wajib diisi.');
      return false;
    }
    if (!q || q < service.min || q > service.max) {
      setError(`Jumlah harus antara ${service.min}-${service.max}.`);
      return false;
    }
    setError('');
    return true;
  };

  const submit = async () => {
    if (!validate() || !service) return;
    setLoading(true);
    try {
      const res = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceSid: service.sid, target, qty: Number(qty), whatsapp: wa || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal membuat invoice');
      router.push(`/invoice/${data.code}`);
    } catch (err: any) {
      setError(err.message || 'Ada kendala. Coba periksa lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <CatLottie variant="error" size="lg" />
        <p className="text-lg font-semibold">Layanan tidak ditemukan</p>
        <Link href="/" className="button-primary mt-3 max-w-xs">
          Kembali
        </Link>
      </div>
    );
  }

  const qNum = Number(qty) || 0;
  const total = Math.ceil((qNum / 1000) * service.price);

  return (
    <div className="flex h-screen flex-col bg-slate-50 px-6 py-6">
      <div className="card mb-3 flex flex-col gap-2 text-left">
        <div className="text-sm text-slate-500">{service.category}</div>
        <div className="text-xl font-semibold">{service.name}</div>
        <div className="text-sm text-slate-600">Min {service.min} • Max {service.max}</div>
      </div>

      <div className="space-y-3">
        <input value={target} onChange={(e) => setTarget(e.target.value)} className="field" placeholder="Link/username target" />
        <input
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="field"
          placeholder={`Jumlah (${service.min}-${service.max})`}
          type="number"
        />
        <input value={wa} onChange={(e) => setWa(e.target.value)} className="field" placeholder="WhatsApp (opsional)" />
      </div>

      <div className="card mt-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Total</span>
          <span className="font-semibold text-brand">Rp{total.toLocaleString('id-ID')}</span>
        </div>
        <p className="text-xs text-slate-500">Harga estimasi. Pastikan akun tidak private supaya order lancar.</p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm text-red-600">
          <CatLottie variant="hint" size="sm" />
          <span>{error || 'Ada kendala. Coba periksa lagi.'}</span>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <button className="button-primary" onClick={submit} disabled={loading}>
          {loading ? 'Memproses...' : 'Bayar QRIS'}
        </button>
        <Link href="/" className="button-secondary">
          Batal
        </Link>
      </div>
    </div>
  );
}
