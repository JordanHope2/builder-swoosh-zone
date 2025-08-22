interface SkeletonProps {
  className?: string;
  rounded?: boolean;
  circle?: boolean;
}

function Skeleton({
  className = "",
  rounded = false,
  circle = false,
}: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer bg-gradient-to-r from-jobequal-neutral via-jobequal-neutral-dark to-jobequal-neutral bg-[length:1000px_100%] ${
        circle ? "rounded-full" : rounded ? "rounded-lg" : "rounded"
      } ${className}`}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-jobequal-neutral-dark animate-pulse">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
            <Skeleton
              circle
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
            />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24 sm:w-32" />
              <Skeleton className="h-6 w-full max-w-xs" />
              <Skeleton className="h-4 w-20 sm:w-28" />
            </div>
          </div>
          <Skeleton circle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Tags */}
        <div className="flex space-x-2">
          <Skeleton rounded className="h-6 w-16" />
          <Skeleton rounded className="h-6 w-12" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Skills */}
        <div className="flex space-x-2">
          <Skeleton rounded className="h-6 w-16" />
          <Skeleton rounded className="h-6 w-20" />
          <Skeleton rounded className="h-6 w-14" />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-jobequal-neutral-dark">
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton rounded className="h-8 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSkeletonLoader() {
  return (
    <section className="relative bg-gradient-to-br from-white via-jobequal-neutral to-jobequal-blue overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        {/* Header skeleton */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <Skeleton className="h-6 w-48 mx-auto mb-4" />
          <div className="space-y-4 mb-6">
            <Skeleton className="h-12 sm:h-16 lg:h-20 w-full max-w-4xl mx-auto" />
            <Skeleton className="h-8 sm:h-12 lg:h-16 w-3/4 max-w-3xl mx-auto" />
          </div>
          <Skeleton className="h-6 w-full max-w-4xl mx-auto" />
        </div>

        {/* Cards skeleton */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-14 shadow-2xl border border-jobequal-neutral-dark"
            >
              <div className="text-center space-y-6">
                <Skeleton
                  circle
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
                />
                <Skeleton className="h-8 sm:h-10 w-48 mx-auto" />
                <Skeleton className="h-6 w-full" />
                <div className="space-y-4">
                  <Skeleton rounded className="h-12 w-full" />
                  <Skeleton rounded className="h-12 w-full" />
                  <Skeleton rounded className="h-12 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedJobsSkeleton() {
  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-gradient-to-b from-jobequal-neutral to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-12 sm:h-16 w-80 mx-auto mb-6" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            <Skeleton className="h-6 w-3/4 max-w-2xl mx-auto" />
          </div>
        </div>

        {/* Job cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-12 sm:mb-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>

        {/* CTA skeleton */}
        <div className="text-center">
          <Skeleton rounded className="h-12 w-48 mx-auto" />
        </div>
      </div>
    </section>
  );
}

export { Skeleton };
