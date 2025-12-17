import Link from 'next/link';
import { CatLottie } from '@/ui/components/CatLottie';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <CatLottie variant="notFound" size="lg" />
      <div className="text-xl font-semibold">Halaman tidak ditemukan</div>
      <p className="text-slate-500">Periksa kembali tautan yang kamu buka.</p>
      <Link href="/" className="button-primary max-w-xs">Kembali</Link>
    </div>
  );
}
