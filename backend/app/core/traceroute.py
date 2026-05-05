import asyncio
from typing import List
from app.core.icmp import send_icmp_traceroute_probe, parse_icmp_response
from app.schemas import HopInfo
from app.services.geoip import GeoIPService
from app.utils.logger import logger


async def traceroute(target_ip: str, max_ttl: int = 30, timeout: float = 2.0):
    hops: List[HopInfo] = []
    geo_service = GeoIPService()

    for ttl in range(1, max_ttl + 1):
        response, sent_time = await send_icmp_traceroute_probe(target_ip, ttl, timeout)
        if response is None:
            logger.debug(f"TTL={ttl} no response")
            hops.append(HopInfo(ttl=ttl, source=None, icmp_type=None, icmp_code=None, rtt_ms=None, city=None, country=None, asn=None, status="timeout"))
            continue

        probe = parse_icmp_response(response, target_ip, sent_time)
        city, country, asn = await geo_service.lookup(response["IP"].src)

        status = probe.message
        if response["IP"].src == target_ip and probe.icmp_type == 0:
            status = "reached-target"

        hop = HopInfo(
            ttl=ttl,
            source=response["IP"].src,
            icmp_type=probe.icmp_type,
            icmp_code=probe.icmp_code,
            rtt_ms=probe.rtt_ms,
            city=city,
            country=country,
            asn=asn,
            status=status,
        )
        hops.append(hop)

        if status == "reached-target":
            break

    return hops
