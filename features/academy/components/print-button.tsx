
"use client";

import { Download } from "lucide-react";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-blue-600/20 no-print"
    >
      <Download className="h-4 w-4" /> Descargar PDF
    </button>
  );
}
