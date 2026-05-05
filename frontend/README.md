# SentinelSight Frontend

This directory is reserved for the SentinelSight web UI. The frontend will be a modern React/Next.js application that communicates with the backend API to perform:

- IP/domain input
- live scan progress
- hop-by-hop traceroute visualization
- RTT charts and geolocation mapping

## Recommended stack

- Next.js
- TypeScript
- Tailwind CSS or Chakra UI
- Recharts / Chart.js
- Mapbox or Leaflet for geolocation mapping

## Development

Install dependencies and start the app locally:

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment

Copy `.env.local.example` to `.env.local` and set your backend URL:

```bash
cp .env.local.example .env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

1. Push the `frontend` directory to Vercel.
2. Add environment variable `NEXT_PUBLIC_API_URL` in the Vercel dashboard.
3. Deploy the app.

The frontend will call the backend API at the configured base URL.

