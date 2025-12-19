'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CatLottie } from '@/ui/components/CatLottie';
import { Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="flex flex-col items-center text-center gap-6 py-12">
          <div className="w-36 h-36">
            <CatLottie variant="intro" size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            Naikin akun kamu, tanpa ribet.
          </h1>
          <p className="text-slate-600 max-w-sm leading-relaxed">
            Pilih layanan, bayar QRIS, sistem jalan otomatis. Tidak perlu login atau chat admin.
          </p>
          <button className="button-primary w-full max-w-xs" onClick={() => router.push('/')}>
            Mulai sekarang
          </button>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-700">
            <Sparkles size={14} className="text-brand" /> 1 layar, 1 fokus. Aman buat pemula.
          </div>
        </div>
      </div>
    </div>
  );
}
