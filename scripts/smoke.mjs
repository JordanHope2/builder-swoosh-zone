import fetch from 'node-fetch';
const base = process.argv[2] || 'https://jobequal.ch';
const urls = ['/', '/healthz'];
for (const u of urls) {
  const r = await fetch(base + u, { redirect: 'manual' });
  console.log(u, r.status, r.headers.get('content-type'));
  if (r.status >= 400) process.exitCode = 1;
}
