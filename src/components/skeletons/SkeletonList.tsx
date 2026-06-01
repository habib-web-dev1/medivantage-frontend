export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl bg-white dark:bg-slate-900 animate-pulse flex gap-4"
        >
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0" />
        </div>
      ))}
    </div>
  );
}
