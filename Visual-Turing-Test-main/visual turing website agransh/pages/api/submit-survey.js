import { createServerClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const supabase = createServerClient();
  if (!supabase) {
    // Supabase env vars missing - save to file and tell client so they know nothing went to DB
    try {
      const fs = require('fs');
      const path = require('path');
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const radiologistId = data.radiologistId || data.RadiologistId;
      const scanResponses = data.scanResponses || data.responses || [];
      const filePath = path.join(process.cwd(), 'responses.json');
      let responses = [];
      if (fs.existsSync(filePath)) {
        responses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
      responses.push({ radiologistId, scanResponses, totalCorrect: data.totalCorrect, totalScans: data.totalScans, finalSurvey: data.finalSurvey, knowledge: data.knowledge, date: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(responses, null, 2));
      return res.status(200).json({
        message: 'Response saved locally (no database)',
        savedTo: 'local',
        hint: 'Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local to save to Supabase.',
      });
    } catch (err) {
      return res.status(503).json({ error: 'Database not configured', savedTo: 'none' });
    }
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // Support both RadiologistId and radiologistId
    const radiologistId = data.radiologistId || data.RadiologistId;
    const scanResponses = data.scanResponses || data.responses || [];
    const totalCorrect = data.totalCorrect ?? null;
    const totalScans = data.totalScans ?? null;
    const finalSurvey = data.finalSurvey || data.FinalSurvey || null;
    const knowledge = data.knowledge || data.Knowledge || null;
    
    if (!radiologistId) {
      return res.status(400).json({ error: 'Missing radiologistId' });
    }

    // Insert into responses table (columns: radiologist_id, responses, total_correct, total_scans, final_survey, knowledge)
    const { error } = await supabase
      .from('responses')
      .insert({
        radiologist_id: radiologistId,
        responses: Array.isArray(scanResponses) ? scanResponses : [],
        total_correct: totalCorrect,
        total_scans: totalScans,
        final_survey: finalSurvey || null,
        knowledge: knowledge || null,
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Response saved successfully' });
  } catch (err) {
    console.error('Error saving response:', err);
    const detail = err.cause?.message || err.cause?.code || err.message;
    const hint = err.message === 'fetch failed'
      ? 'Check: (1) Supabase URL is https://xxx.supabase.co with no typo, (2) Service role key is correct and has no extra spaces, (3) Supabase project is not paused (Dashboard → Project Settings → General).'
      : '';
    return res.status(500).json({
      error: err.message,
      detail: detail !== err.message ? detail : undefined,
      hint: hint || undefined,
    });
  }
}
