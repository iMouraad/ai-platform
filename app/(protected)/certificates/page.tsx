"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Lock, Sparkles, ShieldCheck, Star } from "lucide-react";

export default function CertificatesPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full -z-10" />

      <div className="max-w-3xl w-full text-center space-y-12">
        {/* Animated Icon Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative inline-block"
        >
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_20px_50px_rgba(37,99,235,0.3)] border-4 border-white dark:border-zinc-950">
            <Award className="h-16 w-16 md:h-20 md:w-20 text-white" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center border-4 border-white dark:border-zinc-950 shadow-lg text-white"
          >
            <Star className="h-6 w-6 fill-white" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 text-blue-600 mb-4"
          >
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.5em]">CERTIFICACIONES OFICIALES</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black font-outfit text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none"
          >
            Tu Legado <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">En Construcción</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed"
          >
            Estamos forjando el sistema de validación de habilidades. Pronto podrás descargar tus certificados avalados por la plataforma.
          </motion.p>
        </div>

        {/* Status Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10"
        >
          {[
            { label: "VALIDACIÓN IA", status: "CONFIGURANDO" },
            { label: "FIRMA DIGITAL", status: "EN ESPERA" },
            { label: "RECONOCIMIENTO", status: "PRÓXIMAMENTE" }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 backdrop-blur-sm">
               <div className="flex flex-col items-center gap-2">
                 <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.label}</span>
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{item.status}</span>
                 </div>
               </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom Lock Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] pt-12"
        >
          <Lock className="h-3 w-3" /> Acceso Restringido • Mantenimiento de Sistema
        </motion.div>
      </div>
    </div>
  );
}
