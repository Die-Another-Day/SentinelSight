import pytest
from app.services.scan_service import ScanService

service = ScanService()


@pytest.mark.asyncio
async def test_average_rtt_empty_results():
    response = await service.probe("127.0.0.1", count=1)
    assert response.target == "127.0.0.1"
    assert "probes_sent" in response.summary
