import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CommunityPost {
  id: string;
  created_at: string;
  nickname: string;
  category: string;
  title: string;
  content: string;
  likes: number;
}
