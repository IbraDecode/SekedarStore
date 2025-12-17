import clsx from 'clsx';

export type ShimmerProps = {
  className?: string;
};

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-full bg-slate-200',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent',
        className
      )}
    />
  );
}
