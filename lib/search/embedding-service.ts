"use client";

/**
 * PARCHE DE EMERGENCIA PARA NEXT.JS 16 + TRANSFORMERS.JS
 * Este bloque debe ejecutarse antes de cualquier importación de la librería.
 */
if (typeof window !== 'undefined') {
    const win = window as any;
    win.process = win.process || { env: {} };
    win.process.env = win.process.env || {};
    // Polyfill para evitar errores de detección de entorno en Transformers.js
    if (!win.process.cwd) win.process.cwd = () => '/';
}

// Usaremos importación dinámica para evitar errores de SSR en Next.js
class EmbeddingService {
    private static instance: EmbeddingService;
    private extractor: any = null;
    private modelName = 'Xenova/all-MiniLM-L6-v2';

    private constructor() {}

    public static getInstance(): EmbeddingService {
        if (!EmbeddingService.instance) {
            EmbeddingService.instance = new EmbeddingService();
        }
        return EmbeddingService.instance;
    }

    /**
     * Carga el modelo si no está cargado ya.
     */
    public async init() {
        if (this.extractor) return;

        try {
            console.log(`[EmbeddingService] Aplicando pollyfills y cargando motor de IA...`);
            
            // 1. Importación dinámica robusta para Turbopack/Next.js 16
            const TransformersApi = await import('@xenova/transformers').catch(err => {
                console.error("[EmbeddingService] Error crítico al importar @xenova/transformers:", err);
                throw err;
            });
            
            // Extraemos pipeline y env de manera segura (manejo de ESM/CJS)
            const pipeline = TransformersApi.pipeline || (TransformersApi as any).default?.pipeline;
            const env = TransformersApi.env || (TransformersApi as any).default?.env;

            if (!pipeline || !env) {
                throw new Error("La librería de IA se cargó pero no devolvió las funciones necesarias (pipeline/env).");
            }

            // 2. Configuración obligatoria para el navegador
            env.allowLocalModels = false;
            env.useBrowserCache = true;
            (env as any).allowRemoteModels = true;

            console.log(`[EmbeddingService] Descargando pesos del modelo (${this.modelName})...`);
            this.extractor = await pipeline('feature-extraction', this.modelName);
            console.log('[EmbeddingService] ¡IA cargada con éxito! La búsqueda ahora es semántica.');
        } catch (error) {
            console.error('[EmbeddingService] Fallo al inicializar el motor de búsqueda:', error);
            throw error;
        }
    }

    /**
     * Convierte un texto en un vector numérico (Embedding).
     */
    public async generate(text: string): Promise<number[]> {
        await this.init();

        try {
            const output = await this.extractor(text, {
                pooling: 'mean',
                normalize: true,
            });

            return Array.from(output.data);
        } catch (error) {
            console.error('[EmbeddingService] Error generando vector de búsqueda:', error);
            throw error;
        }
    }
}

export const embeddingService = EmbeddingService.getInstance();
