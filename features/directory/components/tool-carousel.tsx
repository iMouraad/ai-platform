"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Tool } from "../types/directory.types";
import { ToolCard } from "./tool-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ToolCarouselProps {
  tools: Tool[];
  categoryName: string;
}

export const ToolCarousel = ({ tools, categoryName }: ToolCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: "start",
    slidesToScroll: 1,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, setScrollSnaps, onSelect]);

  return (
    <div className="w-full space-y-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col gap-3">
          <div className="h-1 w-16 bg-blue-600 rounded-full" />
          <h2 className="text-4xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase">
            {categoryName}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={scrollPrev}
            className="h-14 w-14 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-600/50 transition-all active:scale-95 shadow-xl shadow-black/5 dark:shadow-none"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={scrollNext}
            className="h-14 w-14 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-600/50 transition-all active:scale-95 shadow-xl shadow-black/5 dark:shadow-none"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-8 lg:-ml-12">
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-8 lg:pl-12"
              >
                <div className="pb-10 pt-2">
                  <ToolCard tool={tool} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 transition-all duration-500 rounded-full ${
              index === selectedIndex 
                ? "w-8 bg-blue-600" 
                : "w-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
