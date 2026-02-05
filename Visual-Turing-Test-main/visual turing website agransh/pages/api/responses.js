import { createServerClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const supabase = createServerClient();
  if (!supabase) {
    // Fallback for local dev - read from responses.json
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'responses.json');
      if (!fs.existsSync(filePath)) {
        return res.status(200).json({});
      }
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const grouped = {};
      data.forEach((row) => {
        const radId = row.radiologistId;
        if (!grouped[radId]) grouped[radId] = [];
        grouped[radId].push(...(row.scanResponses || []));
      });
      return res.status(200).json(grouped);
    } catch (err) {
      return res.status(200).json({});
    }
  }

  try {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Group by radiologist_id - each row is one complete submission with responses array
    const grouped = {};
    (data || []).forEach((row) => {
      const radId = row.radiologist_id;
      // row.responses is the array of scan responses for this submission
      const scanResponses = Array.isArray(row.responses) ? row.responses : [];
      grouped[radId] = scanResponses.map((r, idx) => ({
        ...r,
        scanNumber: r.scanNumber || idx + 1,
        timestamp: r.timestamp || row.created_at,
      }));
    });

    return res.status(200).json(grouped);
  } catch (err) {
    console.error('Error fetching responses:', err);
    return res.status(500).json({ error: err.message });
  }
}
