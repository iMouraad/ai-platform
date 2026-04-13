"use client";

import { useState } from "react";
import { Category } from "@/features/directory/types/directory.types";
import { Modal } from "@/components/ui/modal";
import { CreateCategoryForm } from "./create-category-form";
import { EditCategoryForm } from "./edit-category-form";
import { Plus, Table, Tag } from "lucide-react";

export const AdminCategoryList = ({ initialCategories }: { initialCategories: Category[] }) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header with Create Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-600/30"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialCategories?.map((category) => (
          <div 
            key={category.id} 
            className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl hover:border-blue-600/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-blue-600 border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                <Tag className="h-6 w-6" />
              </div>
              <button 
                onClick={() => setEditingCategory(category)}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 px-4 py-2 rounded-xl transition-all"
              >
                Editar
              </button>
            </div>
            
            <h3 className="text-xl font-black font-outfit text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter mb-2">{category.name}</h3>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${category.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              {category.is_active ? 'Estado: Activo' : 'Estado: Inactivo'}
            </p>
          </div>
        ))}
      </div>

      {/* MODAL PARA CREAR */}
      <Modal 
        isOpen={isAdding} 
        onClose={() => setIsAdding(false)} 
        title="Nueva Categoría"
      >
        <CreateCategoryForm onSuccess={() => setIsAdding(false)} />
      </Modal>

      {/* MODAL PARA EDITAR */}
      <Modal 
        isOpen={!!editingCategory} 
        onClose={() => setEditingCategory(null)} 
        title="Editar Categoría"
      >
        {editingCategory && (
          <EditCategoryForm 
            category={editingCategory} 
            onSuccess={() => setEditingCategory(null)} 
          />
        )}
      </Modal>
    </div>
  );
};
