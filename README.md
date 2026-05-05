# SentinelSight Network Intelligence Platform

SentinelSight is the production-grade evolution of NetTracePro. It transforms the original ICMP probe and traceroute script into a modular, cloud-ready security intelligence platform with a backend API, deployment pipeline, and research-grade architecture.

## Project Structure

- `backend/` — FastAPI backend service for ICMP probes, traceroute, and full-scan orchestration
- `frontend/` — React/Next.js web UI scaffold for browser-based interaction
- `docker/` — Docker containerization and compose orchestration
- `tests/` — Unit and API tests for backend validation
- `.github/workflows/ci.yml` — GitHub Actions CI pipeline

## What it does

- Provides structured JSON endpoints for ICMP probe, traceroute, and combined network scan
- Uses backend host privileges for ICMP while keeping the browser layer safe
- Enriches hop metadata with geolocation and ASN intelligence
- Exposes a deployable API for dashboards, SIEM integration, and network monitoring

## Quick Start

1. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

2. Run backend locally:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3. Open Swagger UI:

- `http://localhost:8000/docs`

## Deployment

- `docker/Dockerfile` for containerized backend
- `docker/docker-compose.yml` for local service orchestration
- Readme content below includes deployment paths for Render/Railway and Vercel

## Next Steps

- Build and deploy frontend in `frontend/`
- Add API key authorization and rate limiting
- Add persistent storage for historical route tracking
- Add dashboard analytics and anomaly detection
- Use this platform for network intelligence research and SIEM integration

