import Skeleton from "@/components/ui/Skeleton";

export default function IncomeSkeleton() {
  return (
    <div className="ml-64 p-10 space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}
