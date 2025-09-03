const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase credentials are properly configured
if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-supabase-service-role-key')) {
  console.warn('⚠️  Supabase credentials not properly configured. Please update your .env file with valid Supabase URL and service role key.');
  console.warn('Current SUPABASE_URL:', supabaseUrl);
  console.warn('Current SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '***configured***' : 'not configured');
  // Export null to indicate Supabase is not available
  module.exports = null;
} else {
  const supabase = createClient(supabaseUrl, supabaseKey);
  module.exports = supabase;
}
