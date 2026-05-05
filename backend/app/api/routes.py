from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.schemas import ProbeRequest, TracerouteRequest, FullScanRequest, ScanResponse
from app.services.scan_service import ScanService
from app.utils.logger import logger

router = APIRouter()
service = ScanService()


@router.post("/probe", response_model=ScanResponse)
async def probe_endpoint(payload: ProbeRequest):
    logger.info(f"Received probe request for target={payload.target} count={payload.count}")
    try:
        result = await service.probe(payload.target, payload.count)
        return result
    except Exception as exc:
        logger.exception("Probe endpoint failed")
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/traceroute", response_model=ScanResponse)
async def traceroute_endpoint(payload: TracerouteRequest):
    logger.info(f"Received traceroute request for target={payload.target} max_ttl={payload.max_ttl}")
    try:
        result = await service.traceroute(payload.target, payload.max_ttl)
        return result
    except Exception as exc:
        logger.exception("Traceroute endpoint failed")
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/full-scan", response_model=ScanResponse)
async def full_scan_endpoint(payload: FullScanRequest, background_tasks: BackgroundTasks):
    logger.info(f"Received full scan request for target={payload.target} count={payload.count} max_ttl={payload.max_ttl}")
    try:
        result = await service.full_scan(payload.target, payload.count, payload.max_ttl)
        return result
    except Exception as exc:
        logger.exception("Full scan endpoint failed")
        raise HTTPException(status_code=500, detail=str(exc))
