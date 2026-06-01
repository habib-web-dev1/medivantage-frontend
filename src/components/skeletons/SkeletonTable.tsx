export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-slate-100 dark:bg-slate-800 p-4 flex gap-4">
        {[40, 25, 20, 15].map((w, i) => (
          <div
            key={i}
            className="h-4 bg-slate-300 dark:bg-slate-600 rounded"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-4 flex gap-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          {[40, 25, 20, 15].map((w, j) => (
            <div
              key={j}
              className="h-3 bg-slate-200 dark:bg-slate-700 rounded"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
