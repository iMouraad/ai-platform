export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  tool_count?: number;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  official_url: string;
  short_description: string;
  content?: string;
  features?: string[];
  suggested_prompts?: string[];
  category_id: string;
  logo_url?: string;
  video_url?: string;
  is_active: boolean;
  is_verified?: boolean;
  tags?: string[];
  popularity?: number;
  pricing?: string; // Ej: "Gratis", "Suscripción", "Freemium"
  pros?: string[]; // Fortalezas para comparar
  target_audience?: string; // A quién va dirigido
  created_at: string;
  category?: Category;
}
