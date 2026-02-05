import { createServerClient, getRadiologistLabel } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const supabase = createServerClient();
  if (!supabase) {
    // Fallback for local dev without database - use timestamp-based ID
    const fallbackId = `Local-${Date.now()}`;
    return res.status(200).json({ radiologistId: fallbackId, counter: 0 });
  }

  try {
    const { data, error } = await supabase.rpc('increment_radiologist_counter');
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    const counter = data;
    const radiologistId = getRadiologistLabel(counter);
    
    return res.status(200).json({ radiologistId, counter });
  } catch (err) {
    console.error('Error assigning radiologist:', err);
    return res.status(500).json({ error: err.message });
  }
}
