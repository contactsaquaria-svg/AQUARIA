// Auth middleware helper — used by all protected API routes
const crypto = require('crypto');

/**
 * Generates the expected Bearer token from ADMIN_PASSWORD.
 * Token = HMAC-SHA256(key=ADMIN_PASSWORD, data="aquaria-admin-v1")
 * Rotates automatically whenever ADMIN_PASSWORD env var changes.
 */
function getExpectedToken() {
  return crypto
    .createHmac('sha256', process.env.ADMIN_PASSWORD || '')
    .update('aquaria-admin-v1')
    .digest('hex');
}

/**
 * Call at the top of any protected handler.
 * Returns true if authorised, or sends 401 and returns false.
 */
function requireAuth(req, res) {
  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD env var is not set!');
    res.status(500).json({ error: 'Server auth not configured.' });
    return false;
  }

  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    res.status(401).json({ error: 'Authentication required.' });
    return false;
  }

  const expected = getExpectedToken();

  // Constant-time comparison to prevent timing attacks
  try {
    const a = Buffer.from(token.padEnd(expected.length));
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      res.status(401).json({ error: 'Invalid token.' });
      return false;
    }
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
    return false;
  }

  return true;
}

module.exports = { requireAuth, getExpectedToken };
