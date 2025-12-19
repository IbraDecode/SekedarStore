'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CatLottie } from '@/ui/components/CatLottie';
import { AlertCircle, Check, Info, Link2, Phone, QrCode, Target as TargetIcon } from 'lucide-react';
import igIcon from '@/ui/assets/instagram.svg';
import ttIcon from '@/ui/assets/tiktok.svg';
import ytIcon from '@/ui/assets/youtube.svg';

export default function CheckoutPage() {
  const { sid } = useParams<{ sid: string }>();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [target, setTarget] = useState('');
  const [qty, setQty] = useState('');
  const [wa, setWa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState('Isi target dan jumlah sesuai min–max.');

  useEffect(() => {
    const loadService = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.services) {
          const found = data.services.find((s: any) => s.sid === sid);
          setService(found || null);
          if (!found) {
            setError('Layanan tidak ditemukan. Silakan pilih dari daftar layanan.');
          }
        }
      } catch (err) {
        console.error('Failed to load service:', err);
        setError('Gagal memuat layanan. Silakan coba lagi.');
      } finally {
        setServiceLoading(false);
      }
    };

    loadService();
    
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [sid]);

  useEffect(() => {
    const stored = localStorage.getItem('skd_wa');
    if (stored) setWa(stored);
  }, []);

  const validate = () => {
    if (serviceLoading) {
      return false; // Skip validation while loading
    }
    
    if (!service) {
      setError('Layanan tidak ditemukan');
      return false;
    }
    
    const q = Number(qty);
    if (!target) {
      setError('Target wajib diisi.');
      setGuidance('Pastikan link/username bisa diakses dan tidak private.');
      return false;
    }
    
    if (!q || q < service.min || q > service.max) {
      setError(`Jumlah harus antara ${service.min}-${service.max}.`);
      setGuidance('Masukkan angka di dalam rentang supaya langsung diproses.');
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
        body: JSON.stringify({ 
          serviceSid: service.sid, 
          target, 
          qty: Number(qty), 
          whatsapp: wa || undefined 
        }),
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

  if (serviceLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <CatLottie variant="loading" size="lg" />
        <p className="mt-4 text-lg font-semibold text-slate-700">Memuat layanan...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <CatLottie variant="error" size="lg" />
        <p className="text-lg font-semibold mt-4">Layanan tidak ditemukan</p>
        <p className="text-sm text-slate-600 mt-2 max-w-sm">{error}</p>
        <Link href="/" className="button-primary mt-4 max-w-xs">
          Kembali
        </Link>
      </div>
    );
  }

  const qNum = Number(qty) || 0;
  const pricePer1000 = service.pricePer1000 || service.price || 0;
  const total = Math.ceil((qNum / 1000) * pricePer1000);

  return (
    <div className="flex h-screen flex-col bg-slate-50 px-6 py-6">
      <div className="card mb-4 flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500 uppercase tracking-wide">Kategori</div>
            <div className="text-lg font-semibold text-slate-900">{service.category}</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <CatLottie variant="loading" size="sm" />
          </div>
        </div>
        <div className="text-xl font-bold text-slate-900">{service.name}</div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Min: {service.min}</span>
          <span className="text-slate-600">Max: {service.max}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input 
            value={target} 
            onChange={(e) => setTarget(e.target.value)} 
            className="field pr-11" 
            placeholder="Link atau username target" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Link2 size={18} />
          </div>
        </div>

        <div className="relative">
          <input
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="field pr-11"
            placeholder="Jumlah yang dibeli"
            type="number"
            min={service.min}
            max={service.max}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <TargetIcon size={18} />
          </div>
          {qty && Number(qty) >= service.min && Number(qty) <= service.max && (
            <div className="absolute right-9 top-1/2 -translate-y-1/2 text-emerald-500">
              <Check size={16} />
            </div>
          )}
        </div>

        <div className="relative">
          <input 
            value={wa} 
            onChange={(e) => setWa(e.target.value)} 
            className="field pr-11" 
            placeholder="WhatsApp (opsional, untuk notifikasi)" 
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Phone size={18} />
          </div>
          {wa && (
            <div className="absolute right-9 top-1/2 -translate-y-1/2 text-emerald-500">
              <Check size={16} />
            </div>
          )}
        </div>
      </div>

      <div className="card mt-6 flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-500">Total Harga</div>
            <div className="text-2xl font-bold text-brand">Rp{total.toLocaleString('id-ID')}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Harga per 1000</div>
            <div className="text-sm font-semibold text-slate-700">Rp{pricePer1000.toLocaleString('id-ID')}</div>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
          <Info size={16} className="text-brand mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            Harga sudah termasuk biaya layanan & sistem otomatis. Akun jangan private agar langsung diproses.
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
          <CatLottie variant="error" size="sm" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}
      {!error && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs text-white">
          <AlertCircle size={14} className="text-amber-300" />
          {guidance}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <button 
          className="button-primary relative overflow-hidden" 
          onClick={submit} 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <CatLottie variant="loading" size="sm" />
              <span>Memproses pesanan...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <QrCode size={18} />
              <span>Lanjut bayar</span>
            </div>
          )}
        </button>
        
        <Link href="/" className="button-secondary">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
