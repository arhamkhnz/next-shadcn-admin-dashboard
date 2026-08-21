import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="space-y-1">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-7 w-28 rounded-md" />
      </div>
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );
}
