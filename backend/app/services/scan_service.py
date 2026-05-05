import asyncio
from typing import List
from app.core.icmp import send_icmp_probe, parse_icmp_response
from app.core.traceroute import traceroute
from app.schemas import ProbeResult, ScanResponse, HopInfo
from app.utils.logger import logger


class ScanService:
    async def probe(self, target: str, count: int = 3) -> ScanResponse:
        tasks = [send_icmp_probe(target, retries=3) for _ in range(count)]
        results: List[ProbeResult] = await asyncio.gather(*tasks)
        avg_rtt = self._average_rtt([result.rtt_ms for result in results if result.rtt_ms is not None])
        return ScanResponse(
            target=target,
            probe_results=results,
            traceroute_results=[],
            summary={"average_rtt_ms": avg_rtt, "probes_sent": count}
        )

    async def traceroute(self, target: str, max_ttl: int = 30) -> ScanResponse:
        hops = await traceroute(target, max_ttl=max_ttl)
        return ScanResponse(
            target=target,
            probe_results=[],
            traceroute_results=hops,
            summary={"hops": len(hops), "max_ttl": max_ttl}
        )

    async def full_scan(self, target: str, count: int = 3, max_ttl: int = 30) -> ScanResponse:
        probe_response, traceroute_response = await asyncio.gather(
            self.probe(target, count),
            self.traceroute(target, max_ttl)
        )

        return ScanResponse(
            target=target,
            probe_results=probe_response.probe_results,
            traceroute_results=traceroute_response.traceroute_results,
            summary={
                "average_rtt_ms": probe_response.summary.get("average_rtt_ms"),
                "probes_sent": probe_response.summary.get("probes_sent"),
                "hops": traceroute_response.summary.get("hops"),
                "max_ttl": traceroute_response.summary.get("max_ttl"),
            },
        )

    @staticmethod
    def _average_rtt(values):
        valid = [value for value in values if value is not None]
        if not valid:
            return None
        return round(sum(valid) / len(valid), 2)
