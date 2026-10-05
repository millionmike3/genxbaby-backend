import Skeleton from "@/components/ui/Skeleton";

export default function DocumentsSkeleton() {
  return (
    <div className="ml-64 p-10 space-y-6">
      <Skeleton className="h-10 w-64" />

      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
