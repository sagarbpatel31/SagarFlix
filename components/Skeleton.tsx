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
