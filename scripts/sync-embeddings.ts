import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Necesitamos el Service Role para actualizar

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncEmbeddings() {
    console.log('--- Iniciando Sincronización de Embeddings (Gratis) ---');
    
    // 1. Cargar el modelo
    console.log('Cargando modelo de IA...');
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

    // 2. Obtener herramientas sin embedding o todas
    console.log('Obteniendo herramientas de la base de datos...');
    const { data: tools, error } = await supabase
        .schema('directory')
        .from('tools')
        .select('id, name, short_description');

    if (error) {
        console.error('Error obteniendo herramientas:', error);
        return;
    }

    console.log(`Procesando ${tools.length} herramientas...`);

    for (const tool of tools) {
        const textToEmbed = `${tool.name} ${tool.short_description}`;
        console.log(`Generando embedding para: ${tool.name}`);

        try {
            const output = await extractor(textToEmbed, {
                pooling: 'mean',
                normalize: true,
            });

            const embedding = Array.from(output.data);

            const { error: updateError } = await supabase
                .schema('directory')
                .from('tools')
                .update({ embedding })
                .eq('id', tool.id);

            if (updateError) {
                console.error(`Error actualizando ${tool.name}:`, updateError);
            } else {
                console.log(`✅ ${tool.name} actualizado.`);
            }
        } catch (e) {
            console.error(`Error procesando ${tool.name}:`, e);
        }
    }

    console.log('--- Sincronización Finalizada ---');
}

syncEmbeddings();
