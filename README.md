# 🚀 PDIA - AI Platform (Ecuador Edition)

¡Bienvenido a PDIA, la plataforma definitiva para explorar y gestionar herramientas de Inteligencia Artificial! 🚀

Esta es la base técnica de alto rendimiento diseñada para escalar, construida con los estándares más exigentes del desarrollo moderno. ✨

---

## ⚡ El Stack de Poder (PDIA)

### 1. 🏗️ Núcleo (Framework)
- **Next.js 16 (App Router):** La versión más fresca y potente de Next.js, aprovechando los Server Components para un rendimiento brutal.
- **React 19:** La librería de UI más moderna con las últimas optimizaciones.
- **TypeScript:** Código tipado y seguro para evitar errores tontos y programar como un ninja.

### 2. 🛡️ Backend y Seguridad
- **Supabase:** Nuestra "navaja suiza" que nos da base de datos (PostgreSQL), autenticación y almacenamiento de archivos.
- **RLS (Row Level Security):** Seguridad de nivel atómico en la base de datos para que cada humano solo acceda a lo que le toca.
- **Supabase Admin SDK:** El "Anillo Único" de poder que usamos en el servidor para crear y gestionar humanos con privilegios elevados.

### 3. 🎨 Diseño Estético y UI (Aesthetics)
- **Tailwind CSS 4:** Lo más rápido para hacer interfaces que se vean premium.
- **Framer Motion:** Animaciones suaves y fluidas que le dan esa sensación de "app de alto nivel".
- **Lucide React:** Iconos minimalistas y consistentes en toda la plataforma.

### 4. 📝 Gestión de Datos y Formularios
- **React Hook Form:** Para manejar formularios sin que la página se sienta pesada.
- **Zod:** El guardián de tus datos; nada entra si no cumple el esquema que definimos.
- **Date-fns:** Para manejar fechas como un profesional (ej. "registrado hace 2 días").

### 5. 🔍 Experiencia de Usuario (Explora)
- **Embla Carousel:** Lo que usamos para esos sliders Pro que tienes en el dashboard.
- **Lucide Icons:** Iconografía moderna que hace que todo se vea minimalista.

---

## 🛠️ Configuración de Desarrollo

### 1. Instalación de Dependencias
Asegúrate de estar en el directorio raíz del proyecto y ejecuta:
```bash
npm install
```

### 2. Variables de Entorno
Crea un archivo `.env.local` con las siguientes llaves de Supabase (puedes basarte en `.env.local.example` si existe):
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
```

### 3. Ejecución
Inicia el servidor de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en [http://localhost:3000](http://localhost:3000). ✨

---
*Hecho con ❤️ para la comunidad de IA.*
---
