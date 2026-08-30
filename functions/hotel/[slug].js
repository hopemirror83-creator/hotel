const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function onRequestGet(context) {
  const slug = String(context.params.slug || '').toLowerCase();

  if (!SLUG_PATTERN.test(slug)) {
    return new Response('Not found', { status: 404 });
  }

  const page = await context.env.DB.prepare(
    'SELECT html, content_hash, updated_at FROM rendered_hotel_pages WHERE slug = ?1',
  ).bind(slug).first();

  if (!page) {
    return context.next();
  }

  const etag = `"${page.content_hash}"`;
  if (context.request.headers.get('If-None-Match') === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag },
    });
  }

  return new Response(page.html, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
      ETag: etag,
      'Last-Modified': new Date(`${page.updated_at}Z`).toUTCString(),
      'X-HotelLog-Source': 'd1',
    },
  });
}

export function onRequest(context) {
  if (context.request.method === 'GET' || context.request.method === 'HEAD') {
    return onRequestGet(context);
  }

  return new Response('Method not allowed', {
    status: 405,
    headers: { Allow: 'GET, HEAD' },
  });
}
