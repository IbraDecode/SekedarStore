import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sekedar Store',
  description: 'On-demand SMM services with instant QRIS payment.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
