// components/skeletons/NewsSectionSkeleton.tsx
 
import { Skeleton } from "@/components/ui/skeleton";

// Desktop Skeleton
const DesktopSkeleton = () => {
  return (
    <div className="w-full mx-auto overflow-hidden">
      {/* Trending Header Skeleton */}
      <div className="flex items-center gap-2 my-6">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3">
          <Skeleton className="h-8 md:h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* Trending Items Grid Skeleton */}
      <div className="py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="group bg-card rounded-xl overflow-hidden shadow-md border border-gray-100"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6" />
                    <div className="flex items-center gap-1 pt-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link Skeleton */}
        <div className="flex justify-end border-t pt-6 mt-4">
          <Skeleton className="h-5 w-40" />
        </div>
      </div>
    </div>
  );
};

// Mobile Skeleton
const MobileSkeleton = () => {
  return (
    <div className="w-full overflow-hidden">
      {/* Trending Header Skeleton */}
      <div className="my-5 flex items-center gap-2">
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Hero Section Skeleton - Mobile */}
      <div className="relative max-sm:h-[80vw] overflow-hidden rounded-xl">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>

      {/* Trending Items List Skeleton - Mobile */}
      <div className="my-5">
        <div className="space-y-4 mb-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card overflow-hidden">
              <div className="flex">
                <Skeleton className="w-24 h-24 shrink-0 rounded-l-lg" />
                <div className="flex-1 p-3">
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="flex items-center gap-1 pt-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link Skeleton - Mobile */}
        <div className="border-t pt-4">
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </div>
  );
};

// Main Responsive Skeleton
export const NewsSectionSkeleton = () => {
  return (
    <div className="py-12 space-y-8 ">
      <div className="hidden md:block">
        <DesktopSkeleton />
      </div>
      <div className="block md:hidden">
        <MobileSkeleton />
      </div>
    </div>
  );
};
