import asyncio
import requests
from typing import Tuple, Dict
from app.utils.logger import logger
from app.utils.config import settings

_cache: Dict[str, Tuple[str, str, str]] = {}


class GeoIPService:
    async def lookup(self, ip_address: str) -> Tuple[str, str, str]:
        if not ip_address:
            return "Unknown", "Unknown", "ASN Unknown"

        if ip_address in _cache:
            return _cache[ip_address]

        return await asyncio.get_running_loop().run_in_executor(None, self._fetch, ip_address)

    def _fetch(self, ip_address: str) -> Tuple[str, str, str]:
        url = f"https://ipinfo.io/{ip_address}/json"
        headers = {"User-Agent": "SentinelSight/1.0"}
        if settings.IPINFO_TOKEN:
            url = f"https://ipinfo.io/{ip_address}/json?token={settings.IPINFO_TOKEN}"

        try:
            response = requests.get(url, headers=headers, timeout=5)
            response.raise_for_status()
            data = response.json()
            city = data.get("city", "Unknown")
            country = data.get("country", "Unknown")
            asn = data.get("org", "ASN Unknown")
            _cache[ip_address] = (city, country, asn)
            return city, country, asn
        except Exception as exc:
            logger.warning(f"GeoIP lookup failed for {ip_address}: {exc}")
            return "Unknown", "Unknown", "ASN Unknown"
