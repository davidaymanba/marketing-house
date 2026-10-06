import { Skeleton } from "@/components/admin/ui";

export default function Loading() {
  return (
    <div aria-busy="true">
      <Skeleton className="mb-8 h-9 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-card" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <Skeleton className="h-80 rounded-card xl:col-span-3" />
        <Skeleton className="h-80 rounded-card xl:col-span-2" />
      </div>
    </div>
  );
}
