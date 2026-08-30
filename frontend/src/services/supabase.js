import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lsevpalyovjjgkjfmmfs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_0Q-PnE3dL2WC4QUG7iYYDg_3fmvQAE2';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
