const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ORDERS_FILE = path.join(ROOT, 'public', 'data', 'orders.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function safeReadOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function safeWriteOrders(data) {
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let relPath = urlPath === '/' ? '/public/index.html' : urlPath;
  const absPath = path.normalize(path.join(ROOT, relPath));

  if (!absPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(absPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(absPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/orders')) {
    if (req.method === 'GET') {
      sendJson(res, 200, safeReadOrders());
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 2e6) req.destroy();
      });
      req.on('end', () => {
        try {
          const order = JSON.parse(body || '{}');
          if (!order || !order.storeId || !order.id) {
            sendJson(res, 400, { error: 'Invalid order payload' });
            return;
          }
          const all = safeReadOrders();
          if (!Array.isArray(all[order.storeId])) all[order.storeId] = [];
          all[order.storeId].unshift(order);
          safeWriteOrders(all);
          sendJson(res, 200, { ok: true });
        } catch {
          sendJson(res, 400, { error: 'Invalid JSON' });
        }
      });
      return;
    }

    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  serveStatic(req, res);
});

const PORT = process.env.PORT || 4173;
server.listen(PORT, () => {
  console.log(`Natural Mountain dev server: http://localhost:${PORT}`);
});
