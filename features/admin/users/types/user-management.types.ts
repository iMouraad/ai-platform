export interface Profile {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  role: 'student' | 'student_premium' | 'instructor' | 'admin';
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  premium_at?: string | null;
  username: string;
  document_number: string;
}
