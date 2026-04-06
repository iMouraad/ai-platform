"use client";

import { useState } from "react";
import { Category } from "@/features/directory/types/directory.types";
import { Modal } from "@/components/ui/modal";
import { EditCategoryForm } from "./edit-category-form";

export const AdminCategoryList = ({ initialCategories }: { initialCategories: Category[] }) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {initialCategories?.map((cat) => (
          <div 
            key={cat.id} 
            className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex flex-col justify-between hover:shadow-lg transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{cat.name}</h3>
                <span className={`h-2 w-2 rounded-full ${cat.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {cat.description || "Sin descripción."}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 font-mono">{cat.slug}</span>
              <button 
                onClick={() => setEditingCategory(cat)}
                className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </>
  );
};
