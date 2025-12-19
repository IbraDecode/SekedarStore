'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CatLottie } from '@/ui/components/CatLottie';

const steps = [0, 1, 2, 3] as const;

type Step = (typeof steps)[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [choice, setChoice] = useState('');
  const [wa, setWa] = useState('');

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  const next = () => setStep((s) => Math.min(3, s + 1) as Step);

  const finish = () => {
    if (wa) {
      localStorage.setItem('skd_wa', wa);
    }
    localStorage.setItem('skd_onboarded', 'true');
    router.push('/cara-pakai');
    setTimeout(() => router.push('/'), 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index <= step ? 'bg-brand' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-32 h-32">
              <CatLottie variant="intro" size="lg" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Halo! 👋</h1>
            <p className="text-slate-600 max-w-sm leading-relaxed">
              Saya kucing digital yang akan bantu kamu beli layanan sosial media dengan cepat dan mudah.
            </p>
            <button className="button-primary w-full max-w-xs" onClick={next}>
              Mulai
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-24 h-24">
              <CatLottie variant="hint" size="md" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Pilih layanan</h2>
            <p className="text-slate-600 mb-4">Apa yang kamu butuhkan?</p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {[
                { icon: '👥', label: 'Followers', desc: 'Tambah followers' },
                { icon: '❤️', label: 'Likes', desc: 'Tambah likes' },
                { icon: '👀', label: 'Views', desc: 'Tambah views' },
                { icon: '🔍', label: 'Lihat dulu', desc: 'Jelajah layanan' }
              ].map((item) => (
                <button
                  key={item.label}
                  className="card p-4 text-left hover:border-brand hover:bg-brand/5 transition-all"
                  onClick={() => {
                    setChoice(item.label);
                    next();
                  }}
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-semibold text-slate-900">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-24 h-24">
              <CatLottie variant="hint" size="md" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Notifikasi WhatsApp</h2>
            <p className="text-slate-600">Dapatkan update order via WhatsApp (opsional)</p>
            <div className="w-full max-w-sm space-y-4">
              <input
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                placeholder="62xxx (opsional)"
                className="field"
              />
              <div className="flex w-full gap-3">
                <button className="button-secondary flex-1" onClick={next}>
                  Lewati
                </button>
                <button className="button-primary flex-1" onClick={next}>
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-6 py-8">
            <div className="w-32 h-32">
              <CatLottie variant="welcome" size="lg" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Siap! 🎉</h2>
            <p className="text-slate-600 max-w-sm leading-relaxed">
              Sekarang kamu bisa mulai beli layanan sosial media dengan harga terjangkau.
            </p>
            <button className="button-primary w-full max-w-xs" onClick={finish}>
              Mulai Belanja
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
