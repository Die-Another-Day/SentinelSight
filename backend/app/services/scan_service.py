import asyncio
from typing import List
from app.core.icmp import send_icmp_probe, parse_icmp_response
from app.core.traceroute import traceroute
from app.schemas import ProbeResult, ScanResponse, HopInfo
from app.utils.logger import logger


class ScanService:
    async def probe(self, target: str, count: int = 3) -> ScanResponse:
        try:
            tasks = [send_icmp_probe(target, retries=3) for _ in range(count)]
            results: List[ProbeResult] = await asyncio.gather(*tasks)

            avg_rtt = self._average_rtt(
                [result.rtt_ms for result in results if result.rtt_ms is not None]
            )

            return ScanResponse(
                target=target,
                probe_results=results,
                traceroute_results=[],
                summary={
                    "average_rtt_ms": avg_rtt,
                    "probes_sent": count,
                    "mode": "live"
                }
            )

        except PermissionError as e:
            logger.warning(f"ICMP probe blocked by hosting provider: {e}")
            return self._demo_probe_response(target, count)

        except Exception as e:
            logger.error(f"Probe failed: {e}", exc_info=True)
            return self._demo_probe_response(target, count)

    async def traceroute(self, target: str, max_ttl: int = 30) -> ScanResponse:
        try:
            hops = await traceroute(target, max_ttl=max_ttl)

            return ScanResponse(
                target=target,
                probe_results=[],
                traceroute_results=hops,
                summary={
                    "hops": len(hops),
                    "max_ttl": max_ttl,
                    "mode": "live"
                }
            )

        except PermissionError as e:
            logger.warning(f"Traceroute blocked by hosting provider: {e}")
            return self._demo_traceroute_response(target, max_ttl)

        except Exception as e:
            logger.error(f"Traceroute failed: {e}", exc_info=True)
            return self._demo_traceroute_response(target, max_ttl)

    async def full_scan(self, target: str, count: int = 3, max_ttl: int = 30) -> ScanResponse:
        try:
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
                    "mode": probe_response.summary.get("mode", "live"),
                },
            )

        except PermissionError as e:
            logger.warning(f"Full scan blocked by hosting provider: {e}")
            return self._demo_full_scan_response(target, count, max_ttl)

        except Exception as e:
            logger.error(f"Full scan failed: {e}", exc_info=True)
            return self._demo_full_scan_response(target, count, max_ttl)

    @staticmethod
    def _average_rtt(values):
        valid = [value for value in values if value is not None]
        if not valid:
            return None
        return round(sum(valid) / len(valid), 2)

    # =========================
    # DEMO FALLBACK RESPONSES
    # =========================

def _demo_probe_response(self, target: str, count: int) -> ScanResponse:
    results = [
        ProbeResult(
            sequence=i + 1,
            ttl=64,
            rtt_ms=round(18.5 + (i * 4.2), 2),
            source=target,
            success=True,
            icmp_type=0,
            icmp_code=0,
            message="Reply received",
            status="reachable"
        )
        for i in range(count)
    ]

    return ScanResponse(
        target=target,
        probe_results=results,
        traceroute_results=[],
        summary={
            "average_rtt_ms": self._average_rtt([r.rtt_ms for r in results]),
            "probes_sent": count,
            "mode": "demo",
            "message": "Cloud-hosted demo mode enabled"
        }
    )


def _demo_traceroute_response(self, target: str, max_ttl: int) -> ScanResponse:
    hops = [
        HopInfo(
            ttl=1,
            source="192.168.1.1",
            hostname="local-gateway",
            rtt_ms=3.5,
            city="Local Gateway",
            country="Private Network",
            status="reachable",
            icmp_type=11,
            icmp_code=0,
            asn="AS_LOCAL"
        ),
        HopInfo(
            ttl=2,
            source="10.10.0.1",
            hostname="isp-edge",
            rtt_ms=14.8,
            city="Mumbai",
            country="India",
            status="reachable",
            icmp_type=11,
            icmp_code=0,
            asn="AS9498"
        ),
        HopInfo(
            ttl=3,
            source="172.16.0.1",
            hostname="core-router",
            rtt_ms=27.3,
            city="Singapore",
            country="Singapore",
            status="reachable",
            icmp_type=11,
            icmp_code=0,
            asn="AS7473"
        ),
        HopInfo(
            ttl=4,
            source=target,
            hostname="destination",
            rtt_ms=42.1,
            city="Mountain View",
            country="United States",
            status="destination",
            icmp_type=0,
            icmp_code=0,
            asn="AS15169"
        ),
    ]

    return ScanResponse(
        target=target,
        probe_results=[],
        traceroute_results=hops,
        summary={
            "hops": len(hops),
            "max_ttl": max_ttl,
            "mode": "demo",
            "message": "Cloud-hosted demo mode enabled"
        }
    )

    

    def _demo_full_scan_response(self, target: str, count: int, max_ttl: int) -> ScanResponse:
        probe_response = self._demo_probe_response(target, count)
        traceroute_response = self._demo_traceroute_response(target, max_ttl)

        return ScanResponse(
            target=target,
            probe_results=probe_response.probe_results,
            traceroute_results=traceroute_response.traceroute_results,
            summary={
                "average_rtt_ms": probe_response.summary.get("average_rtt_ms"),
                "probes_sent": count,
                "hops": len(traceroute_response.traceroute_results),
                "max_ttl": max_ttl,
                "mode": "demo",
                "message": "Running in cloud-safe simulation mode"
            },
        )