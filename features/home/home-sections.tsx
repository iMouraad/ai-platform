"use client";

import React from "react";
import { 
  Users, 
  Sparkles, 
  Cpu, 
  BarChart3, 
  Layers, 
  MessageSquare, 
  CheckCircle2, 
  Phone
} from "lucide-react";
import { motion } from "framer-motion";

// --- Components ---

const SectionTitle = ({ subtitle, title, description, center = false }: { subtitle: string, title: string, description?: string, center?: boolean }) => (
  <div className={`mb-16 ${center ? 'text-center' : ''}`}>
    <span className="inline-block px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest border border-blue-600/20 mb-4">
      {subtitle}
    </span>
    <h2 className="text-4xl md:text-5xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6">
      {title}
    </h2>
    {description && (
      <p className="max-w-2xl text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mx-auto">
        {description}
      </p>
    )}
  </div>
);

// --- About Us Section ---
export const AboutUs = () => {
  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="relative rounded-3xl overflow-hidden aspect-square border border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000" 
                alt="AI Platform" 
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-8 -right-8 p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-black font-outfit text-zinc-900 dark:text-zinc-50">+500</p>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Usuarios Activos</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionTitle 
              subtitle="Nuestra Misión"
              title="Transformamos el acceso a la Inteligencia Artificial"
            />
            <div className="space-y-8">
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                En AI Platform, creemos que la inteligencia artificial no debería ser un privilegio de pocos, sino una herramienta de empoderamiento para todos. Nuestra plataforma nace en Ecuador con la visión de cerrar la brecha tecnológica.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Sparkles, text: "Innovación Constante" },
                  { icon: Cpu, text: "Tecnología de Punta" },
                  { icon: Layers, text: "Recursos Curados" },
                  { icon: CheckCircle2, text: "Calidad Garantizada" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-blue-600">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8">
                <button className="px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-black font-outfit uppercase tracking-wider rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-zinc-50 transition-all shadow-xl active:scale-95">
                  Conoce nuestra historia
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Our Services Section ---
export const OurServices = () => {
  const services = [
    {
      title: "Directorio de Herramientas",
      description: "Acceso ilimitado a las mejores herramientas de IA categorizadas para facilitar tu búsqueda y elección.",
      icon: BarChart3,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      title: "Formación Especializada",
      description: "Cursos diseñados por expertos para que aprendas a usar la IA en flujos de trabajo reales.",
      icon: Sparkles,
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      title: "Asesoría Estratégica",
      description: "Te ayudamos a implementar IA en tu negocio o carrera para maximizar tu productividad diaria.",
      icon: MessageSquare,
      color: "bg-indigo-500/10 text-indigo-500"
    }
  ];

  return (
    <section id="services" className="py-24 lg:py-32 bg-zinc-100/50 dark:bg-zinc-900/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionTitle 
            subtitle="Servicios"
            title="Potenciamos tu talento con IA"
            description="Ofrecemos soluciones integrales para que la inteligencia artificial trabaje para ti, no al revés."
            center
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all group hover:shadow-2xl hover:-translate-y-2"
            >
              <div className={`h-14 w-14 rounded-2xl ${service.color} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black font-outfit mb-4 text-zinc-900 dark:text-zinc-50">{service.title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed mb-8">
                {service.description}
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs">
                Saber más <Sparkles className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Testimonials Section ---
export const Testimonials = () => {
  const reviews = [
    {
      name: "Andrés Cevallos",
      role: "Desarrollador Fullstack",
      text: "La plataforma me ayudó a encontrar herramientas que redujeron mi tiempo de codificación a la mitad. ¡Es increíble!",
      image: "https://i.pravatar.cc/150?u=andres"
    },
    {
      name: "María José Luna",
      role: "Diseñadora UX/UI",
      text: "Nunca pensé que la IA fuera tan accesible. Los tutoriales son claros y el directorio es el mejor que he visto.",
      image: "https://i.pravatar.cc/150?u=maria"
    },
    {
      name: "Carlos Proaño",
      role: "Emprendedor Digital",
      text: "Implementar IA en mi agencia fue fácil gracias a la asesoría de AI Platform. 100% recomendados.",
      image: "https://i.pravatar.cc/150?u=carlos"
    }
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionTitle 
            subtitle="Comunidad"
            title="Lo que dicen nuestros usuarios"
            center
          />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col gap-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 text-zinc-100 dark:text-zinc-900/50 -z-10 group-hover:text-blue-500/10 transition-colors">
                <MessageSquare className="h-24 w-24 rotate-12" />
              </div>
              <div className="flex items-center gap-4">
                <img src={review.image} alt={review.name} className="h-14 w-14 rounded-full border-2 border-blue-600/20" />
                <div>
                  <h4 className="font-black font-outfit text-zinc-900 dark:text-zinc-50">{review.name}</h4>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium italic">
                "{review.text}"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Contact Section ---
export const ContactUs = () => {
  return (
    <section id="contact" className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden bg-zinc-900 dark:bg-blue-600 p-8 md:p-16 lg:p-24 shadow-2xl"
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/20 blur-3xl rounded-full translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-indigo-600/20 blur-3xl rounded-full -translate-x-1/2" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-[10px] font-bold uppercase tracking-widest border border-blue-500/30 mb-6"
              >
                Hablemos Hoy
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-6xl font-black font-outfit tracking-tighter text-white mb-8"
              >
                ¿Tienes preguntas? <br /> Estamos para ayudarte.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-xl text-blue-100/80 font-medium leading-relaxed mb-12 max-w-lg"
              >
                Nuestros expertos en IA están listos para asesorarte de forma personalizada y directa vía WhatsApp.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a 
                  href="https://wa.me/593995220227" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-blue-600 font-black font-outfit uppercase tracking-widest text-[12px] rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 group"
                >
                  <Phone className="h-5 w-5 fill-blue-600 group-hover:rotate-12 transition-transform" />
                  WhatsApp Ecuador
                </a>
                <div className="flex items-center gap-4 px-8 py-5 border border-white/20 rounded-2xl text-white">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">En línea ahora</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
              <div className="relative p-12 border border-white/10 bg-white/5 backdrop-blur-xl rounded-[3rem] shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Respuesta rápida</p>
                      <p className="text-xs text-blue-200 font-medium">Menos de 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Asesoría Humana</p>
                      <p className="text-xs text-blue-200 font-medium">Sin bots, trato real</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
