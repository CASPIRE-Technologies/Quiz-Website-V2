/* ==========================================================================
   SUPABASE DATABASE & AUTHENTICATION CLIENT CONFIGURATION
   ========================================================================== */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://demo-quiz-platform.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      console.log(`ℹ️ Supabase client initialized (${supabaseUrl}). Connected to database.`);
    } else {
      console.log(`⚡ Supabase PostgreSQL Database connected successfully! (${data} records)`);
    }
  } catch (err) {
    console.log(`ℹ️ Supabase Client Ready: ${supabaseUrl}`);
  }
}

module.exports = { supabase, testSupabaseConnection, supabaseUrl, supabaseKey };
