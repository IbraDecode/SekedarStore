'use client';

import { CatLottie, variantMap, Variant } from './CatLottie';

const variants = Object.keys(variantMap) as Variant[];

/**
 * Preload all lotties once at app start to avoid flicker.
 * Hidden from layout so only one visible lottie is active per screen.
 */
export function LottiePreload() {
  return (
    <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden>
      {variants.map((variant) => (
        <CatLottie key={variant} variant={variant} autoplay loop className="h-0 w-0" />
      ))}
    </div>
  );
}
