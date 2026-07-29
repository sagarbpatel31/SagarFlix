"use client";

import type { ReactNode } from "react";
import { Children, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ContentRowProps<T> = {
  title: string;
  description?: string;
  href?: string;
  items?: T[];
  renderItem?: (item: T, index: number) => ReactNode;
  children?: ReactNode;
};

export function ContentRow<T>({
  title,
  description,
  href,
  items,
  renderItem,
  children,
}: ContentRowProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const updateScrollState = () => {
    const node = scrollerRef.current;
    if (!node) return;
    const maxScrollLeft = node.scrollWidth - node.clientWidth - 2;
    setCanScrollLeft(node.scrollLeft > 1);
    setCanScrollRight(node.scrollLeft < maxScrollLeft);
  };

  useEffect(() => {
    updateScrollState();
    const node = scrollerRef.current;
    if (!node) return;
    node.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items?.length]);

  const scrollByAmount = (direction: "left" | "right") => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.max(320, node.clientWidth * 0.8);
    node.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  const rendered = items && renderItem ? items.map(renderItem) : Children.toArray(children);

  return (
    <section
      className="group/row space-y-3"
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex flex-col gap-3 px-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h2>
          </div>
          {description ? (
            <p className="mt-1 pl-4 text-sm leading-6 text-white/55">{description}</p>
          ) : null}
        </div>

        {href ? (
          <Link
            href={href}
            className="pl-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/0 transition group-hover/row:text-white/60 hover:!text-white sm:pl-0"
          >
            Explore all ›
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label={`Scroll ${title} left`}
          onClick={() => scrollByAmount("left")}
          className={cn(
            "absolute left-0 top-0 z-40 hidden h-[calc(100%-4rem)] w-12 items-center justify-center rounded-r-lg bg-gradient-to-r from-black/85 to-transparent text-white opacity-0 transition group-hover/row:opacity-100 md:flex",
            canScrollLeft ? "cursor-pointer" : "pointer-events-none !opacity-0",
          )}
        >
          <ChevronLeft className="h-8 w-8 drop-shadow-lg" />
        </button>

        <div
          ref={scrollerRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-24 pt-2"
        >
          {rendered.map((child, index) => {
            // The hovered tile scales up and pushes its neighbours outward,
            // which is the interaction that makes a row feel like Netflix
            // rather than a generic carousel.
            const isHovered = hovered === index;
            const direction = hovered === null ? 0 : index < hovered ? -1 : index > hovered ? 1 : 0;

            return (
              <motion.div
                key={index}
                onMouseEnter={() => setHovered(index)}
                animate={{
                  x: direction * 26,
                  scale: isHovered ? 1.14 : 1,
                }}
                transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.6 }}
                style={{
                  zIndex: isHovered ? 30 : 1,
                  transformOrigin:
                    index === 0 ? "center left" : index === rendered.length - 1 ? "center right" : "center",
                }}
                className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
              >
                {/* Dimming the unhovered tiles is what pulls the eye to the
                    focused one. The card opens its own drawer on hover. */}
                <div
                  className={cn(
                    "h-full transition-[filter] duration-300",
                    hovered !== null && !isHovered ? "brightness-[0.55]" : "brightness-100",
                  )}
                >
                  {child}
                </div>
              </motion.div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label={`Scroll ${title} right`}
          onClick={() => scrollByAmount("right")}
          className={cn(
            "absolute right-0 top-0 z-40 hidden h-[calc(100%-4rem)] w-12 items-center justify-center rounded-l-lg bg-gradient-to-l from-black/85 to-transparent text-white opacity-0 transition group-hover/row:opacity-100 md:flex",
            canScrollRight ? "cursor-pointer" : "pointer-events-none !opacity-0",
          )}
        >
          <ChevronRight className="h-8 w-8 drop-shadow-lg" />
        </button>
      </div>
    </section>
  );
}
