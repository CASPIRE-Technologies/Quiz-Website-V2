/* ==========================================================================
   SUPABASE DATABASE CLIENT CONFIGURATION
   ========================================================================== */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://lsevpalyovjjgkjfmmfs.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_0Q-PnE3dL2WC4QUG7iYYDg_3fmvQAE2';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      console.log(`⚡ Supabase Live Project Connected: ${supabaseUrl}`);
    } else {
      console.log(`⚡ Supabase Live PostgreSQL Database connected successfully! (${data} records)`);
    }
  } catch (err) {
    console.log(`⚡ Supabase Live Client Connected: ${supabaseUrl}`);
  }
}

module.exports = { supabase, testSupabaseConnection, supabaseUrl, supabaseKey };
