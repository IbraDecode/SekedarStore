'use client';

import { useEffect, useMemo, useState } from 'react';
import { BottomSheet } from '@/ui/components/BottomSheet';
import { CatLottie } from '@/ui/components/CatLottie';
import { ServiceSkeletonRow } from '@/ui/components/ServiceSkeletonRow';
import Image from 'next/image';
import { Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import igIcon from '@/ui/assets/instagram.svg';
import ttIcon from '@/ui/assets/tiktok.svg';
import ytIcon from '@/ui/assets/youtube.svg';

export type ServiceItem = {
  sid: string;
  name: string;
  category: string;
  min: number;
  max: number;
  price: number;
};

const categories = ['All', 'IG', 'TikTok', 'YouTube', 'Followers', 'Likes', 'Views'];

const mockServices: ServiceItem[] = [
  { sid: 'ig-follow', name: 'Instagram Followers Real', category: 'IG Followers', min: 50, max: 10000, price: 25000 },
  { sid: 'ig-like', name: 'IG Likes Cepat', category: 'IG Likes', min: 50, max: 5000, price: 12000 },
  { sid: 'tt-view', name: 'TikTok Views Boost', category: 'TikTok Views', min: 100, max: 20000, price: 18000 },
  { sid: 'yt-sub', name: 'YouTube Subscribers', category: 'YouTube Followers', min: 10, max: 2000, price: 90000 },
  { sid: 'tt-like', name: 'TikTok Likes', category: 'TikTok Likes', min: 100, max: 15000, price: 15000 },
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
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [services, setServices] = useState<ServiceItem[]>(mockServices);

  useEffect(() => {
    // onboarding flow enforcement on client
    const onboarded = typeof window !== 'undefined' && localStorage.getItem('skd_onboarded');
    const help = typeof window !== 'undefined' && localStorage.getItem('skd_help_seen');
    if (!onboarded) {
      window.location.href = '/onboarding';
    } else if (!help) {
      window.location.href = '/cara-pakai';
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  }, []);

  const filtered = useMemo(() => {
    return services.filter((svc) => {
      const matchesTab =
        activeTab === 'All' || svc.category.toLowerCase().includes(activeTab.toLowerCase()) || svc.name.toLowerCase().includes(activeTab.toLowerCase());
      const matchesQuery = svc.name.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [services, query, activeTab]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50">
      <main className="mx-auto flex h-screen max-w-md flex-col gap-4 px-4 py-5">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Sekedar Store</div>
            <div className="text-xl font-semibold">Pesan kilat, tanpa ribet</div>
          </div>
          <Link href="/cara-pakai" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold shadow-soft">
            Cara Pakai
          </Link>
        </header>

        <div className="card flex items-center gap-3">
          <Search className="text-slate-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari layanan"
            className="w-full border-none bg-transparent text-base outline-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['Followers', 'Likes', 'Views'].map((item) => (
            <button
              key={item}
              className="rounded-2xl bg-white px-3 py-3 text-center text-sm font-semibold shadow-soft"
              onClick={() => {
                setActiveTab(item);
                setSheetOpen(true);
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <button className="button-primary" onClick={() => setSheetOpen(true)}>
          Pilih Layanan
        </button>

        <section className="card flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Sparkles size={16} /> Top layanan
          </div>
          <div className="space-y-3">
            {mockServices.slice(0, 5).map((svc) => (
              <div key={svc.sid} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-white shadow-soft">
                  <Image src={categoryIcon(svc.category)} alt={svc.category} width={40} height={40} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{svc.name}</div>
                  <div className="text-xs text-slate-500">Min {svc.min} - Max {svc.max}</div>
                </div>
                <Link href={`/checkout/${svc.sid}`} className="rounded-full bg-accent px-3 py-2 text-xs font-semibold text-white">
                  Pilih
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Pilih layanan">
        <div className="mb-3 flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2">
          <Search size={16} className="text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Cari layanan"
          />
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${activeTab === cat ? 'bg-accent text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-2">
            <ServiceSkeletonRow />
            <ServiceSkeletonRow />
            <ServiceSkeletonRow />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-slate-500">
            <CatLottie variant="loading" size="sm" />
            Tidak ada layanan.
          </div>
        ) : (
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
                  <div className="text-sm font-semibold">{svc.name}</div>
                  <div className="text-xs text-slate-500">Min {svc.min} - Max {svc.max}</div>
                </div>
                <div className="text-xs font-semibold text-accent">Rp{svc.price.toLocaleString('id-ID')}</div>
              </Link>
            ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
