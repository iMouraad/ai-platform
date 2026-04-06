export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  official_url: string;
  short_description: string;
  category_id: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  category?: Category;
}
