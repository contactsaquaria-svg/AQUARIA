// GET  /api/orders  — Retrieve all customer orders — PROTECTED (contains PII)
// POST /api/orders  — Record a new storefront order (open — called by storefront)

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
      if (!requireAuth(req, res)) return;
      const siteData = await getSiteData();
      return res.status(200).json(siteData.orders || []);
    }

    if (req.method === 'POST') {
      const newOrder = req.body;
      if (!newOrder || typeof newOrder !== 'object') {
        return res.status(400).json({ error: 'Invalid order data.' });
      }

      const siteData = await getSiteData();
      if (!siteData.orders) siteData.orders = [];

      newOrder.createdAt = new Date().toISOString();
      newOrder.status = newOrder.status || 'Received';
      siteData.orders.unshift(newOrder);

      await saveSiteData(siteData);
      return res.status(201).json({ success: true, order: newOrder });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[/api/orders]', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
