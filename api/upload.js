// POST /api/upload — Upload a base64 image to Supabase Storage — PROTECTED
//                    Returns the public CDN URL

const path = require('path');
const supabase = require('./_supabase');
const { requireAuth } = require('./_auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const MIME_MAP = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
};

// Increase Vercel body limit to handle image uploads up to 10 MB
async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAuth(req, res)) return;

  const { data: imgData, filename } = req.body || {};

  if (!imgData || !filename) {
    return res.status(400).json({ error: 'Base64 image data and filename are required.' });
  }

  try {
    const base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const ext = path.extname(filename).toLowerCase() || '.jpg';
    const contentType = MIME_MAP[ext] || 'image/jpeg';
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('uploads')
      .upload(cleanName, buffer, { contentType, upsert: false });

    if (uploadErr) {
      console.error('[/api/upload] Storage error:', uploadErr);
      return res.status(500).json({ error: 'Could not upload file: ' + uploadErr.message });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(cleanName);

    return res.status(201).json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('[/api/upload]', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

handler.config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

module.exports = handler;
