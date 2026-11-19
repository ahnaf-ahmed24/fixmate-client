

function Shimmer({ className = "" }) {
  return <div className={`bg-base-300/70 animate-pulse rounded-lg ${className}`} />;
}

export function ServiceCardSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
          <Shimmer className="h-44 rounded-none" />
          <div className="card-body p-4 gap-3">
            <Shimmer className="h-4 w-3/4" />
            <Shimmer className="h-3 w-1/2" />
            <Shimmer className="h-3 w-2/3" />
            <div className="flex justify-between items-end pt-2">
              <Shimmer className="h-6 w-16" />
              <Shimmer className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <Shimmer className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}>
                  <Shimmer className={`h-3 ${c === 0 ? "w-24" : "w-16"}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatsSkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-100 border border-base-300">
          <div className="card-body p-5 flex-row items-center gap-4">
            <Shimmer className="w-12 h-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-3 w-20" />
              <Shimmer className="h-6 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="container-page py-10">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Shimmer className="h-64 md:h-80 w-full rounded-2xl" />
          <Shimmer className="h-7 w-3/4" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-5/6" />
        </div>
        <div className="space-y-4">
          <Shimmer className="h-40 w-full rounded-2xl" />
          <Shimmer className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
