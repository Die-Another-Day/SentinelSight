# SentinelSight Frontend - Deployment & Architecture

## Project Overview

**SentinelSight Frontend** is a production-ready **Next.js application** that provides a modern, hacker-style interface to the backend network intelligence API. It allows users to run ICMP probes, traceroute scans, and full-path analysis from their browser.

---

## Architecture

### Component Structure

```
src/
├─ app/
│  ├─ page.tsx                 # Home / dashboard landing page
│  ├─ scan/page.tsx            # Scan input and live preview
│  ├─ results/page.tsx         # Results detail page
│  ├─ layout.tsx               # Root layout
│  └─ globals.css              # Global Tailwind + custom styles
├─ components/
│  ├─ ScanForm.tsx             # Input form for target/probes/scan type
│  ├─ StatusPanel.tsx          # Live status indicators
│  ├─ ResultCharts.tsx         # RTT graphs (line + bar charts)
│  ├─ HopTable.tsx             # Hop-by-hop table display
│  ├─ GeoMap.tsx               # Leaflet geolocation map
│  └─ ActionBar.tsx            # Copy / download actions
└─ lib/
   ├─ api.ts                   # Backend fetch wrapper
   └─ types.ts                 # TypeScript interfaces
```

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Mapping**: React-Leaflet + Leaflet
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## Frontend Features

### 1. Home Page (`/`)
- Hero section with call-to-action
- Feature cards (live scanning, path intelligence, secure delivery)
- Link to scan console

### 2. Scan Page (`/scan`)
- Input form for target IP/domain
- Probe count slider
- Scan type selector (probe, traceroute, full scan)
- Live status panel with RTT and hop count
- Preview charts and hop table
- Geolocation map preview

### 3. Results Page (`/results`)
- Full scan results with target info
- Detailed RTT line and bar charts
- Hop-by-hop table with geolocation data
- Copy-to-clipboard and JSON download actions
- Full geolocation map

---

## API Integration

### Backend Endpoints

```
POST /api/probe
POST /api/traceroute
POST /api/full-scan
```

### Example Request (Frontend)

```typescript
const response = await fetch('http://localhost:8000/api/full-scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    target: '8.8.8.8',
    count: 3,
    scanType: 'full-scan'
  })
});
```

### Response Schema

```json
{
  "target": "8.8.8.8",
  "probe_results": [
    {
      "success": true,
      "source": "8.8.8.8",
      "icmp_type": 0,
      "icmp_code": 0,
      "rtt_ms": 45.23,
      "message": "echo-reply"
    }
  ],
  "traceroute_results": [
    {
      "ttl": 1,
      "source": "192.168.1.1",
      "icmp_type": 11,
      "icmp_code": 0,
      "rtt_ms": 2.15,
      "city": "New York",
      "country": "US",
      "asn": "AS1234 ISP",
      "status": "time-exceeded"
    }
  ],
  "summary": {
    "average_rtt_ms": 45.23,
    "probes_sent": 3,
    "hops": 8,
    "max_ttl": 30
  }
}
```

---

## Environment Configuration

### Local Development

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Production (Vercel)

1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-domain.com`

---

## Local Development

### Install Dependencies

```bash
cd frontend
npm install
<!-- ``` -->

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in a browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Frontend: SentinelSight UI"
git push origin main
```

### Step 2: Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import the GitHub repository
4. Select `frontend` folder as root
5. Click "Deploy"

### Step 3: Configure Environment Variables

1. In Vercel project settings, go to Environment Variables
2. Add:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-domain.com` (e.g., `https://sentinelsight-api.render.com`)
   - Environment: Production, Preview, Development
3. Redeploy

---

## Alternative Deployment Options

### Docker Deployment

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t sentinelsight-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://backend:8000 sentinelsight-frontend
```

### Self-Hosted Deployment

1. Build: `npm run build`
2. Deploy `out/` folder to any static host (Netlify, GitHub Pages, S3 + CloudFront)
3. Set environment variable `NEXT_PUBLIC_API_URL` in CI/CD

---

## Security Considerations

### 1. CORS Policy

The backend must allow CORS:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)
```

### 2. Rate Limiting

Backend should implement per-IP rate limiting to prevent abuse.

### 3. API Authentication

Consider adding API keys or OAuth for production:

```typescript
headers: {
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
}
```

### 4. HTTPS

Always use HTTPS in production to protect data in transit.

---

## Performance Optimization

### Code Splitting

Next.js automatically code-splits routes. No additional configuration needed.

### Image Optimization

Use `next/image` for optimized images (not required in this app).

### Caching

- Session storage for scan results
- Client-side caching of geolocation data (backend handles)

---

## Testing

### Unit Tests (Jest)

```bash
npm run test
```

### E2E Tests (Playwright)

```bash
npm install -D @playwright/test
npx playwright test
```

---

## Troubleshooting

### Issue: "Cannot reach backend"

**Solution**: Ensure `NEXT_PUBLIC_API_URL` is set correctly and the backend is running.

### Issue: "Map not loading"

**Solution**: Leaflet requires browser DOM. Ensure `dynamic` import with SSR disabled in `GeoMap.tsx`.

### Issue: "Build fails with TypeScript errors"

**Solution**: Run `npm run lint` and fix type issues.

---

## Resume Bullet Points

- Built a production-ready Next.js frontend with TypeScript and Tailwind CSS
- Integrated live visualization of network path data with Recharts and Leaflet
- Implemented secure client-server architecture with environment-based backend URL configuration
- Deployed to Vercel with environment variable management and CI/CD integration
- Designed a hacker-style UI with dark theme, neon accents, and smooth animations

---

## Next Steps

1. Deploy backend to Render/Railway/VPS
2. Deploy frontend to Vercel
3. Configure environment variables
4. Add API rate limiting and authentication
5. Monitor performance with Vercel Analytics
6. Gather user feedback and iterate
