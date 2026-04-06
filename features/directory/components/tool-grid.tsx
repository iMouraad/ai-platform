import React from "react";
import { ToolCard } from "./tool-card";
import { Tool } from "../types/directory.types";

interface ToolGridProps {
  tools: Tool[];
}

export const ToolGrid = ({ tools }: ToolGridProps) => {
  if (!tools || tools.length === 0) {
    return (
      <div className="py-24 text-center bg-zinc-50/50 dark:bg-zinc-900/50 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 border-dashed">
        <h3 className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter">No hay herramientas</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Vuelve más tarde para descubrir nuevas IAs.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-12">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};
