import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BillboardProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Rendered as a Netflix-style metadata strip with dot separators. */
  meta?: ReactNode[];
  /** Action buttons. */
  children?: ReactNode;
  /** Rendered above the eyebrow — used for back links. */
  topSlot?: ReactNode;
  /** Tailwind gradient classes for a per-item backdrop tint. */
  accent?: string;
  size?: "sm" | "md" | "lg";
};

const heights = {
  sm: "h-[58vh] min-h-[420px]",
  md: "h-[68vh] min-h-[480px]",
  lg: "h-[88vh] min-h-[560px]",
};

/**
 * The billboard every page opens with.
 *
 * Netflix's hero is a backdrop that the copy sits on, not a bordered panel in
 * a column. Two scrims carry it: a left-to-right wash so text stays legible
 * over the artwork, and a bottom fade that dissolves into the page below
 * instead of ending on a hard edge.
 *
 * The `-mt-20` pulls the section up by exactly the navbar height so the
 * transparent navbar floats over the artwork.
 */
export function Billboard({
  eyebrow,
  title,
  description,
  meta,
  children,
  topSlot,
  accent,
  size = "md",
}: BillboardProps) {
  return (
    <section className={cn("relative -mt-20 w-full overflow-hidden", heights[size])}>
      {accent ? (
        // Accent gradients top out around 35% opacity, so they need two passes
        // and a lighter scrim to survive as colour rather than sludge.
        <>
          <div className={cn("absolute inset-0 bg-gradient-to-br", accent)} />
          <div className={cn("absolute inset-0 bg-gradient-to-tr", accent)} />
        </>
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(155deg,#180406_0%,#080808_58%,#050505_100%)]" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_28%,rgba(229,9,20,0.36),transparent_58%)]" />
      <div className="absolute inset-0 bg-cinematic-grid bg-[size:48px_48px] opacity-[0.08]" />
      <div
        className={cn(
          "absolute inset-0",
          accent
            ? "bg-[linear-gradient(90deg,rgba(5,5,5,0.92)_0%,rgba(5,5,5,0.55)_45%,transparent_82%)]"
            : "bg-[linear-gradient(90deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.7)_40%,transparent_78%)]",
        )}
      />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.9)_58%,#050505)]" />

      <div className="relative flex h-full items-end pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {topSlot}

          <p
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.4em] text-white/55",
              topSlot && "mt-6",
            )}
          >
            {eyebrow}
          </p>

          <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] sm:text-6xl">
            {title}
          </h1>

          {meta && meta.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
              {meta.map((item, index) => (
                <span key={index} className="flex items-center gap-3">
                  {item}
                  {index < meta.length - 1 ? <span className="text-white/25">•</span> : null}
                </span>
              ))}
            </div>
          ) : null}

          {description ? (
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {description}
            </p>
          ) : null}

          {children ? (
            <div className="mt-7 flex flex-wrap items-center gap-3">{children}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
