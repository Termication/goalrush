import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePageSkeleton() {
  return (
    <div className="space-y-2 p-4 md:p-6 lg:p-8">
      {/* --- Skeleton for Hero Section --- */}
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl bg-muted lg:grid lg:grid-cols-5 lg:gap-1">
          <div className="relative h-[20vh] lg:h-[20vh] lg:col-span-5">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="absolute bottom-0 left-0 p-6 w-full lg:static lg:col-start-1 lg:col-span-3 lg:row-start-1 lg:bg-black/10 lg:m-6 lg:rounded-xl lg:self-center">
            <Skeleton className="h-6 w-32 mb-3 rounded-full" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-10 w-1/2 mb-4" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
      </div>

      {/* --- Skeleton for Headlines Grid --- */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden h-full">
            <Skeleton className="relative w-full h-48" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
