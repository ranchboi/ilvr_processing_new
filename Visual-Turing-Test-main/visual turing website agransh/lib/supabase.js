import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (uses service role for full access)
// For API routes only - never expose to client
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Convert counter number to radiologist label: 1->A, 2->B, ..., 26->Z, 27->Radiologist 27, etc.
export function getRadiologistLabel(counter) {
  if (counter <= 26) {
    return String.fromCharCode(64 + counter);
  }
  return `Radiologist ${counter}`;
}
