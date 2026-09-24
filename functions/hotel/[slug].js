const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REMOVED_SLUGS = new Set([
  'chungbuk-21880638',
  'incheon-1032044',
  'incheon-10576683',
  'incheon-1624158',
  'incheon-1636517',
  'incheon-2090114',
  'incheon-22990365',
  'incheon-23093128',
  'incheon-2325348',
  'incheon-26058310',
  'incheon-305614',
  'incheon-35535580',
  'incheon-400646',
  'incheon-529252',
  'incheon-567942',
  'incheon-626079',
  'incheon-689954',
  'seoul-14652666',
  'seoul-1619377',
  'seoul-2100602',
  'seoul-2234023',
  'seoul-248561',
  'seoul-2615262',
  'seoul-31249339',
  'seoul-344200',
  'seoul-400581',
  'seoul-4123789',
  'seoul-885795',
  'seoul-394418',
  'seoul-43373',
  'seoul-6775314',
  'seoul-36902913',
  'seoul-24010208',
  'seoul-6716763',
  'seoul-336541',
  'seoul-1061737',
  'seoul-295082',
  'gyeonggi-10247448',
  'gyeonggi-1030867',
  'gyeonggi-11031875',
  'gyeonggi-12033695',
  'gyeonggi-2526448',
  'gyeonggi-256674',
  'gyeonggi-2639334',
  'gyeonggi-267352',
  'gyeonggi-26931602',
  'gyeonggi-26980987',
  'gyeonggi-27836595',
  'gyeonggi-28197463',
  'gyeonggi-291253',
  'gyeonggi-297518',
  'gyeonggi-31070456',
  'gyeonggi-31435230',
  'gyeonggi-32784686',
  'gyeonggi-32982334',
  'gyeonggi-33751918',
  'gyeonggi-34154718',
  'gyeonggi-3463708',
  'gyeonggi-3653470',
  'gyeonggi-36819536',
  'gyeonggi-400902',
  'gyeonggi-406965',
  'gyeonggi-4145758',
  'gyeonggi-48417',
  'gyeonggi-572330',
  'gyeonggi-6358948',
  'gyeonggi-6548065',
  'gyeonggi-666025',
  'gyeonggi-6953947',
  'gyeonggi-6953967',
  'gyeonggi-7360616',
  'gyeonggi-781403',
  'gyeonggi-807091',
  'gyeonggi-8262505',
  'gyeonggi-916119',
  'gyeonggi-926681',
  'gyeonggi-995818',
  'gyeonggi-31214580',
  'gyeonggi-21125570',
  'gyeonggi-6865315',
  'gyeonggi-10589755',
  'gyeonggi-5212146',
]);

export async function onRequestGet(context) {
  const slug = String(context.params.slug || '').toLowerCase();

  if (!SLUG_PATTERN.test(slug)) {
    return new Response('Not found', { status: 404 });
  }

  if (REMOVED_SLUGS.has(slug)) {
    return new Response('Gone', {
      status: 410,
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=86400',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
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
