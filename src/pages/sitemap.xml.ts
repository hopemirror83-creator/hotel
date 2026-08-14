import type { APIRoute } from 'astro';
import { activeHotels as hotels } from '../data/hotels';
import { yeongjongGuides } from '../data/decisionGuides';
import { incheonAreaGuides } from '../data/incheonAreaGuides';
import { seoulAreaGuides } from '../data/seoulAreaGuides';
import { busanAreaGuides } from '../data/busanAreaGuides';
import { gyeonggiAreaGuides } from '../data/gyeonggiAreaGuides';
import { jejuAreaGuides } from '../data/jejuAreaGuides';
import { gangwonAreaGuides } from '../data/gangwonAreaGuides';
import { jeonnamAreaGuides } from '../data/jeonnamAreaGuides';
import { jeonbukAreaGuides } from '../data/jeonbukAreaGuides';
import { gyeongbukAreaGuides } from '../data/gyeongbukAreaGuides';
import { gyeongnamAreaGuides } from '../data/gyeongnamAreaGuides';
import { chungbukAreaGuides } from '../data/chungbukAreaGuides';
import { chungnamAreaGuides } from '../data/chungnamAreaGuides';
import { daeguAreaGuides } from '../data/daeguAreaGuides';
import { daejeonAreaGuides } from '../data/daejeonAreaGuides';
import { gwangjuAreaGuides } from '../data/gwangjuAreaGuides';
import { ulsanAreaGuides } from '../data/ulsanAreaGuides';
import { osakaAreaGuides } from '../data/osakaAreaGuides';
import { tokyoAreaGuides } from '../data/tokyoAreaGuides';
import { fukuokaAreaGuides } from '../data/fukuokaAreaGuides';
import { kyotoAreaGuides } from '../data/kyotoAreaGuides';
import { sapporoAreaGuides } from '../data/sapporoAreaGuides';
import { okinawaAreaGuides } from '../data/okinawaAreaGuides';
import { nagoyaAreaGuides } from '../data/nagoyaAreaGuides';
import { hiroshimaAreaGuides } from '../data/hiroshimaAreaGuides';
import { kobeAreaGuides } from '../data/kobeAreaGuides';
import { yokohamaAreaGuides } from '../data/yokohamaAreaGuides';
import { chibaAreaGuides } from '../data/chibaAreaGuides';
import { multilingualHotels } from '../data/multilingualHotels';
import { multilingualRegions } from '../data/multilingualRegions';

export const GET: APIRoute = ({ site }) => {
  const multilingualSlugs = Object.keys(multilingualHotels);
  const urls = [
    '/',
    '/about/',
    '/privacy/',
    '/correction/',
    '/admin/',
    ...yeongjongGuides.map((guide) => guide.path),
    ...incheonAreaGuides.map((guide) => guide.path),
    ...seoulAreaGuides.map((guide) => guide.path),
    ...busanAreaGuides.map((guide) => guide.path),
    ...gyeonggiAreaGuides.map((guide) => guide.path),
    ...jejuAreaGuides.map((guide) => guide.path),
    ...gangwonAreaGuides.map((guide) => guide.path),
    ...jeonnamAreaGuides.map((guide) => guide.path),
    ...jeonbukAreaGuides.map((guide) => guide.path),
    ...chungbukAreaGuides.map((guide) => guide.path),
    ...chungnamAreaGuides.map((guide) => guide.path),
    ...daeguAreaGuides.map((guide) => guide.path),
    ...daejeonAreaGuides.map((guide) => guide.path),
    ...gwangjuAreaGuides.map((guide) => guide.path),
    ...ulsanAreaGuides.map((guide) => guide.path),
    ...osakaAreaGuides.map((guide) => guide.path),
    ...tokyoAreaGuides.map((guide) => guide.path),
    ...fukuokaAreaGuides.map((guide) => guide.path),
    ...kyotoAreaGuides.map((guide) => guide.path),
    ...sapporoAreaGuides.map((guide) => guide.path),
    ...okinawaAreaGuides.map((guide) => guide.path),
    ...nagoyaAreaGuides.map((guide) => guide.path),
    ...hiroshimaAreaGuides.map((guide) => guide.path),
    ...kobeAreaGuides.map((guide) => guide.path),
    ...yokohamaAreaGuides.map((guide) => guide.path),
    ...chibaAreaGuides.map((guide) => guide.path),
    ...gyeongbukAreaGuides.map((guide) => guide.path),
    ...gyeongnamAreaGuides.map((guide) => guide.path),
    ...hotels.map((hotel) => `/hotel/${hotel.slug}/`),
    '/en/',
    '/ja/',
    ...Object.values(multilingualRegions).flatMap((region) => [`/en/${region.localePath}/`, `/ja/${region.localePath}/`]),
    ...multilingualSlugs.flatMap((slug) => [`/en/hotel/${slug}/`, `/ja/hotel/${slug}/`])
  ]
    .map((path) => `<url><loc>${new URL(path, site)}</loc></url>`)
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
