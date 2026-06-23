"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
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

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-9 w-1 rounded-full bg-netflix-red shadow-[0_0_30px_rgba(229,9,20,0.6)]" />
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
          </div>
          {description ? <p className="mt-2 text-sm leading-6 text-white/55">{description}</p> : null}
        </div>

        <div className="flex items-center gap-2">
          {href ? (
            <Link
              href={href}
              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : null}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition md:h-11 md:w-11",
                canScrollLeft ? "hover:border-netflix-red/40 hover:bg-netflix-red/15" : "cursor-not-allowed opacity-40",
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white transition md:h-11 md:w-11",
                canScrollRight ? "hover:border-netflix-red/40 hover:bg-netflix-red/15" : "cursor-not-allowed opacity-40",
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg to-transparent md:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg to-transparent md:w-16" />

        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="scrollbar-hide overflow-x-auto pb-2 pt-1"
        >
          <div className="flex gap-4 pr-6">
            {items && renderItem
              ? items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: index * 0.03 }}
                    className="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px]"
                  >
                    {renderItem(item, index)}
                  </motion.div>
                ))
              : children}
          </div>
        </div>
      </div>
    </section>
  );
}
