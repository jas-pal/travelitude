import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

createServer(async (req, res) => {
  try {
    const urlPath = new URL(req.url, 'http://localhost').pathname;
    const requested = urlPath === '/' ? '/index.html' : urlPath;
    const file = normalize(join(root, requested));
    if (!file.startsWith(root)) throw new Error('Invalid path');
    const fileStat = await stat(file);
    if (!fileStat.isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(4173, () => console.log('Travelitude is running at http://localhost:4173'));
