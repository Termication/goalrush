import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePageSkeleton() {
  return (
    <div className="space-y-12 p-4 md:p-6 lg:p-8">
      {/* --- Mobile Hero Skeleton --- */}
      <div className="lg:hidden max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div className="relative h-[60vh]">
            <Skeleton className="h-full w-full rounded-xl bg-zinc-700" />
          </div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <Skeleton className="h-6 w-32 mb-3 rounded-full bg-zinc-700" />
            <Skeleton className="h-8 w-4/5 mb-2 bg-zinc-700" />
            <Skeleton className="h-6 w-3/4 mb-4 bg-zinc-700" />
            <Skeleton className="h-5 w-48 bg-zinc-700" />
          </div>
        </div>
      </div>

      {/* --- Desktop Hero Skeleton --- */}
      <div className="hidden lg:block max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <Skeleton className="h-8 w-40 mb-4 rounded-full bg-zinc-700" />
            <Skeleton className="h-12 w-full mb-4 bg-zinc-700" />
            <Skeleton className="h-20 w-full mb-6 bg-zinc-700" />
            <Skeleton className="h-10 w-48 rounded-md bg-zinc-700" />
          </div>
          <div className="relative h-96 w-full rounded-xl overflow-hidden">
            <Skeleton className="h-full w-full bg-zinc-700" />
          </div>
        </div>
      </div>

      {/* --- Headlines Grid Skeleton --- */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="overflow-hidden h-full relative min-h-[300px]">
            <Skeleton className="w-full h-full absolute inset-0 bg-zinc-700" />
            <CardContent className="p-1 absolute bottom-0 left-0 w-full">
              <Skeleton className="h-6 w-24 mb-2 rounded-full bg-zinc-700" />
              <Skeleton className="h-6 w-full mb-1 bg-zinc-700" />
              <Skeleton className="h-6 w-3/4 mt-2 bg-zinc-700" />
              <Skeleton className="h-4 w-32 mt-2 ml-1 bg-zinc-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
