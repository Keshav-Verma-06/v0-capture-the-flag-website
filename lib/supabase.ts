import { createClient } from '@supabase/supabase-js';

// Prefer environment variables if set, otherwise fall back to the provided credentials
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://soptjnzslwwgnlampzmv.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcHRqbnpzbHd3Z25sYW1wem12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjM4OTQsImV4cCI6MjA4NTU5OTg5NH0.bJMb3vh-GYZ-tlaAMXCQuBLYoI9DL3vS7OBd3MpN0s0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  username: string;
  team_name?: string;
  year: string;
  total_score: number;
  created_at: string;
};

export type Challenge = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  target_year: string;
  description: string;
  full_description?: string;
  flag_hash: string;
  points: number;
  resources?: Record<string, any>;
  created_at: string;
};

export type Lab = {
  id: string;
  challenge_id: string;
  slug: string;
  lab_type: string;
  is_active: boolean;
  created_at: string;
};

export type LabSession = {
  id: string;
  user_id: string;
  lab_id: string;
  started_at: string;
  completed_at: string | null;
  success: boolean;
};

export type Submission = {
  id: string;
  user_id: string;
  challenge_id: string;
  flag_submitted: string;
  is_correct: boolean;
  submitted_at: string;
};

export type Solve = {
  id: string;
  user_id: string;
  challenge_id: string;
  solve_order?: number;
  solve_time: string;
};
