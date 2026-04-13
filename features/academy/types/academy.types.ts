export type ActivityType = 'simulate_ai' | 'improve_prompt' | 'compare_responses' | 'build_prompt';
export type ActivityLevel = 'basic' | 'intermediate' | 'advanced';
export type ActivityStatus = 'draft' | 'published' | 'archived';

export interface Activity {
  id: string;
  title: string;
  description: string;
  video_url?: string;
  guide_content?: string;
  prompt_input: string;
  instruction: string;
  expected_output: string;
  level: ActivityLevel;
  type: ActivityType;
  status: ActivityStatus;
  order: number;
  created_at: string;
  created_by: string;
}

export interface UserActivityProgress {
  user_id: string;
  activity_id: string;
  user_response: string;
  completed_at: string;
  feedback_received?: string;
}

export interface AcademyLevel {
  id: string;
  name: string;
  description: string;
  level_type: ActivityLevel;
  activities: Activity[];
  total_activities: number;
  completed_activities: number;
  status?: 'locked' | 'available' | 'completed'; // Añadido para el Roadmap
}
