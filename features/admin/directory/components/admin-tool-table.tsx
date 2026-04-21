"use client";

import { useState } from "react";
import { Tool, Category } from "@/features/directory/types/directory.types";
import { Modal } from "@/components/ui/modal";
import { EditToolForm } from "./edit-tool-form";
import { CreateToolForm } from "./create-tool-form";
import { Plus, Search, Filter } from "lucide-react";

export const AdminToolTable = ({ 
  initialTools, 
  categories 
}: { 
  initialTools: Tool[]; 
  categories: Category[] 
}) => {
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isAddingTool, setIsAddingTool] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTools = initialTools?.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o categoría..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:border-blue-600 transition-all shadow-sm"
          />
        </div>

        <button 
          onClick={() => setIsAddingTool(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/30"
        >
          <Plus className="h-4 w-4" />
          Añadir Herramienta
        </button>
      </div>

      {/* Table Unit */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Nombre de la Herramienta</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Categoría</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {filteredTools?.length > 0 ? (
                filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-800">
                          {tool.image_url ? (
                            <img src={tool.image_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
                          )}
                        </div>
                        <span className="font-black text-zinc-900 dark:text-zinc-50 tracking-tight">{tool.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-bold text-zinc-500 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        {tool.category?.name || "Sin Categoría"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${tool.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {tool.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => setEditingTool(tool)}
                        className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-white hover:bg-blue-600 px-5 py-2.5 rounded-xl border border-blue-600/20 transition-all opacity-0 group-hover:opacity-100"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                        <Search className="h-6 w-6 text-zinc-300" />
                      </div>
                      <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">No se encontraron herramientas</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA CREAR */}
      <Modal 
        isOpen={isAddingTool} 
        onClose={() => setIsAddingTool(false)} 
        title="Crear Nueva Herramienta"
        maxWidth="max-w-4xl"
      >
        <CreateToolForm 
          categories={categories} 
          onSuccess={() => setIsAddingTool(false)} 
        />
      </Modal>

      {/* MODAL PARA EDITAR */}
      <Modal 
        isOpen={!!editingTool} 
        onClose={() => setEditingTool(null)} 
        title="Editar Herramienta IA"
        maxWidth="max-w-4xl"
      >
        {editingTool && (
          <EditToolForm 
            tool={editingTool} 
            categories={categories} 
            onSuccess={() => setEditingTool(null)} 
          />
        )}
      </Modal>
    </div>
  );
};
