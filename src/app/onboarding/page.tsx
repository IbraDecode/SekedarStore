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

  const next = () => setStep((s) => Math.min(3, (s + 1) as Step));

  const finish = () => {
    if (wa) {
      localStorage.setItem('skd_wa', wa);
    }
    localStorage.setItem('skd_onboarded', 'true');
    router.push('/cara-pakai');
    setTimeout(() => router.push('/'), 800);
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      {step === 0 && (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <CatLottie variant="intro" size="lg" />
          <div className="text-2xl font-semibold">Halo, saya kucing kamu.</div>
          <p className="text-slate-600">Aku bantu kamu beli layanan dengan cepat. Semua proses otomatis.</p>
          <button className="button-primary" onClick={next}>
            Mulai
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <CatLottie variant="hint" size="lg" />
          <div className="text-2xl font-semibold">Mau beli layanan apa?</div>
          <div className="w-full space-y-3">
            {['Beli Followers', 'Beli Likes', 'Beli Views', 'Lihat-lihat dulu'].map((label) => (
              <button
                key={label}
                className="button-secondary"
                onClick={() => {
                  setChoice(label);
                  next();
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <CatLottie variant="hint" size="lg" />
          <div className="text-2xl font-semibold">Mau dapat notifikasi di WhatsApp?</div>
          <input
            value={wa}
            onChange={(e) => setWa(e.target.value)}
            placeholder="62xxxx"
            className="field"
          />
          <div className="flex w-full gap-3">
            <button className="button-secondary" onClick={next}>
              Lewati
            </button>
            <button className="button-primary" onClick={next}>
              Lanjut
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <CatLottie variant="welcome" size="lg" />
          <div className="text-2xl font-semibold">Oke, siap.</div>
          <p className="text-slate-600">Sekarang kamu tinggal pilih layanan.</p>
          <button className="button-primary" onClick={finish}>
            Masuk
          </button>
        </div>
      )}
    </div>
  );
}
