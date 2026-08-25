import type { APIRoute } from 'astro';
import { activeHotels as hotels } from '../data/hotels';

export const GET: APIRoute = () => new Response(JSON.stringify(hotels.map((hotel) => ({
  name: hotel.hotelName,
  slug: hotel.slug,
  region: hotel.region,
  address: hotel.address,
  score: hotel.reviewScore,
  search: `${hotel.hotelName} ${hotel.region} ${hotel.address} ${hotel.analysis.summary}`.toLowerCase()
}))), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400'
  }
});
