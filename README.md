# Sekedar Store

Implementasi awal web app Sekedar Store dengan Next.js 14 App Router, TailwindCSS, dan integrasi placeholder untuk Atlantic, Zaynflazz, dan Fonnte. UI mengikuti gaya mobile rounded dengan bottom sheet.

## Pengembangan

- Install dependencies: `npm install`
- Jalankan dev server: `npm run dev`
- Build: `npm run build`

## Testing

Tersedia harness di folder `scripts/`:

- `npm run test:zaynflazz`
- `npm run test:atlantic`
- `npm run test:fonnte`
- `npm run test:flow`

Siapkan `.env.local` berdasarkan `.env.example` sebelum menjalankan karena key wajib.

## Struktur

- `src/app` – route onboarding, cara-pakai, home, checkout, invoice, dan API.
- `src/ui/components` – CatLottie, BottomSheet, skeleton shimmer.
- `src/lib` – helper integrasi Firestore, Atlantic, Zaynflazz, Fonnte.
- `scripts` – test harness integrasi.
