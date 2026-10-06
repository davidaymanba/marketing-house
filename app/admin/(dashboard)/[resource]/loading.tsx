import { Skeleton } from "@/components/admin/ui";

export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
      <Skeleton className="mb-4 h-11 max-w-sm" />
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-[74px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
