'use client';

import { useEffect, useMemo, useState } from 'react';
import { BottomSheet } from '@/ui/components/BottomSheet';
import { CatLottie } from '@/ui/components/CatLottie';
import Image from 'next/image';
import { Eye, Heart, Loader2, Sparkles, Target, Users } from 'lucide-react';
import igIcon from '@/ui/assets/instagram.svg';
import ttIcon from '@/ui/assets/tiktok.svg';
import ytIcon from '@/ui/assets/youtube.svg';
import Link from 'next/link';

export type ServiceItem = {
  sid: string;
  name: string;
  category: string;
  min: number;
  max: number;
  pricePer1000: number;
  basePricePer1000?: number;
  markupType?: string;
  markupValue?: number;
  is_fast?: boolean;
  refill?: boolean;
};

const intentOptions = [
  { id: 'ig-followers', label: 'Instagram Followers', icon: <Users size={18} /> },
  { id: 'ig-likes', label: 'Instagram Likes', icon: <Heart size={18} /> },
  { id: 'ig-views', label: 'Instagram Views', icon: <Eye size={18} /> },
  { id: 'explore', label: 'Masih bingung, lihat-lihat dulu', icon: <Sparkles size={18} /> }
];

const categoryIcon = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('instagram') || lower.includes('ig')) return igIcon;
  if (lower.includes('tiktok')) return ttIcon;
  if (lower.includes('youtube') || lower.includes('yt')) return ytIcon;
  return igIcon;
};

export default function HomePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Nyiapin layanan…');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeIntent, setActiveIntent] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const messages = ['Nyiapin layanan…', 'Cek sistem pembayaran…', 'Hampir siap…'];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setLoadingMessage(messages[idx]);
    }, 1300);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Gagal memuat layanan');
        setServices(data.services || []);
      } catch (err: any) {
        setLoadError('Layanan belum bisa dimuat. Coba lagi sebentar.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!activeIntent) return services;
    const intents: Record<string, (svc: ServiceItem) => boolean> = {
      'ig-followers': (svc) => svc.category.toLowerCase().includes('follow'),
      'ig-likes': (svc) => svc.category.toLowerCase().includes('like'),
      'ig-views': (svc) => svc.category.toLowerCase().includes('view'),
      explore: () => true,
    };
    const predicate = intents[activeIntent] || intents.explore;
    return services.filter(predicate);
  }, [services, activeIntent]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <CatLottie variant="loading" size="lg" />
        <p className="mt-4 text-lg font-semibold text-slate-700">{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-5 px-4 py-6">
        <div className="flex items-center justify-between rounded-3xl bg-white px-4 py-4 shadow-soft">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Sekedar Store</div>
            <div className="text-lg font-semibold text-slate-900 leading-tight">Naikin akun kamu, tanpa ribet.</div>
            <div className="text-xs text-slate-500">Pilih layanan, bayar QRIS, sistem jalan otomatis.</div>
          </div>
          <CatLottie variant="intro" size="sm" />
        </div>

        <section className="card space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-800">Mau naikin apa hari ini?</div>
              <p className="text-xs text-slate-500">Harga sudah termasuk biaya layanan & sistem otomatis.</p>
            </div>
            <Target size={18} className="text-brand" />
          </div>

          <div className="space-y-2">
            {intentOptions.map((opt) => (
              <button
                key={opt.id}
                disabled={loading || !!loadError}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-soft transition hover:border-brand"
                onClick={() => {
                  setActiveIntent(opt.id);
                  setSheetOpen(true);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-slate-100 p-2 text-brand">{opt.icon}</div>
                  <div className="text-sm font-semibold text-slate-900">{opt.label}</div>
                </div>
                <Sparkles size={16} className="text-amber-500" />
              </button>
            ))}
          </div>

          {loadError && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {loadError}
              <button
                className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold"
                onClick={() => {
                  setActiveIntent(null);
                  setSheetOpen(false);
                  setLoading(true);
                  setLoadError('');
                  fetch('/api/services')
                    .then(async (res) => {
                      const data = await res.json();
                      if (!res.ok) throw new Error(data?.message || 'Gagal memuat');
                      setServices(data.services || []);
                    })
                    .catch(() => setLoadError('Layanan belum bisa dimuat. Coba lagi sebentar.'))
                    .finally(() => setLoading(false));
                }}
              >
                Coba lagi
              </button>
            </div>
          )}
        </section>
      </main>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Pilih layanan">
        <div className="mb-3 text-[13px] text-slate-600">Beda layanan beda hasil. Pilih yang pas dulu.</div>
        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-sm text-slate-500">
            <Loader2 className="animate-spin text-slate-400" size={18} />
            <div>Layanan belum tersedia. Coba lagi sebentar.</div>
          </div>
        )}
        <div className="space-y-2">
          {filtered.map((svc) => (
            <Link
              key={svc.sid}
              href={`/checkout/${svc.sid}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 px-3 py-3 hover:bg-slate-50"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full bg-white shadow-soft">
                <Image src={categoryIcon(svc.category)} alt={svc.category} width={40} height={40} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold leading-tight text-slate-900">{svc.name}</div>
                <div className="text-[11px] text-slate-500">Min {svc.min} · Max {svc.max}</div>
                <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">Rp{svc.pricePer1000.toLocaleString('id-ID')} /1k</span>
                  {svc.is_fast && <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Fast</span>}
                  {svc.refill && <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">Refill</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
