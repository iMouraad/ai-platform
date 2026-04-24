
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkUserProgress() {
  const { data: { user } } = await supabase.auth.getUser(); // This won't work in a script without login
  // I'll just check all progress entries
  const { data: progress, error } = await supabase
    .from('user_academy_progress')
    .select('*');

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Total progress entries:", progress.length);
    const uniqueActivities = new Set(progress.map(p => p.activity_id));
    console.log("Unique activities completed:", uniqueActivities.size);
    
    // Check activities
    const { data: activities } = await supabase.from('academy_activities').select('id, level, status');
    console.log("Total activities in DB:", activities?.length);
    console.log("Published activities:", activities?.filter(a => a.status === 'published').length);
    
    const levels = ['basic', 'intermediate', 'advanced', 'expert', 'master'];
    levels.forEach(level => {
      const count = activities?.filter(a => a.level === level).length;
      console.log(`Level ${level}: ${count} activities`);
    });
  }
}

checkUserProgress();
