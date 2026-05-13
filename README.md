# SentinelSight

> Cloud-ready network intelligence and traceroute visualization platform built with FastAPI, Next.js, and Docker.

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/backend-FastAPI-blue)
![Next.js](https://img.shields.io/badge/frontend-Next.js-black)
![Deployment](https://img.shields.io/badge/deployment-Render%20%2B%20Vercel-success)

---

## Overview

SentinelSight is a full-stack network intelligence platform designed for:

- ICMP probing
- Traceroute analysis
- RTT latency visualization
- Hop-by-hop route mapping
- Geolocation enrichment
- Interactive web-based monitoring dashboard

The platform combines a FastAPI backend with a modern Next.js frontend and supports cloud deployment using Render and Vercel.

---

## Live Deployment

### Frontend
https://sentineltrace.vercel.app

### Backend API Docs
https://nettracepro.onrender.com/docs

---

# Features

## Backend
- FastAPI REST API
- ICMP probing
- Traceroute scanning
- Async scan execution
- Geolocation enrichment
- Structured logging
- Modular architecture

## Frontend
- Hacker-style responsive UI
- Real-time scan dashboard
- RTT latency charts
- Hop visualization
- Interactive geolocation map
- Export scan results as JSON
- Session persistence

## DevOps
- Docker support
- Render deployment
- Vercel deployment
- GitHub Actions CI-ready

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, TailwindCSS |
| Backend | FastAPI, Python |
| Networking | Scapy |
| Charts | Recharts |
| Maps | Leaflet |
| Deployment | Render, Vercel |
| Containerization | Docker |

---

# Project Structure

```bash
NetTracePro/
├── backend/
├── frontend/
├── docker/
├── tests/
├── README.md
└── LICENSE
