import Skeleton from "@/components/ui/Skeleton";

export default function OwnerDashboardSkeleton() {
  return (
    <div className="ml-64 p-10 space-y-10">
      {/* Hero */}
      <Skeleton className="h-64 w-full rounded-xl" />

      {/* Owner Header */}
      <Skeleton className="h-24 w-full rounded-xl" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      {/* Financial + Income */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>

      {/* Documents */}
      <Skeleton className="h-64 w-full rounded-xl" />

      {/* Checks */}
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
