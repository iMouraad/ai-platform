"use client";

import React, { useCallback, useEffect, useState, useMemo, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Tool } from "../types/directory.types";
import { ToolCard } from "./tool-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ToolCarouselProps {
  tools: Tool[];
  categoryName: string;
  onOpenDetail?: (tool: Tool) => void;
  onToggleCompare?: (tool: Tool) => void;
  compareTools?: Tool[];
  onViewAll?: () => void;
}

export const ToolCarousel = ({ 
  tools, 
  categoryName, 
  onOpenDetail, 
  onToggleCompare,
  compareTools = [],
  onViewAll
}: ToolCarouselProps) => {
  
  // 1. Triple buffer - Standard for silent infinite carousels
  const slides = useMemo(() => {
    if (tools.length === 0) return [];
    return [...tools, ...tools, ...tools];
  }, [tools]);

  // 2. Disable Embla's internal loop to handle it ourselves silently
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: "center",
    dragFree: false,
    skipSnaps: false,
    containScroll: false,
    duration: 35,
    startIndex: tools.length // Start at the central set
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tweenValues, setTweenValues] = useState<number[]>([]);
  const isJumping = useRef(false);

  const updateTweens = useCallback(() => {
    if (!emblaApi) return;

    const selected = emblaApi.selectedScrollSnap();
    const totalSlides = slides.length;

    const values = slides.map((_, index) => {
      let diff = Math.abs(index - selected);
      // No circular logic needed here because we handle the jump manually
      return Math.max(0, 1 - diff * 0.6);
    });

    setTweenValues(values);
  }, [emblaApi, slides.length]);

  const handleLoop = useCallback(() => {
    if (!emblaApi || isJumping.current) return;

    const index = emblaApi.selectedScrollSnap();
    const total = tools.length;

    // 🔥 SILENT TELEPORT LOGIC
    // If we reach the last set, jump to the middle set silently
    if (index >= total * 2) {
      isJumping.current = true;
      emblaApi.scrollTo(index - total, true);
      setTimeout(() => { isJumping.current = false; }, 50);
    }
    // If we reach the first set, jump to the middle set silently
    if (index < total) {
      isJumping.current = true;
      emblaApi.scrollTo(index + total, true);
      setTimeout(() => { isJumping.current = false; }, 50);
    }
  }, [emblaApi, tools.length]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selected = emblaApi.selectedScrollSnap();
    // Real index for the progress bar
    setSelectedIndex(selected % tools.length);
    updateTweens();
    handleLoop(); // Check for silent jump
  }, [emblaApi, tools.length, updateTweens, handleLoop]);

  useEffect(() => {
    if (!emblaApi) return;
    
    updateTweens();
    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("scroll", updateTweens);

    return () => {
      if (emblaApi) {
        emblaApi.off("select", onSelect);
        emblaApi.off("reInit", onSelect);
        emblaApi.off("scroll", updateTweens);
      }
    };
  }, [emblaApi, updateTweens, onSelect]);

  if (tools.length === 0) return null;

  return (
    <div className="w-full space-y-12 mb-32 relative group/carousel">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-2 w-10 bg-blue-600 rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">HUB PDIA</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-none">
            {categoryName}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onViewAll}
            className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-colors py-4 px-10 rounded-2xl border border-zinc-100 dark:border-zinc-800"
          >
            Ver Todo
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="h-16 w-16 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-600/30 transition-all active:scale-90"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="h-16 w-16 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-600/30 transition-all active:scale-90"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex cursor-grab active:cursor-grabbing" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
            {slides.map((tool, index) => {
              const tweenValue = tweenValues[index] ?? 0;
              
              const scale = 0.92 + (tweenValue * 0.08);
              const opacity = 0.7 + (tweenValue * 0.3);
              const blur = (1 - tweenValue) * 2;
              const zIndex = tweenValue > 0.8 ? 20 : 10;

              return (
                <div 
                  key={`${tool.id}-${index}`} 
                  className="flex-[0_0_85%] sm:flex-[0_0_75%] md:flex-[0_0_60%] lg:flex-[0_0_45%] xl:flex-[0_0_40%] min-w-0 px-4"
                  style={{ 
                    opacity,
                    transform: `scale(${scale})`,
                    filter: `blur(${blur}px)`,
                    zIndex,
                    transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, filter 0.4s ease'
                  }}
                >
                  <div className="pb-16 pt-8">
                    <ToolCard 
                      tool={tool} 
                      onOpenDetail={onOpenDetail}
                      onToggleCompare={onToggleCompare}
                      isCompareSelected={compareTools.some(t => t.id === tool.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Bar (Mapped back to real tools count) */}
      <div className="px-10 flex items-center gap-12">
        <div className="flex-1 h-[2px] bg-zinc-200 dark:bg-zinc-800 rounded-full relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: `${((selectedIndex + 1) / tools.length) * 100}%` }}
          />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
           {String(selectedIndex + 1).padStart(2, '0')} <span className="mx-2 text-zinc-200 dark:text-zinc-800">/</span> {String(tools.length).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};
