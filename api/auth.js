// POST /api/auth — Verify admin password, return Bearer token
const crypto = require('crypto');
const { getExpectedToken } = require('./_auth');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD env var is not configured on the server.' });
  }

  const { password } = req.body || {};
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password required.' });
  }

  // Timing-safe password comparison
  const inputHash   = crypto.createHash('sha256').update(password).digest();
  const correctHash = crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD).digest();

  if (!crypto.timingSafeEqual(inputHash, correctHash)) {
    // Uniform delay to slow brute force
    await new Promise(r => setTimeout(r, 500));
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  const token = getExpectedToken();
  return res.status(200).json({ token });
};
