import { Skeleton } from "@/components/ui/skeleton"

export default function MoreHeadlinesSkeleton() {
  return (
    <section className="px-4 py-6">
      <Skeleton className="h-7 w-48 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 border rounded-md">
            <Skeleton className="w-12 h-12 rounded flex-shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}