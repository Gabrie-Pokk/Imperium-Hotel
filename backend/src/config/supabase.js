const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

// Load .env explicitly from the backend root to avoid CWD issues
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  const hint = [
    `Missing Supabase environment variables: ${missing.join(', ')}.`,
    `Set these variables in your runtime environment:`,
    `SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co`,
    `SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`,
    `On Render: go to the Web Service -> Environment -> Add Variables`,
    `Do not use quotes or backticks; paste exact values.`
  ].join('\n');
  throw new Error(hint);
}

// Create Supabase client with service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

module.exports = supabase;
