import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';

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
