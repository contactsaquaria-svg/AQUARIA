// GET  /api/data  — Public website content (orders excluded)
// POST /api/data  — Update website sections — PROTECTED

const supabase = require('./_supabase');
const { requireAuth } = require('./_auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function getSiteData() {
  const { data, error } = await supabase
    .from('site_data')
    .select('data')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data.data;
}

async function saveSiteData(newData) {
  const { error } = await supabase
    .from('site_data')
    .upsert({ id: 1, data: newData, updated_at: new Date().toISOString() });
  if (error) throw error;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const siteData = await getSiteData();
      // Exclude orders from public response — orders contain customer PII
      // eslint-disable-next-line no-unused-vars
      const { orders: _orders, ...publicData } = siteData;
      return res.status(200).json(publicData);
    }

    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const current = await getSiteData();
      const updated = { ...current, ...req.body };
      await saveSiteData(updated);
      return res.status(200).json({ success: true, message: 'Website content updated successfully!' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[/api/data]', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
