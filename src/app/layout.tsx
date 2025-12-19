import type { Metadata } from 'next';
import './globals.css';
import { LottiePreload } from '@/ui/components/LottiePreload';

export const metadata: Metadata = {
  title: 'Sekedar Store',
  description: 'On-demand SMM services with instant QRIS payment.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-slate-50 antialiased">
        <LottiePreload />
        {children}
      </body>
    </html>
  );
}
