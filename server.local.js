const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'site-data.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Read Site Data Helper
function getSiteData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  return {};
}

// Save Site Data Helper
function saveSiteData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving data file:', err);
    return false;
  }
}

// Read JSON Body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve(body);
      }
    });
    req.on('error', err => reject(err));
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(parsedUrl.pathname);

  // ==========================================
  // API ROUTING
  // ==========================================

  // 1. GET /api/data — Full website content
  if (req.method === 'GET' && pathname === '/api/data') {
    const data = getSiteData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }

  // 2. POST /api/data — Update website sections
  if (req.method === 'POST' && pathname === '/api/data') {
    const body = await parseRequestBody(req);
    const currentData = getSiteData();
    const updated = { ...currentData, ...body };
    if (saveSiteData(updated)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Website content updated successfully!' }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to write site data.' }));
    }
    return;
  }

  // 3. GET /api/products
  if (req.method === 'GET' && pathname === '/api/products') {
    const data = getSiteData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.products || []));
    return;
  }

  // 4. POST /api/products — Add new product
  if (req.method === 'POST' && pathname === '/api/products') {
    const newProduct = await parseRequestBody(req);
    const data = getSiteData();
    if (!data.products) data.products = [];

    if (!newProduct.id) {
      const prefix = newProduct.department === 'footwear' ? 'shoe' : 'bag';
      newProduct.id = `${prefix}-${Date.now().toString(36)}`;
    }

    data.products.unshift(newProduct);
    if (saveSiteData(data)) {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, product: newProduct }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to add product.' }));
    }
    return;
  }

  // 5. PUT /api/products/:id — Update existing product
  if (req.method === 'PUT' && pathname.startsWith('/api/products/')) {
    const productId = pathname.replace('/api/products/', '');
    const updates = await parseRequestBody(req);
    const data = getSiteData();

    const idx = (data.products || []).findIndex(p => p.id === productId);
    if (idx === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found.' }));
      return;
    }

    data.products[idx] = { ...data.products[idx], ...updates };
    if (saveSiteData(data)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, product: data.products[idx] }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to update product.' }));
    }
    return;
  }

  // 6. DELETE /api/products/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/products/')) {
    const productId = pathname.replace('/api/products/', '');
    const data = getSiteData();

    const initialLength = (data.products || []).length;
    data.products = (data.products || []).filter(p => p.id !== productId);

    if (data.products.length === initialLength) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found.' }));
      return;
    }

    if (saveSiteData(data)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Product deleted.' }));
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to delete product.' }));
    }
    return;
  }

  // 7. GET /api/orders
  if (req.method === 'GET' && pathname === '/api/orders') {
    const data = getSiteData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data.orders || []));
    return;
  }

  // 8. POST /api/orders — Record customer order
  if (req.method === 'POST' && pathname === '/api/orders') {
    const newOrder = await parseRequestBody(req);
    const data = getSiteData();
    if (!data.orders) data.orders = [];

    newOrder.createdAt = new Date().toISOString();
    newOrder.status = newOrder.status || 'Received';
    data.orders.unshift(newOrder);

    saveSiteData(data);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, order: newOrder }));
    return;
  }

  // 9. POST /api/upload — Save base64 image to /uploads/
  if (req.method === 'POST' && pathname === '/api/upload') {
    const payload = await parseRequestBody(req);
    if (!payload.data || !payload.filename) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Base64 image data and filename required.' }));
      return;
    }

    // Strip base64 data header if present
    const base64Data = payload.data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const safeExt = path.extname(payload.filename) || '.jpg';
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${safeExt}`;
    const targetFile = path.join(UPLOADS_DIR, cleanName);

    try {
      fs.writeFileSync(targetFile, buffer);
      const publicUrl = `/uploads/${cleanName}`;
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, url: publicUrl }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Could not write file.' }));
    }
    return;
  }

  // ==========================================
  // STATIC FILES SERVING
  // ==========================================
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  if (reqPath === '/admin' || reqPath === '/admin/') reqPath = '/admin.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found - AQUARIA');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`AQUARIA Server & Backend CMS running on:`);
  console.log(`Storefront: http://localhost:${PORT}`);
  console.log(`Admin Portal: http://localhost:${PORT}/admin`);
  console.log(`REST API: http://localhost:${PORT}/api/data`);
  console.log(`====================================================`);
});
