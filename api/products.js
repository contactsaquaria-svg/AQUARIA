// GET  /api/products  — List all products (public)
// POST /api/products  — Add a new product — PROTECTED

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
      return res.status(200).json(siteData.products || []);
    }

    if (req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const newProduct = req.body;
      if (!newProduct || typeof newProduct !== 'object') {
        return res.status(400).json({ error: 'Invalid product data.' });
      }

      const siteData = await getSiteData();
      if (!siteData.products) siteData.products = [];

      if (!newProduct.id) {
        const prefix = newProduct.department === 'footwear' ? 'shoe' : 'bag';
        newProduct.id = `${prefix}-${Date.now().toString(36)}`;
      }

      siteData.products.unshift(newProduct);
      await saveSiteData(siteData);
      return res.status(201).json({ success: true, product: newProduct });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[/api/products]', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
