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
import { miyagiAreaGuides } from '../data/miyagiAreaGuides';
import { hakoneAreaGuides } from '../data/hakoneAreaGuides';
import { ishikawaAreaGuides } from '../data/ishikawaAreaGuides';
import { toyamaAreaGuides } from '../data/toyamaAreaGuides';
import { fukuiAreaGuides } from '../data/fukuiAreaGuides';
import { niigataAreaGuides } from '../data/niigataAreaGuides';
import { naganoAreaGuides } from '../data/naganoAreaGuides';
import { gifuAreaGuides } from '../data/gifuAreaGuides';
import { shizuokaAreaGuides } from '../data/shizuokaAreaGuides';
import { yamanashiAreaGuides } from '../data/yamanashiAreaGuides';
import { gunmaAreaGuides } from '../data/gunmaAreaGuides';
import { tochigiAreaGuides } from '../data/tochigiAreaGuides';
import { ibarakiAreaGuides } from '../data/ibarakiAreaGuides';
import { saitamaAreaGuides } from '../data/saitamaAreaGuides';
import { fukushimaAreaGuides } from '../data/fukushimaAreaGuides';
import { yamagataAreaGuides } from '../data/yamagataAreaGuides';
import { akitaAreaGuides } from '../data/akitaAreaGuides';
import { iwateAreaGuides } from '../data/iwateAreaGuides';
import { aomoriAreaGuides } from '../data/aomoriAreaGuides';
import { hokkaidoAreaGuides } from '../data/hokkaidoAreaGuides';
import { okayamaAreaGuides } from '../data/okayamaAreaGuides';
import { tottoriAreaGuides } from '../data/tottoriAreaGuides';
import { shimaneAreaGuides } from '../data/shimaneAreaGuides';
import { yamaguchiAreaGuides } from '../data/yamaguchiAreaGuides';
import { kagawaAreaGuides } from '../data/kagawaAreaGuides';
import { tokushimaAreaGuides } from '../data/tokushimaAreaGuides';
import { ehimeAreaGuides } from '../data/ehimeAreaGuides';
import { kochiAreaGuides } from '../data/kochiAreaGuides';
import { mieAreaGuides } from '../data/mieAreaGuides';
import { shigaAreaGuides } from '../data/shigaAreaGuides';
import { naraAreaGuides } from '../data/naraAreaGuides';
import { wakayamaAreaGuides } from '../data/wakayamaAreaGuides';
import { tsushimaAreaGuides } from '../data/tsushimaAreaGuides';
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
    ...miyagiAreaGuides.map((guide) => guide.path),
    ...hakoneAreaGuides.map((guide) => guide.path),
    ...ishikawaAreaGuides.map((guide) => guide.path),
    ...toyamaAreaGuides.map((guide) => guide.path),
    ...fukuiAreaGuides.map((guide) => guide.path),
    ...niigataAreaGuides.map((guide) => guide.path),
    ...naganoAreaGuides.map((guide) => guide.path),
    ...gifuAreaGuides.map((guide) => guide.path),
    ...shizuokaAreaGuides.map((guide) => guide.path),
    ...yamanashiAreaGuides.map((guide) => guide.path),
    ...gunmaAreaGuides.map((guide) => guide.path),
    ...tochigiAreaGuides.map((guide) => guide.path),
    ...ibarakiAreaGuides.map((guide) => guide.path),
    ...saitamaAreaGuides.map((guide) => guide.path),
    ...fukushimaAreaGuides.map((guide) => guide.path),
    ...yamagataAreaGuides.map((guide) => guide.path),
    ...akitaAreaGuides.map((guide) => guide.path),
    ...iwateAreaGuides.map((guide) => guide.path),
    ...aomoriAreaGuides.map((guide) => guide.path),
    ...hokkaidoAreaGuides.map((guide) => guide.path),
    ...okayamaAreaGuides.map((guide) => guide.path),
    ...tottoriAreaGuides.map((guide) => guide.path),
    ...shimaneAreaGuides.map((guide) => guide.path),
    ...yamaguchiAreaGuides.map((guide) => guide.path),
    ...kagawaAreaGuides.map((guide) => guide.path),
    ...tokushimaAreaGuides.map((guide) => guide.path),
    ...ehimeAreaGuides.map((guide) => guide.path),
    ...kochiAreaGuides.map((guide) => guide.path),
    ...mieAreaGuides.map((guide) => guide.path),
    ...shigaAreaGuides.map((guide) => guide.path),
    ...naraAreaGuides.map((guide) => guide.path),
    ...wakayamaAreaGuides.map((guide) => guide.path),
    ...tsushimaAreaGuides.map((guide) => guide.path),
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
