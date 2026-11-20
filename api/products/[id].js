// PUT    /api/products/:id  — Update existing product — PROTECTED
// DELETE /api/products/:id  — Remove product — PROTECTED

const supabase = require('../_supabase');
const { requireAuth } = require('../_auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
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

  if (!requireAuth(req, res)) return;

  const productId = req.query.id;
  if (!productId) return res.status(400).json({ error: 'Product ID required.' });

  try {
    const siteData = await getSiteData();
    const products = siteData.products || [];

    if (req.method === 'PUT') {
      const updates = req.body;
      const idx = products.findIndex(p => p.id === productId);
      if (idx === -1) return res.status(404).json({ error: 'Product not found.' });

      products[idx] = { ...products[idx], ...updates };
      siteData.products = products;
      await saveSiteData(siteData);
      return res.status(200).json({ success: true, product: products[idx] });
    }

    if (req.method === 'DELETE') {
      const initialLength = products.length;
      siteData.products = products.filter(p => p.id !== productId);

      if (siteData.products.length === initialLength) {
        return res.status(404).json({ error: 'Product not found.' });
      }

      await saveSiteData(siteData);
      return res.status(200).json({ success: true, message: 'Product deleted.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(`[/api/products/${productId}]`, err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
