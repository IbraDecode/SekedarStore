'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CatLottie } from '@/ui/components/CatLottie';

const steps = [
  { variant: 'hint', text: 'Pilih layanan yang kamu butuh.' },
  { variant: 'hint', text: 'Isi target dan jumlah. Pastikan benar.' },
  { variant: 'hint', text: 'Bayar QRIS. Sistem langsung proses.' },
  { variant: 'successCheck', text: 'Cek status di halaman invoice. Selesai.' },
];

export default function CaraPakaiPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, []);

  const next = () => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      localStorage.setItem('skd_help_seen', 'true');
      router.push('/');
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        <CatLottie variant={steps[step].variant as any} size="lg" />
        <div className="text-2xl font-semibold">{steps[step].text}</div>
        <p className="text-slate-600">Cat jelasin supaya kamu cepat paham.</p>
        <button className="button-primary" onClick={next}>
          {step === steps.length - 1 ? 'Oke, paham' : 'Lanjut'}
        </button>
      </div>
    </div>
  );
}
