export function SkeletonCard() {
  return (
    <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 bg-white dark:bg-slate-900 animate-pulse">
      <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="space-y-1.5 pt-2">
        <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-2.5 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
      <div className="flex justify-between pt-2">
        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  );
}
