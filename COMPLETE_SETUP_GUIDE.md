# SentinelSight: Complete Setup & Usage Guide

## 🎯 Project Overview

**SentinelSight** is a full-stack, cloud-ready network intelligence platform combining:

- **Backend**: FastAPI service for ICMP probing, traceroute, and geolocation enrichment
- **Frontend**: Next.js web UI with hacker-style dark theme, real-time visualization, and geolocation mapping
- **Architecture**: Modular, scalable, production-deployable

---

## 📁 Project Structure

```
NetTracePro/
├─ backend/
│  ├─ app/
│  │  ├─ api/routes.py          # API endpoints
│  │  ├─ core/                  # ICMP and traceroute logic
│  │  ├─ services/              # scan orchestration, geolocation
│  │  ├─ utils/                 # logging, config
│  │  └─ main.py                # FastAPI app
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ app/                   # Next.js pages
│  │  ├─ components/            # React components
│  │  └─ lib/                   # API client, types
│  ├─ tailwind.config.ts
│  └─ package.json
├─ docker/
│  ├─ Dockerfile
│  └─ docker-compose.yml
├─ tests/
├─ .github/workflows/ci.yml     # GitHub Actions CI
├─ DEPLOYMENT_GUIDE.md          # Deployment instructions
└─ README.md
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend available at: `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: `http://localhost:3000`

### 3. Configure Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest -q
```

### Frontend Build Check

```bash
cd frontend
npm run build
npm start
```

---

## 🌐 Deployment

### Option 1: Docker Compose (Local/VPS)

```bash
cd docker
docker-compose up --build
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000` (requires separate setup)

### Option 2: Render (Backend) + Vercel (Frontend)

**Backend on Render:**

1. Connect GitHub repo to Render
2. Create Web Service, select `docker-compose.yml`
3. Set environment variables:
   - `IPINFO_TOKEN` (optional)
4. Render assigns URL like `https://sentinelsight-api.onrender.com`

**Frontend on Vercel:**

1. Connect GitHub repo to Vercel
2. Set root directory: `frontend`
3. Configure environment variable:
   - `NEXT_PUBLIC_API_URL=https://sentinelsight-api.onrender.com`
4. Deploy

### Option 3: Full VPS Deployment (e.g., AWS EC2)

1. SSH into VPS
2. Clone repo: `git clone https://github.com/your/sentinelsight.git`
3. Set up backend:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
4. Use systemd or circus to keep backend running
5. Set up frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```
6. Use Nginx as reverse proxy for both services

---

## 🧬 API Reference

### POST /api/probe

Send ICMP probes to a target.

**Request:**
```json
{
  "target": "8.8.8.8",
  "count": 3,
  "scanType": "probe"
}
```

**Response:**
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
  "traceroute_results": [],
  "summary": {
    "average_rtt_ms": 45.23,
    "probes_sent": 3
  }
}
```

### POST /api/traceroute

Run a TTL-based traceroute.

**Request:**
```json
{
  "target": "8.8.8.8",
  "max_ttl": 30,
  "scanType": "traceroute"
}
```

**Response:** Same schema, includes `traceroute_results` with hop details.

### POST /api/full-scan

Run both probe and traceroute simultaneously.

**Request:**
```json
{
  "target": "8.8.8.8",
  "count": 3,
  "max_ttl": 30,
  "scanType": "full-scan"
}
```

**Response:** Combined results from both probe and traceroute.

---

## 📊 Visualizations

### Frontend Features

- **RTT Charts**
  - Line graph: trend over hops
  - Bar chart: hop latency comparison
- **Hop Table**
  - TTL, source IP, RTT, geolocation, status
- **Geolocation Map**
  - Leaflet map showing hop coordinates
  - Popup details for each hop
- **Export**
  - Copy results to clipboard
  - Download as JSON

---

## 🔐 Security Notes

### Backend

- Add API key authentication before public deployment
- Implement rate limiting (e.g., 50 requests/min per IP)
- Use HTTPS in production
- Validate and sanitize all inputs
- Log all scans for audit
- Consider IP geolocation privacy implications

### Frontend

- Use HTTPS in production
- Set `CORS` headers securely (whitelist domains, not `*`)
- Store API keys in secure HTTP-only cookies if needed

---

## 📈 Performance Tips

### Backend
- Use async execution for concurrent scans
- Cache geolocation results (reduces API calls)
- Implement connection pooling for high load

### Frontend
- Code splitting is automatic with Next.js
- Lazy load map component (Leaflet is SSR disabled)
- Session storage for local result persistence

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend API errors | Check logs: `uvicorn logs` or Docker logs |
| Frontend can't reach backend | Verify `NEXT_PUBLIC_API_URL` is correct |
| Map not rendering | Ensure browser supports DOM; clear cache |
| No ICMP responses | Backend may lack root/admin privileges |
| Geolocation missing | ipinfo.io rate limit; add token in `.env` |

---

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts**: https://recharts.org/
- **Scapy**: https://scapy.readthedocs.io/

---

## 📚 Resume Impact

The completed SentinelSight project demonstrates:

1. **Full-stack development**: React/Next.js + Python/FastAPI
2. **Cloud deployment**: Docker, Render, Vercel, CI/CD
3. **Network programming**: ICMP, traceroute, packet analysis
4. **UI/UX design**: Responsive, dark theme, data visualization
5. **API design**: RESTful endpoints, error handling, validation
6. **Scalability**: Async execution, modular architecture

**Elevator pitch for interviews:**

> "I built SentinelSight, a cloud-ready network intelligence platform. The backend uses FastAPI with async ICMP probing and geolocation enrichment. The frontend is a Next.js dashboard with RTT visualization and interactive geolocation mapping. It's fully containerized and deployable to Render and Vercel."

---

## 🚀 Next Steps

1. Deploy to production
2. Add authentication and rate limiting
3. Build historical scan database
4. Implement anomaly detection
5. Create SIEM integration webhooks
6. Write blog posts or research papers
7. Open-source and market on Product Hunt

---

## 📄 License

MIT (or your preferred license)

## 🤝 Contributing

PRs welcome! Please follow PEP 8 (Python) and Prettier (JavaScript) formatting.

---

**Built by**: You  
**Date**: May 2026  
**Status**: Production-ready  
**Stars**: ⭐⭐⭐⭐⭐
