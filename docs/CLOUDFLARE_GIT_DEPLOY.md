# HotelLog Cloudflare Git deployment

HotelLog uses Git-safe data chunks because GitHub rejects individual files larger than 100 MB.

## Before pushing newly generated hotels

Run:

```text
npm run data:split-for-git
npm run check
npm run build
```

The large local files below are intentionally excluded from Git:

- Agoda CSV inventory
- `data/generated/` collection intermediates
- `src/data/generatedHotels.ts`
- `dist/`, caches, logs, and credentials

Cloudflare reconstructs `src/data/generatedHotels.ts` from `deploy-data/generated-hotels/` during `npm run build`.

## Cloudflare Pages settings

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node version: `22`
- Build timeout requirement: under 20 minutes

For a paid Cloudflare plan, add this production and preview environment variable:

```text
PAGES_WRANGLER_MAJOR_VERSION=4
```

This enables the paid-plan limit of up to 100,000 site files. The Free plan remains limited to 20,000 files.

The current `hotellog` project was created with Direct Upload and cannot be converted to Git integration. Create a separate Git-integrated Pages project, verify its preview domain, and then move `hotel.product-pack.com` to the new project.
