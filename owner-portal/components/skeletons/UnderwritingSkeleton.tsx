import Skeleton from "@/components/ui/Skeleton";

export default function UnderwritingSkeleton() {
  return (
    <div className="ml-64 p-10 space-y-10">
      <Skeleton className="h-10 w-80" />

      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
