import asyncio
import logging
import time
import os
import platform
from scapy.all import IP, ICMP, sr1, conf
from app.schemas import ProbeResult, HopInfo
from app.utils.logger import logger


def is_admin_user() -> bool:
    if platform.system() == "Windows":
        try:
            import ctypes
            return ctypes.windll.shell32.IsUserAnAdmin() != 0
        except Exception:
            return False
    else:
        return os.geteuid() == 0


def parse_icmp_response(response, target_ip: str, sent_time: float) -> ProbeResult:
    if response is None:
        return ProbeResult(
            success=False,
            source=target_ip,
            icmp_type=None,
            icmp_code=None,
            rtt_ms=None,
            message="timeout"
        )

    if not response.haslayer(ICMP):
        return ProbeResult(
            success=False,
            source=response[IP].src,
            icmp_type=None,
            icmp_code=None,
            rtt_ms=None,
            message="non-ICMP response"
        )

    icmp_layer = response.getlayer(ICMP)
    rtt_ms = round((time.time() - sent_time) * 1000, 2)

    message = ""
    if icmp_layer.type == 0:
        message = "echo-reply"
    elif icmp_layer.type == 3:
        message = "destination-unreachable"
    elif icmp_layer.type == 11:
        message = "time-exceeded"
    else:
        message = f"icmp-type-{icmp_layer.type}"

    return ProbeResult(
        success=True,
        source=response[IP].src,
        icmp_type=icmp_layer.type,
        icmp_code=icmp_layer.code,
        rtt_ms=rtt_ms,
        message=message
    )


def send_icmp_packet(target_ip: str, timeout: float = 2.0):
    packet = IP(dst=target_ip) / ICMP()
    logger.debug(f"Sending ICMP probe to {target_ip}")
    return sr1(packet, timeout=timeout, verbose=0)


async def send_icmp_probe(target_ip: str, retries: int = 3, timeout: float = 2.0):
    if not is_admin_user():
        raise PermissionError("ICMP probing requires root/administrator privileges.")

    loop = asyncio.get_running_loop()
    for attempt in range(1, retries + 1):
        sent_time = time.time()
        response = await loop.run_in_executor(None, send_icmp_packet, target_ip, timeout)
        result = parse_icmp_response(response, target_ip, sent_time)
        if result.success or attempt == retries:
            return result
        logger.warning(f"Probe retry {attempt}/{retries} for {target_ip}")
    return result


async def send_icmp_traceroute_probe(target_ip: str, ttl: int, timeout: float = 2.0):
    if not is_admin_user():
        raise PermissionError("Traceroute requires root/administrator privileges.")

    loop = asyncio.get_running_loop()
    packet = IP(dst=target_ip, ttl=ttl) / ICMP()
    sent_time = time.time()
    logger.debug(f"Sending traceroute packet to {target_ip} with ttl={ttl}")
    response = await loop.run_in_executor(None, sr1, packet, timeout, 0)
    return response, sent_time
