import { StatsSkeletonGrid, TableSkeleton } from "@/components/ui/Skeletons";


export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 rounded-lg bg-base-300/60 animate-pulse" />
      <StatsSkeletonGrid count={4} />
      <TableSkeleton rows={5} cols={5} />
    </div>
  );
}
