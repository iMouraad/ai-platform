"use client";

import React, { useState } from "react";
import { Profile } from "../types/user-management.types";
import { updateUserRole, toggleUserStatus } from "../actions/user-actions";
import {
  User,
  ShieldCheck,
  Loader2,
  Search,
  UserCheck,
  UserX,
  Mail,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { clsx } from "clsx";
import { toast } from "sonner";

interface AdminUserTableProps {
  initialUsers: Profile[];
}

export const AdminUserTable = ({ initialUsers }: AdminUserTableProps) => {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.document_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (profileId: string, newRole: string) => {
    const role = newRole as Profile['role'];
    setUsers(prev => prev.map(u => u.id === profileId ? { ...u, role } : u));
    setIsLoading(profileId);
    try {
      const result = await updateUserRole(profileId, role);
      if (result.success) {
        toast.success(`Rol actualizado a ${role}`);
      } else {
        toast.error(`Error: ${result.error}`);
        setUsers(users); // Revert to current state (before optimistic update)
        // Actually, initialUsers is better if we have it, but setUsers(initialUsers) is what was there.
        // But users state was updated optimistically.
        setUsers(prev => prev.map(u => u.id === profileId ? initialUsers.find(iu => iu.id === profileId) || u : u));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al actualizar el rol");
      setUsers(initialUsers);
    } finally {
      setIsLoading(null);
    }
  };

  const handleToggleStatus = async (profileId: string, currentStatus: boolean) => {
    setUsers(prev => prev.map(u => u.id === profileId ? { ...u, is_active: !currentStatus } : u));
    setIsLoading(profileId);
    try {
      const result = await toggleUserStatus(profileId, currentStatus);
      if (result.success) {
        toast.success(currentStatus ? "Usuario desactivado" : "Usuario activado");
      } else {
        toast.error(`Error: ${result.error}`);
        setUsers(prev => prev.map(u => u.id === profileId ? initialUsers.find(iu => iu.id === profileId) || u : u));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al cambiar el estado");
      setUsers(initialUsers);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input 
          type="text" 
          placeholder="Buscar por nombre, email o cédula..." 
          className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-500/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-50 dark:border-zinc-900/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Usuario</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Identificación</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Estado / Rol</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Registrado</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 font-black text-xs uppercase border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
                           {user.full_name?.charAt(0) || user.email.charAt(0)}
                        </div>
                        {user.is_active && (
                           <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">{user.full_name}</span>
                        <div className="flex items-center gap-2 opacity-60">
                          <Mail className="h-3 w-3" />
                          <span className="text-[10px] font-bold lowercase tracking-tight">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">{user.document_number || "No registrada"}</span>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Documento ID</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                       <span className={clsx(
                         "inline-flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                         user.role === 'admin' && "bg-blue-600/10 text-blue-600",
                         user.role === 'student_premium' && "bg-amber-500/10 text-amber-500",
                         user.role === 'instructor' && "bg-purple-600/10 text-purple-600",
                         user.role === 'student' && "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
                       )}>
                         {user.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
                         {user.role}
                       </span>
                       <span className={clsx(
                         "text-[8px] font-black uppercase tracking-[0.2em]",
                         user.is_active ? "text-emerald-500" : "text-red-500"
                       )}>
                         {user.is_active ? "Cuenta Activa" : "Cuenta Inactiva"}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {format(new Date(user.created_at), "dd MMM yyyy", { locale: es })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="relative">
                        {isLoading === user.id ? (
                          <div className="h-9 w-36 flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                          </div>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="h-9 pl-3 pr-8 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                          >
                            <option value="student">Student</option>
                            <option value="student_premium">Student Premium</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </div>
                       <button 
                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                        disabled={isLoading === user.id}
                        title={user.is_active ? "Desactivar Humano" : "Activar Humano"}
                        className={clsx(
                          "p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-all outline-none disabled:opacity-50",
                          user.is_active ? "text-zinc-400 hover:text-red-500 hover:bg-red-500/5" : "text-emerald-500 hover:bg-emerald-500/5"
                        )}
                       >
                         {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
