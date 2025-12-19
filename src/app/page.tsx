'use client';

import { useEffect, useMemo, useState } from 'react';
import { BottomSheet } from '@/ui/components/BottomSheet';
import { CatLottie } from '@/ui/components/CatLottie';
import { ServiceSkeletonRow } from '@/ui/components/ServiceSkeletonRow';
import Image from 'next/image';
import { Eye, Heart, QrCode, Search, Sparkles, Users, X } from 'lucide-react';
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
  pricePer1000: number;
  basePricePer1000?: number;
  markupType?: string;
  markupValue?: number;
};

const categoryOptions = [
  { id: 'All', label: 'Semua', icon: <Sparkles size={14} /> },
  { id: 'IG', label: 'Instagram', icon: <span className="text-[10px] font-black">IG</span> },
  { id: 'TikTok', label: 'TikTok', icon: <span className="text-[10px] font-black">TT</span> },
  { id: 'YouTube', label: 'YouTube', icon: <span className="text-[10px] font-black">YT</span> },
  { id: 'Followers', label: 'Followers', icon: <Users size={14} /> },
  { id: 'Likes', label: 'Likes', icon: <Heart size={14} /> },
  { id: 'Views', label: 'Views', icon: <Eye size={14} /> }
];

const mockServices: ServiceItem[] = [
  { sid: 'ig-follow', name: 'Instagram Followers Real', category: 'IG Followers', min: 50, max: 10000, pricePer1000: 25000 },
  { sid: 'ig-like', name: 'IG Likes Cepat', category: 'IG Likes', min: 50, max: 5000, pricePer1000: 12000 },
  { sid: 'tt-view', name: 'TikTok Views Boost', category: 'TikTok Views', min: 100, max: 20000, pricePer1000: 18000 },
  { sid: 'yt-sub', name: 'YouTube Subscribers', category: 'YouTube Followers', min: 10, max: 2000, pricePer1000: 90000 },
  { sid: 'tt-like', name: 'TikTok Likes', category: 'TikTok Likes', min: 100, max: 15000, pricePer1000: 15000 },
  { sid: '2460', name: 'YouTube Short Likes NonDrop Max 20K', category: 'YouTube Shorts Views | Likes', min: 12, max: 50000, pricePer1000: 18738 },
  { sid: '2060', name: 'Shopee Followers Indonesia', category: 'Shopee Followers Indonesia', min: 120, max: 25000, pricePer1000: 27087 },
  { sid: '2061', name: 'Shopee Followers Indonesia MAX 30K', category: 'Shopee Followers Indonesia', min: 120, max: 36000, pricePer1000: 43200 },
  { sid: '2062', name: 'Shopee Followers Indonesia MAX 50K', category: 'Shopee Followers Indonesia', min: 60, max: 50000, pricePer1000: 21384 },
  { sid: '2067', name: 'Shopee Video Likes', category: 'Shopee Video Views/Likes/Favorite/Shares', min: 12, max: 40000, pricePer1000: 9980 },
  { sid: '2084', name: 'Tokopedia Feed Video Views', category: 'Tokopedia Feed', min: 120, max: 1000000, pricePer1000: 12962 },
  { sid: '2087', name: 'Tiktok Comment Likes', category: 'Tiktok Comments', min: 12, max: 100000, pricePer1000: 7128 },
  { sid: '2088', name: 'Tiktok Emoji Comments', category: 'Tiktok Comments', min: 12, max: 100000, pricePer1000: 18533 },
  { sid: '2091', name: 'Snack Video Likes', category: 'Snack Video Likes', min: 60, max: 50000, pricePer1000: 9945 },
  { sid: '2092', name: 'Snack Video Likes Real Instan Max10K', category: 'Snack Video Likes', min: 60, max: 10000, pricePer1000: 11994 },
  { sid: '2093', name: 'Snack Video Views FAST INSTAN MAX 1M', category: 'Snack Video Views', min: 60000, max: 1000000, pricePer1000: 13527 },
  { sid: '2094', name: 'Shopee Live Stream Views Max 50K', category: 'Shopee Live Stream View S3', min: 12, max: 100000, pricePer1000: 68429 },
  { sid: '4187', name: 'Tiktok Likes', category: 'Tiktok Combined [ Video Services ]', min: 12, max: 500000, pricePer1000: 5702 },
  { sid: '4289', name: 'TikTok 3x Views + Shares + Downloads + Saves', category: 'Tiktok Combined [ Video Services ]', min: 120, max: 2147483647, pricePer1000: 3564 },
  { sid: '667', name: 'TikTok Followers', category: 'Tiktok Followers | New Update | 15/04/2025', min: 12, max: 10000000, pricePer1000: 16252 },
  { sid: '2115', name: 'Instagram Likes Max 1M', category: 'Instagram Likes | New Update | 15/04/2025', min: 12, max: 1000000, pricePer1000: 4039 },
  { sid: '2116', name: 'Instagram Likes Max 50M', category: 'Instagram Likes | New Update | 15/04/2025', min: 12, max: 50000000, pricePer1000: 4281 }
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
  const [hydrate, setHydrate] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    // onboarding flow enforcement on client
    const onboarded = typeof window !== 'undefined' && localStorage.getItem('skd_onboarded');
    const help = typeof window !== 'undefined' && localStorage.getItem('skd_help_seen');
    if (!onboarded) {
      window.location.href = '/onboarding';
    } else if (!help) {
      window.location.href = '/cara-pakai';
    }
    setHydrate(true);
  }, []);

  useEffect(() => {
    if (!hydrate) return;

    const loadServices = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (data.services) {
          setServices(data.services);
          return;
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      }
      setLoadError('Gagal memuat layanan. Menampilkan data cadangan.');
      setServices(mockServices); // Fallback to mock
    };
    
    loadServices().finally(() => setLoading(false));
  }, [hydrate]);

  const filtered = useMemo(() => {
    if (!services.length) return [];
    
    const searchQuery = query.toLowerCase();
    const tabQuery = activeTab.toLowerCase();
    
    return services.filter((svc) => {
      // Search filter
      const matchesQuery = !query || 
        svc.name.toLowerCase().includes(searchQuery) || 
        svc.category.toLowerCase().includes(searchQuery) ||
        tabQuery.includes('instagram') && svc.category.toLowerCase().includes('ig') ||
        tabQuery.includes('tiktok') && svc.category.toLowerCase().includes('tiktok') ||
        tabQuery.includes('youtube') && svc.category.toLowerCase().includes('youtube') ||
        tabQuery.includes('followers') && svc.name.toLowerCase().includes('followers') ||
        tabQuery.includes('likes') && svc.name.toLowerCase().includes('likes') ||
        tabQuery.includes('views') && svc.name.toLowerCase().includes('views');
      
      // Tab filter
      const matchesTab = activeTab === 'All' || 
        svc.category.toLowerCase().includes(tabQuery) ||
        svc.name.toLowerCase().includes(tabQuery) ||
        (tabQuery.includes('instagram') && svc.category.toLowerCase().includes('ig')) ||
        (tabQuery.includes('tiktok') && svc.category.toLowerCase().includes('tiktok')) ||
        (tabQuery.includes('youtube') && svc.category.toLowerCase().includes('youtube')) ||
        (tabQuery.includes('followers') && svc.name.toLowerCase().includes('followers')) ||
        (tabQuery.includes('likes') && svc.name.toLowerCase().includes('likes')) ||
        (tabQuery.includes('views') && svc.name.toLowerCase().includes('views'));
      
      return matchesTab && matchesQuery;
    });
  }, [services, query, activeTab]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 px-4 py-5 pb-24">
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
              <span className="inline-flex items-center justify-center gap-2 text-sm">
                {item === 'Followers' && <Users size={16} />}
                {item === 'Likes' && <Heart size={16} />}
                {item === 'Views' && <Eye size={16} />}
                {item}
              </span>
            </button>
          ))}
        </div>

        <button className="button-primary" onClick={() => setSheetOpen(true)}>
          <div className="flex items-center justify-center gap-2">
            <QrCode size={18} />
            <span>Pilih Layanan</span>
          </div>
        </button>

        <section className="card flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Sparkles size={16} /> Top layanan
          </div>
          <div className="space-y-3">
            {(loading ? mockServices : services).slice(0, 5).map((svc) => {
              const displayPrice = svc.pricePer1000 ?? (svc as any).price ?? 0;
              return (
                <div key={svc.sid} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-white shadow-soft">
                    <Image src={categoryIcon(svc.category)} alt={svc.category} width={40} height={40} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{svc.name}</div>
                    <div className="text-xs text-slate-500">Min {svc.min} - Max {svc.max}</div>
                  </div>
                  <div className="text-right text-xs font-semibold text-accent min-w-[90px]">
                    Rp{displayPrice.toLocaleString('id-ID')}
                  </div>
                  <Link href={`/checkout/${svc.sid}`} className="rounded-full bg-accent px-3 py-2 text-xs font-semibold text-white">
                    Pilih
                  </Link>
                </div>
              );
            })}
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
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-2 ${activeTab === cat.id ? 'bg-accent text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              <span className="text-sm flex items-center justify-center">{cat.icon}</span>
              {cat.label}
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
                <div className="text-xs font-semibold text-accent">
                  Rp{(svc.pricePer1000 ?? (svc as any).price ?? 0).toLocaleString('id-ID')}
                </div>
              </Link>
            ))}
          </div>
        )}

        {loadError && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <X size={14} className="text-amber-500" />
            {loadError}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
