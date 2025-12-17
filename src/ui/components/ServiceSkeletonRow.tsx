import { Shimmer } from './Shimmer';

export function ServiceSkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-2">
      <Shimmer className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-3 w-1/2" />
        <Shimmer className="h-3 w-1/3" />
      </div>
    </div>
  );
}
