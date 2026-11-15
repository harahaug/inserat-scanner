// Vermittler: nimmt Artikel von der Handy-App entgegen und legt sie in der privaten Warteschlange ab.
// Secrets (nie im Code): GH_TOKEN (GitHub), APP_KEY (gemeinsamer Schlüssel mit der App)
const MAX_PHOTOS = 8;
const MAX_B64 = 3_000_000; // ca. 2,2 MB pro Foto

export default {
  async fetch(req, env) {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    const reply = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return reply({ error: 'POST erwartet' }, 405);
    if (req.headers.get('Origin') !== env.ALLOWED_ORIGIN) return reply({ error: 'Origin nicht erlaubt' }, 403);

    let d;
    try { d = await req.json(); } catch { return reply({ error: 'Ungültige Daten' }, 400); }
    if (!d.key || d.key !== env.APP_KEY) return reply({ error: 'Schlüssel falsch' }, 401);

    const photos = Array.isArray(d.photos) ? d.photos.slice(0, MAX_PHOTOS) : [];
    if (!photos.length && !String(d.ean || '').trim()) return reply({ error: 'EAN oder Foto fehlt' }, 400);
    if (photos.some(p => typeof p !== 'string' || p.length > MAX_B64)) return reply({ error: 'Foto zu groß' }, 413);

    const id = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const gh = (path, init) => fetch(`https://api.github.com/repos/${env.REPO}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${env.GH_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'inserat-relay',
        'Content-Type': 'application/json',
      },
    });

    const files = [];
    for (let i = 0; i < photos.length; i++) {
      const path = `items/${id}/foto${i + 1}.jpg`;
      const r = await gh(`/contents/${path}`, { method: 'PUT', body: JSON.stringify({ message: `Foto ${id}`, content: photos[i] }) });
      if (!r.ok) return reply({ error: 'Foto-Upload fehlgeschlagen (' + r.status + ')' }, 502);
      files.push(path);
    }

    const clean = v => String(v ?? '').replace(/[<>]/g, '').slice(0, 500);
    const ean = clean(d.ean).trim();
    const body = [
      `**EAN/Name:** ${ean || 'nur Foto - bitte per Bild erkennen'}`,
      `**Zustand:** ${clean(d.zustand) || '-'}`,
      `**Zubehör/Mängel:** ${clean(d.notiz) || '-'}`,
      `**Wunschpreis:** ${clean(d.wunsch) || '-'}`,
      `**Versand:** ${clean(d.versand) || '-'}`,
      `**Fotos:** ${files.join(', ') || '-'}`,
      '', `<!-- id:${id} -->`,
    ].join('\n');
    const r = await gh('/issues', {
      method: 'POST',
      body: JSON.stringify({ title: `Artikel ${id}${ean ? ' - ' + ean.slice(0, 60) : ' - nur Foto'}`, body, labels: ['neu'] }),
    });
    if (!r.ok) return reply({ error: 'Issue fehlgeschlagen (' + r.status + ')' }, 502);
    const issue = await r.json();
    return reply({ ok: true, issue: issue.number });
  },
};
