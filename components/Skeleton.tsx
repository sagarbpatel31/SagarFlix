import { cn } from "@/lib/utils";

/**
 * Shimmer placeholder.
 *
 * Uses the `shimmer` keyframe that already lives in the Tailwind theme but was
 * never wired to anything. The sweep is what makes a loading row read as
 * "content is coming" rather than "something is broken".
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_25%,rgba(255,255,255,0.10)_37%,rgba(255,255,255,0.04)_63%)] bg-[length:200%_100%]",
        className,
      )}
    />
  );
}

/** Placeholder shaped like a TitleCard, for rows that are still loading. */
export function TitleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-panel">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

/** A full row of placeholders, matching the live row's tile widths. */
export function ContentRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3 px-1">
        <span className="h-7 w-1 rounded-full bg-white/10" />
        <Skeleton className="h-6 w-56" />
      </div>
      <div className="flex gap-2 px-1">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="w-[78%] shrink-0 sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
          >
            <TitleCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
