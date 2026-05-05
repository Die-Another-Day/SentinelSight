from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.utils.logger import configure_logging

configure_logging()

app = FastAPI(
    title="SentinelSight Network Intelligence API",
    version="0.1.0",
    description="Backend API for ICMP probing, traceroute, and network path intelligence."
)

app.include_router(router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "SentinelSight Network Intelligence"}
