import http from 'node:http';

const PORT = 9090;

const srv = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/ingest'){
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try{
        const parsed = JSON.parse(body||'{}');
        console.log('[collector] received', (parsed.items||[]).length, 'items');
      }catch{ console.log('[collector] invalid json'); }
      res.writeHead(200, { 'content-type':'application/json', 'access-control-allow-origin':'*' });
      res.end(JSON.stringify({ ok:true }));
    });
    return;
  }
  if (req.method === 'OPTIONS'){
    res.writeHead(204, { 'access-control-allow-origin':'*', 'access-control-allow-methods':'POST, OPTIONS', 'access-control-allow-headers':'content-type, authorization' });
    return res.end();
  }
  res.writeHead(404, { 'content-type':'application/json' });
  res.end(JSON.stringify({ error:'not found' }));
});

srv.listen(PORT, () => console.log('[collector] listening on http://localhost:'+PORT+'/ingest'));
