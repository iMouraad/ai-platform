"use client";

import { useState } from "react";
import { Tool, Category } from "@/features/directory/types/directory.types";
import { Modal } from "@/components/ui/modal";
import { EditToolForm } from "./edit-tool-form";

export const AdminToolTable = ({ 
  initialTools, 
  categories 
}: { 
  initialTools: Tool[]; 
  categories: Category[] 
}) => {
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Nombre</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Categoría</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Estado</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {initialTools?.map((tool) => (
              <tr key={tool.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">{tool.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-500">{tool.category?.name}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase ${tool.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {tool.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setEditingTool(tool)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={!!editingTool} 
        onClose={() => setEditingTool(null)} 
        title="Editar Herramienta IA"
      >
        {editingTool && (
          <EditToolForm 
            tool={editingTool} 
            categories={categories} 
            onSuccess={() => setEditingTool(null)} 
          />
        )}
      </Modal>
    </>
  );
};
